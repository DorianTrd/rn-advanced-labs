import { useFocusEffect } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { FormContainer } from "./components/FormContainer";
import { ErrorPopup, SuccessPopup } from "./components/SuccessPopup";
import { TextField } from "./components/TextField";
import { validationSchema } from "./validation/schema";

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  termsAccepted: boolean;
};

export default function FormikFormScreen() {
  const router = useRouter();
  const [formKey, setFormKey] = React.useState(0);

  const initialValues: FormValues = {
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    termsAccepted: false,
  };

  const emailRef = React.useRef<TextInput | null>(null);
  const passwordRef = React.useRef<TextInput | null>(null);
  const confirmPasswordRef = React.useRef<TextInput | null>(null);
  const displayNameRef = React.useRef<TextInput | null>(null);

  // Reset le formulaire à chaque focus
  useFocusEffect(
    React.useCallback(() => {
      setFormKey((k) => k + 1);
      return undefined;
    }, [])
  );

  return (
    <FormContainer>
      <Text style={styles.title}>Formik + Yup</Text>
      <Link href="/TP3-forms/rhf" style={styles.link}>
        Aller à RHF + Zod
      </Link>

      <Formik
        key={formKey}
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange
        onSubmit={async (values, helpers) => {
          try {
            await new Promise((r) => setTimeout(r, 400));
            await SuccessPopup();
            helpers.resetForm();
          } catch (e) {
            await ErrorPopup();
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          isSubmitting,
          setFieldValue,
        }) => (
          <View style={{ gap: 12 }}>
            <TextField
              ref={emailRef}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              errorText={touched.email && errors.email ? errors.email : null}
            />

            <TextField
              ref={passwordRef}
              placeholder="Mot de passe"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              errorText={touched.password && errors.password ? errors.password : null}
            />

            <TextField
              ref={confirmPasswordRef}
              placeholder="Confirmer le mot de passe"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => displayNameRef.current?.focus()}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              errorText={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : null}
            />

            <TextField
              ref={displayNameRef}
              placeholder="Nom affiché"
              returnKeyType="done"
              onSubmitEditing={() => handleSubmit()}
              onChangeText={handleChange("displayName")}
              onBlur={handleBlur("displayName")}
              value={values.displayName}
              errorText={touched.displayName && errors.displayName ? errors.displayName : null}
            />

            <View style={styles.checkboxRow}>
              <Text style={{ marginRight: 8 }}>Accepter les CGU</Text>
              <Text
                onPress={() => setFieldValue("termsAccepted", !values.termsAccepted)}
                style={styles.checkbox}
              >
                {values.termsAccepted ? "☑" : "☐"}
              </Text>
            </View>
            {touched.termsAccepted && errors.termsAccepted ? (
              <Text style={styles.error}>{errors.termsAccepted as string}</Text>
            ) : null}

            <Text
              onPress={() =>
                isValid && !isSubmitting ? handleSubmit() : undefined
              }
              style={[
                styles.submit,
                !isValid || isSubmitting ? styles.submitDisabled : undefined,
              ]}
            >
              {isSubmitting ? "Envoi..." : "Créer mon compte"}
            </Text>
          </View>
        )}
      </Formik>
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    fontSize: 18,
  },
  error: {
    color: "#ff3b30",
  },
  submit: {
    marginTop: 8,
    backgroundColor: "#007AFF",
    color: "white",
    textAlign: "center",
    padding: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  submitDisabled: {
    backgroundColor: "#8e8e93",
  },
});
