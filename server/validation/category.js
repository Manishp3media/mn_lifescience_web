import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
});