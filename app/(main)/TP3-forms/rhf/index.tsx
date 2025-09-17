import { zodResolver } from "@hookform/resolvers/zod";
import { useFocusEffect } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";
import { FormContainer } from "../formik/components/FormContainer";
import { ErrorPopup, SuccessPopup } from "../formik/components/SuccessPopup";
import { TextField } from "../formik/components/TextField";
import { schema } from "./validation/schema";

type FormValues = z.infer<typeof schema>;

export default function RhfFormScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      termsAccepted: false,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const emailRef = React.useRef<TextInput | null>(null);
  const passwordRef = React.useRef<TextInput | null>(null);
  const confirmPasswordRef = React.useRef<TextInput | null>(null);
  const displayNameRef = React.useRef<TextInput | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      reset();
      return undefined;
    }, [reset])
  );

  const onSubmit = async (values: FormValues) => {
    try {
      await new Promise((r) => setTimeout(r, 400));
      await SuccessPopup();
      reset();
    } catch (e) {
      await ErrorPopup();
    }
  };

  return (
    <FormContainer>
      <Text style={styles.title}>RHF + Zod</Text>
      <Link href="/TP3-forms/formik" style={styles.link}>
        Aller à Formik + Yup
      </Link>

      <View style={{ gap: 12 }}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              ref={emailRef}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              errorText={errors.email?.message ?? null}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              ref={passwordRef}
              placeholder="Mot de passe"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              errorText={errors.password?.message ?? null}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              ref={confirmPasswordRef}
              placeholder="Confirmer le mot de passe"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => displayNameRef.current?.focus()}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              errorText={errors.confirmPassword?.message ?? null}
            />
          )}
        />

        <Controller
          control={control}
          name="displayName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              ref={displayNameRef}
              placeholder="Nom affiché"
              returnKeyType="done"
              onSubmitEditing={() => handleSubmit(onSubmit)()}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              errorText={errors.displayName?.message ?? null}
            />
          )}
        />

        <Controller
          control={control}
          name="termsAccepted"
          render={({ field: { value, onChange } }) => (
            <View style={styles.checkboxRow}>
              <Text style={{ marginRight: 8 }}>Accepter les CGU</Text>
              <Text onPress={() => onChange(!value)} style={styles.checkbox}>
                {value ? "☑" : "☐"}
              </Text>
            </View>
          )}
        />
        {errors.termsAccepted ? (
          <Text style={styles.error}>
            {errors.termsAccepted.message as string}
          </Text>
        ) : null}

        <Text
          onPress={() =>
            isValid && !isSubmitting ? handleSubmit(onSubmit)() : undefined
          }
          style={[
            styles.submit,
            !isValid || isSubmitting ? styles.submitDisabled : undefined,
          ]}
        >
          {isSubmitting ? "Envoi..." : "Créer mon compte"}
        </Text>
      </View>
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
