import { z } from "zod";

export const schema = z
  .object({
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string().min(1, "Confirmation requise"),
    displayName: z.string().min(2, "Trop court"),
    termsAccepted: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter les CGU" }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });


