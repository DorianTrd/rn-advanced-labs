import * as Yup from "yup";

export const validationSchema = Yup.object({
  email: Yup.string().email("Email invalide").required("Email requis"),
  password: Yup.string()
    .min(8, "8 caractères minimum")
    .required("Mot de passe requis"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("Confirmation requise"),
  displayName: Yup.string().min(2, "Trop court").required("Nom requis"),
  termsAccepted: Yup.boolean().oneOf([true], "Vous devez accepter les CGU"),
});


