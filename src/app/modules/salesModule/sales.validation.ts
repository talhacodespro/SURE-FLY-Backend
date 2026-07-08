import { z } from 'zod';
import { SaleType, TicketStatus, VisaStatus } from '@/generated/enums';

export const createTicketSchema = z.object({
  ticketNo: z.string().transform((val) => val.toUpperCase()),
  issueDate: z.iso.datetime(),
  sector: z.string().transform((val) => val.toUpperCase()),
  pnr: z.string().transform((val) => val.toUpperCase()),
  air: z.string().transform((val) => val.toUpperCase()),
  flightDate: z.iso.datetime(),
  status: z.enum(TicketStatus).optional(),
});

export const createVisaSchema = z.object({
  country: z.string(),
  visaType: z.string(),
  status: z.enum(VisaStatus).optional(),
});

export const createSaleSchema = z.object({
  type: z.enum(SaleType),
  purchaseAmount: z.number().positive(),
  companyAmount: z.number().positive(),
  remarks: z.string().optional(),
  passportId: z.number().int().positive(),
  companyId: z.number().int().positive(),
  purchaseFromId: z.number().int().positive(),
  ticket: createTicketSchema.optional(),
  visa: createVisaSchema.optional(),
});

export const updateSaleSchema = createSaleSchema.partial();

export const SalesValidation = {
  createSaleSchema,
  updateSaleSchema,
};
