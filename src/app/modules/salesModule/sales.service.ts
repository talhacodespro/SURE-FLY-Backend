import prisma from '@/app/lib/prisma';
import AppError from '@/app/errors/AppError';
import httpStatus from 'http-status';
import { SaleType } from '@/generated/enums';

const createSale = async (payload: any, createdById: number) => {
  const { ticket, visa, ...saleData } = payload;

  return await prisma.$transaction(async (tx) => {
    let ticketId: number | null = null;
    let visaId: number | null = null;

    if (saleData.type === SaleType.TICKET) {
      const t = await tx.ticket.create({ data: ticket });
      ticketId = t.id;
    }

    if (saleData.type === SaleType.VISA) {
      const v = await tx.visa.create({ data: visa });
      visaId = v.id;
    }

    const sale = await tx.sale.create({
      data: {
        ...saleData,
        createdById,
        ticketId,
        visaId,
      },
    });

    // ✅ Client → receivable
    await tx.transaction.create({
      data: {
        type: 'INVOICE',
        direction: 'DEBIT',
        amount: saleData.companyAmount,
        companyId: saleData.companyId,
        saleId: sale.id,
        createdById,
      },
    });

    // ✅ Supplier → payable
    await tx.transaction.create({
      data: {
        type: 'INVOICE',
        direction: 'CREDIT',
        amount: saleData.purchaseAmount,
        companyId: saleData.purchaseFromId,
        saleId: sale.id,
        createdById,
      },
    });

    return sale;
  });
};

const getSales = async () => {
  return prisma.sale.findMany({
    include: {
      passport: true,
      company: true,
      purchaseFrom: true,
      ticket: true,
      visa: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getSaleById = async (id: number) => {
  const result = await prisma.sale.findUnique({
    where: { id },
    include: {
      passport: true,
      company: true,
      purchaseFrom: true,
      ticket: true,
      visa: true,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sale not found');
  }
  return result;
};

const updateSale = async (id: number, payload: any) => {
  const { ticket, visa, ...saleData } = payload;

  const exists = await prisma.sale.findUnique({
    where: { id },
    include: { ticket: true, visa: true },
  });

  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sale not found');
  }

  return await prisma.$transaction(async (tx) => {
    if (exists.ticketId && ticket) {
      await tx.ticket.update({
        where: { id: exists.ticketId },
        data: ticket,
      });
    }

    if (exists.visaId && visa) {
      await tx.visa.update({
        where: { id: exists.visaId },
        data: visa,
      });
    }

    const result = await tx.sale.update({
      where: { id },
      data: saleData,
    });

    await tx.transaction.deleteMany({
      where: { saleId: id },
    });

    // ✅ Client → receivable
    await tx.transaction.create({
      data: {
        type: 'INVOICE',
        direction: 'DEBIT',
        amount: saleData.companyAmount,
        companyId: saleData.companyId,
        saleId: id,
        createdById: exists.createdById,
      },
    });

    // ✅ Supplier → payable
    await tx.transaction.create({
      data: {
        type: 'INVOICE',
        direction: 'CREDIT',
        amount: saleData.purchaseAmount,
        companyId: saleData.purchaseFromId,
        saleId: id,
        createdById: exists.createdById,
      },
    });

    return result;
  });
};

const deleteSale = async (id: number) => {
  const exists = await prisma.sale.findUnique({ where: { id } });
  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sale not found');
  }

  return await prisma.$transaction(async (tx) => {
    const result = await tx.sale.delete({ where: { id } });

    if (exists.ticketId) {
      await tx.ticket.delete({ where: { id: exists.ticketId } });
    }

    if (exists.visaId) {
      await tx.visa.delete({ where: { id: exists.visaId } });
    }

    return result;
  });
};

const SalesService = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
};

export default SalesService;
