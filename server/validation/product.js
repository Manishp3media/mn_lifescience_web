import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required").optional(),
    composition: z.string().min(1, "Composition is required").optional(),
    category: z.string().min(1, "Category is required").optional(),
    sku: z.string().min(1, "SKU is required").optional(),
});