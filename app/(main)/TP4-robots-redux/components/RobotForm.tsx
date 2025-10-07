import { Picker } from '@react-native-picker/picker';
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
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav}>
      <View style={styles.centered}>
        <View style={styles.card}>
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
                  <View style={[styles.input, errors.type && touched.type ? styles.inputError : styles.inputDefault, { padding: 0 } ]}>
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
                  style={styles.submitBtn}
                  accessibilityRole="button"
                  activeOpacity={0.85}
                >
                  <View style={isValid ? styles.gradientBtn : styles.disabledBtn}>
                    <Text style={styles.submitBtnText}>
                      {mode === 'create' ? 'Créer' : 'Modifier'}
                    </Text>
                  </View>
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
    backgroundColor: '#eaf0fa',
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
    borderRadius: 24,
    padding: 28,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#e0e7ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 22,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  formGap: {
    gap: 18,
  },
  label: {
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 6,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#f6f8fa',
    fontSize: 16,
  },
  inputDefault: {
    borderColor: '#dbeafe',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  error: {
    color: '#ff3b30',
    marginTop: 2,
    fontSize: 14,
  },
  submitBtn: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  gradientBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  disabledBtn: {
    backgroundColor: '#8e8e93',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    opacity: 0.7,
  },
  submitBtnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 0.5,
    textShadowColor: '#2563eb',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
