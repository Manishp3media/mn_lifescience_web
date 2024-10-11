import { z } from 'zod';

export const socialMediaLinkSchema = z.object({
    platform: z.enum(['Whatsapp','Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube']),
    url: z.string().min(1, "URL is required"),
    adminEmail: z.string().email("Invalid email format").optional(), 
    adminMobileNumber: z.string().min(1, "Admin mobile number is required").optional(),
    whatsappNumber: z.string().optional(),
});
