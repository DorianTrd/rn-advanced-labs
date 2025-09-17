import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { robotSchema, robotTypes } from '../validation/robotSchema';

export type RobotFormProps = {
  initialValues: {
    name: string;
    label: string;
    year: number | string;
    type: string;
  };
  onSubmit: (values: any) => void;
  mode: 'create' | 'edit';
  isNameUnique?: (name: string) => boolean;
};

export const RobotForm: React.FC<RobotFormProps> = ({ initialValues, onSubmit, mode, isNameUnique }) => {
  const router = useRouter();
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav}>
      <View style={styles.centered}>
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => router.replace('/(main)/TP4-robots')}
            style={styles.backBtn}
            accessibilityRole="button"
          >
            <Text style={styles.backBtnText}>← Retour à la liste</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {mode === 'create' ? 'Ajouter un robot' : 'Modifier le robot'}
          </Text>
          <Formik
            initialValues={initialValues}
            validationSchema={robotSchema}
            validate={values => {
              const errors: any = {};
              if (isNameUnique && !isNameUnique(values.name)) {
                errors.name = 'Nom déjà utilisé';
              }
              return errors;
            }}
            onSubmit={values => {
              onSubmit(values);
            }}
            validateOnMount
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, setFieldValue }) => (
              <View style={styles.formGap}>
                <View>
                  <Text style={styles.label}>Nom</Text>
                  <TextInput
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    placeholder="Nom du robot"
                    returnKeyType="next"
                    autoCapitalize="none"
                    style={[styles.input, errors.name && touched.name ? styles.inputError : styles.inputDefault]}
                  />
                  {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
                </View>
                <View>
                  <Text style={styles.label}>Label</Text>
                  <TextInput
                    onChangeText={handleChange('label')}
                    onBlur={handleBlur('label')}
                    value={values.label}
                    placeholder="Label"
                    returnKeyType="next"
                    style={[styles.input, errors.label && touched.label ? styles.inputError : styles.inputDefault]}
                  />
                  {touched.label && errors.label && <Text style={styles.error}>{errors.label}</Text>}
                </View>
                <View>
                  <Text style={styles.label}>Année</Text>
                  <TextInput
                    onChangeText={handleChange('year')}
                    onBlur={handleBlur('year')}
                    value={String(values.year)}
                    placeholder="Année"
                    keyboardType="numeric"
                    returnKeyType="next"
                    style={[styles.input, errors.year && touched.year ? styles.inputError : styles.inputDefault]}
                  />
                  {touched.year && errors.year && <Text style={styles.error}>{errors.year}</Text>}
                </View>
                <View>
                  <Text style={styles.label}>Type</Text>
                  <View style={[styles.input, errors.type && touched.type ? styles.inputError : styles.inputDefault, { padding: 0 }] }>
                    <Picker
                      selectedValue={values.type}
                      onValueChange={value => setFieldValue('type', value)}
                    >
                      <Picker.Item label="Sélectionner un type..." value="" />
                      {robotTypes.map(type => (
                        <Picker.Item key={type} label={type} value={type} />
                      ))}
                    </Picker>
                  </View>
                  {touched.type && errors.type && <Text style={styles.error}>{errors.type}</Text>}
                </View>
                <TouchableOpacity
                  onPress={isValid ? (handleSubmit as any) : undefined}
                  disabled={!isValid}
                  style={[styles.submitBtn, !isValid ? styles.submitBtnDisabled : null]}
                  accessibilityRole="button"
                >
                  <Text style={styles.submitBtnText}>
                    {mode === 'create' ? 'Créer' : 'Modifier'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  kav: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  backBtn: {
    marginBottom: 12,
    alignSelf: 'flex-start',
    padding: 6,
  },
  backBtnText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
  },
  formGap: {
    gap: 16,
  },
  label: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f6f8fa',
  },
  inputDefault: {
    borderColor: '#d1d5db',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  error: {
    color: '#ff3b30',
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    opacity: 1,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  submitBtnDisabled: {
    backgroundColor: '#8e8e93',
    opacity: 0.7,
    shadowOpacity: 0,
  },
  submitBtnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
