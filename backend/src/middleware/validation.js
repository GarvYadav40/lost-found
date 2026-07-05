import { z } from 'zod';

export const itemSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description cannot be empty'),
  category: z
    .string({ required_error: 'Category is required' })
    .trim()
    .min(1, 'Category cannot be empty'),
  status: z.enum(['Lost', 'Found'], {
    required_error: 'Status must be either "Lost" or "Found"',
  }),
  imageUrl: z
    .string()
    .url('Invalid image URL')
    .optional()
    .nullable()
    .or(z.literal('')),
  location: z
    .string({ required_error: 'Location is required' })
    .trim()
    .min(1, 'Location cannot be empty'),
  date: z
    .string({ required_error: 'Date is required' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  contactInfo: z
    .string({ required_error: 'Contact info is required' })
    .trim()
    .min(1, 'Contact info cannot be empty'),
});

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }
  req.body = result.data;
  next();
};
