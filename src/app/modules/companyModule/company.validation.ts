import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().transform((v) => v.toUpperCase()),
  phone: z.string(),
  email: z.email(),
  contactName: z.string().transform((v) => v.toUpperCase()),
  contactPhone: z.string(),
  address: z.string(),
  remarks: z.string(),
});

export const updateCompanySchema = createCompanySchema.partial();
