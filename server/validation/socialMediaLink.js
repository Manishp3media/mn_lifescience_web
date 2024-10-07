import { z } from 'zod';

export const socialMediaLinkSchema = z.object({
    platform: z.enum(['Whatsapp','Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube']),
    url: z.string().min(1, "URL is required"),
});
