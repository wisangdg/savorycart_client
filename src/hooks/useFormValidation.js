import { useState } from 'react';
import * as Yup from 'yup';

/**
 * Custom hook untuk menangani validasi form
 * @param {Object} initialValues - Nilai awal form
 * @param {Object} validationSchema - Skema validasi Yup
 * @param {Function} onSubmit - Fungsi yang dipanggil saat form disubmit
 * @returns {Object} Object berisi state dan handler untuk form
 */
const useFormValidation = (initialValues, validationSchema, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Menangani perubahan nilai input
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  /**
   * Memvalidasi satu field
   * @param {string} name - Nama field
   * @param {any} value - Nilai field
   */
  const validateField = async (name, value) => {
    try {
      // Buat schema untuk field yang akan divalidasi
      const fieldSchema = Yup.reach(validationSchema, name);
      await fieldSchema.validate(value);
      
      // Jika valid, hapus error untuk field ini
      setErrors({
        ...errors,
        [name]: undefined,
      });
    } catch (error) {
      // Jika tidak valid, set error message
      setErrors({
        ...errors,
        [name]: error.message,
      });
    }
  };

  /**
   * Menangani blur pada input (validasi saat user selesai input)
   * @param {Object} e - Event object
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  /**
   * Memvalidasi semua field dan submit form jika valid
   * @param {Object} e - Event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validasi semua field
      const validatedValues = await validationSchema.validate(values, {
        abortEarly: false,
      });
      
      // Jika valid, panggil onSubmit
      await onSubmit(validatedValues);
      
      // Reset errors
      setErrors({});
    } catch (error) {
      // Jika ada error validasi, format dan set errors
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset form ke nilai awal
   */
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};

export default useFormValidation;
