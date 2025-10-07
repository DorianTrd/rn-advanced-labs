import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { RobotInput, RobotUpdate, robotTypes, validateRobotInput, validateRobotUpdate } from '../validation/robotSchema';

interface RobotFormProps {
  initialValues?: Partial<RobotInput>;
  onSubmit: (values: RobotInput | RobotUpdate) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
  mode?: 'create' | 'edit';
}

export const RobotForm: React.FC<RobotFormProps> = ({
  initialValues = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Enregistrer',
  mode = 'create',
}) => {
  const defaultValues: RobotInput = {
    name: '',
    label: '',
    year: new Date().getFullYear(),
    type: 'other',
    ...initialValues,
  };

  const handleSubmit = async (values: RobotInput) => {
    try {
      if (mode === 'create') {
        const validatedValues = await validateRobotInput(values);
        await onSubmit(validatedValues);
      } else {
        // En mode édition, on ne soumet que les champs modifiés
        const changes: RobotUpdate = {};
        if (values.name !== initialValues.name) changes.name = values.name;
        if (values.label !== initialValues.label) changes.label = values.label;
        if (values.year !== initialValues.year) changes.year = values.year;
        if (values.type !== initialValues.type) changes.type = values.type;
        
        if (Object.keys(changes).length > 0) {
          const validatedChanges = await validateRobotUpdate(changes);
          await onSubmit(validatedChanges);
        }
      }
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        // Les erreurs de validation sont gérées par Formik
        console.log('Erreurs de validation:', error.errors);
      } else {
        Alert.alert('Erreur', error.message || 'Une erreur est survenue');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={defaultValues}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors: any = {};

            // Validation du nom
            if (!values.name.trim()) {
              errors.name = 'Le nom est requis';
            } else if (values.name.trim().length < 2) {
              errors.name = 'Le nom doit contenir au moins 2 caractères';
            } else if (values.name.trim().length > 50) {
              errors.name = 'Le nom ne peut pas dépasser 50 caractères';
            }

            // Validation du label
            if (!values.label.trim()) {
              errors.label = 'Le label est requis';
            } else if (values.label.trim().length < 3) {
              errors.label = 'Le label doit contenir au moins 3 caractères';
            } else if (values.label.trim().length > 100) {
              errors.label = 'Le label ne peut pas dépasser 100 caractères';
            }

            // Validation de l'année
            if (!values.year) {
              errors.year = 'L\'année est requise';
            } else if (!Number.isInteger(values.year)) {
              errors.year = 'L\'année doit être un nombre entier';
            } else if (values.year < 1950) {
              errors.year = 'L\'année doit être supérieure ou égale à 1950';
            } else if (values.year > new Date().getFullYear()) {
              errors.year = `L\'année ne peut pas dépasser ${new Date().getFullYear()}`;
            }

            // Validation du type
            if (!values.type) {
              errors.type = 'Le type est requis';
            } else if (!['industrial', 'service', 'medical', 'educational', 'other'].includes(values.type)) {
              errors.type = 'Type de robot invalide';
            }

            return errors;
          }}
        >
          {({ values, errors, touched, setFieldValue, handleSubmit, isSubmitting }) => (
            <View style={styles.form}>
              {/* Champ Nom */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Nom *</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.name && errors.name && styles.inputError
                  ]}
                  value={values.name}
                  onChangeText={(text) => setFieldValue('name', text)}
                  placeholder="Nom du robot"
                  maxLength={50}
                  editable={!isLoading}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* Champ Label */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Label *</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.label && errors.label && styles.inputError
                  ]}
                  value={values.label}
                  onChangeText={(text) => setFieldValue('label', text)}
                  placeholder="Description du robot"
                  maxLength={100}
                  multiline
                  numberOfLines={2}
                  editable={!isLoading}
                />
                {touched.label && errors.label && (
                  <Text style={styles.errorText}>{errors.label}</Text>
                )}
              </View>

              {/* Champ Année */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Année *</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.year && errors.year && styles.inputError
                  ]}
                  value={values.year.toString()}
                  onChangeText={(text) => {
                    const year = parseInt(text) || 0;
                    setFieldValue('year', year);
                  }}
                  placeholder="Année de création"
                  keyboardType="numeric"
                  maxLength={4}
                  editable={!isLoading}
                />
                {touched.year && errors.year && (
                  <Text style={styles.errorText}>{errors.year}</Text>
                )}
              </View>

              {/* Champ Type */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Type *</Text>
                <View style={[
                  styles.pickerContainer,
                  touched.type && errors.type && styles.pickerError
                ]}>
                  <Picker
                    selectedValue={values.type}
                    onValueChange={(value) => setFieldValue('type', value)}
                    enabled={!isLoading}
                    style={styles.picker}
                  >
                    {robotTypes.map((type) => (
                      <Picker.Item
                        key={type.value}
                        label={type.label}
                        value={type.value}
                      />
                    ))}
                  </Picker>
                </View>
                {touched.type && errors.type && (
                  <Text style={styles.errorText}>{errors.type}</Text>
                )}
              </View>

              {/* Bouton de soumission */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (isLoading || isSubmitting) && styles.submitButtonDisabled
                ]}
                onPress={() => handleSubmit()}
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>{submitButtonText}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  pickerError: {
    borderColor: '#ff4444',
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
