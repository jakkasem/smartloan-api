import { z } from 'zod';

export const loanApplySchema = z.object({
  customerName:     z.string().trim().min(1, 'customerName is required'),
  nationalId:       z.string().trim().regex(/^\d{13}$/, 'nationalId must be exactly 13 digits'),
  dob:              z.string().trim()
                      .regex(/^\d{4}-\d{2}-\d{2}$/, 'dob must be in YYYY-MM-DD format')
                      .refine(val => !isNaN(new Date(val).getTime()), 'dob must be a valid date'),
  address:          z.string().trim().min(1, 'address is required'),
  phoneNumber:      z.string().trim().regex(/^0\d{8,9}$/, 'phoneNumber must be a valid Thai phone number (e.g. 0812345678)'),
  email:            z.string().trim().email('email must be a valid email'),
  maritalStatusId:  z.number().int().positive(),
  companyName:      z.string().trim().optional(),
  positionId:       z.number().int().positive().optional(),
  employmentPeriod: z.number().optional(),
  annualIncome:     z.number().positive().optional(),
  officeNumber:     z.string().trim().optional(),
  loanAmount:       z.number().positive('loanAmount must be positive'),
  purposeId:        z.number().int().positive(),
  termId:           z.number().int().positive(),
  homeOwnershipId:    z.number().int().positive(),
  applicationTypeId:  z.number().int().positive().optional(),
  incomeCateId:       z.number().int().positive().optional(),
  debtIncRatio:       z.number().optional(),
  interestRate:       z.number().optional(),
  grade:              z.string().trim().optional(),
  loanCondition:      z.number().int().optional(),
  installment:        z.number().optional(),
  interestPayTypeId:  z.number().int().positive().optional(),
  totalPayment:       z.number().optional(),
  totalRecPrincipal:  z.number().optional(),
  recoveries:         z.number().optional(),
  finalDate:          z.string().trim()
                        .regex(/^\d{4}-\d{2}-\d{2}$/, 'finalDate must be in YYYY-MM-DD format')
                        .refine(val => !isNaN(new Date(val).getTime()), 'finalDate must be a valid date')
                        .optional(),
  debtTypeIds:        z.array(z.number().int().positive()).optional().default([]),
});

export const loanUpdateInfoSchema = z.object({
  id:     z.number().int().positive(),
  status: z.enum(['PENDING', 'REVIEW', 'APPROVED', 'REJECTED']),
});

export const loanUpdateAiScoreSchema = z.object({
  id:      z.number().int().positive(),
  aiScore: z.number().min(0).max(100),
  aiRisk:  z.string().min(1, 'aiRisk is required'),
});

/** Parse & return { data } or throw 400-friendly error object */
export function parseBody(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const error = new Error('Validation error');
    error.statusCode = 400;
    error.details = result.error.flatten();
    throw error;
  }
  return result.data;
}
