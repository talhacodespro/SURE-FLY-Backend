import z from 'zod';

export const createPaymentMethodSchema = z.object({
  accountName: z
    .string()
    .min(3)
    .transform((val) => val.toUpperCase()),
  accountNumber: z.string().min(5),
  bankName: z
    .string()
    .min(3)
    .transform((val) => val.toUpperCase()),
  balance: z.number().min(0),
});
