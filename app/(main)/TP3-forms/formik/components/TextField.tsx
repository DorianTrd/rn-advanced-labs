import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

export type TextFieldProps = TextInputProps & {
  errorText?: string | null;
};

export const TextField = React.forwardRef<TextInput, TextFieldProps>(
  ({ errorText, style, ...props }, ref) => {
    return (
      <View>
        <TextInput
          ref={ref}
          style={[styles.input, errorText ? styles.inputError : undefined, style]}
          {...props}
        />
        {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      </View>
    );
  }
);

TextField.displayName = "TextField";

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  error: {
    color: "#ff3b30",
    marginTop: 4,
  },
});


