import { z } from 'zod';

export const createPassportSchema = z.object({
  fullName: z.string().transform((val) => val.toUpperCase()),
  phone: z.string(),
  email: z.email(),
  passportNo: z.string().transform((val) => val.toUpperCase()),
  dob: z.iso.datetime(),
  expiryDate: z.iso.datetime(),
  remarks: z.string().optional(),
});

export const updatePassportSchema = createPassportSchema.partial();
