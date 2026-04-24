import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../hooks";
import Loading from "./Loading.jsx";
import "../styles/auth.css";

function Register() {
  const [registerError, setRegisterError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  // Skema validasi dengan Yup
  const RegisterSchema = Yup.object().shape({
    full_name: Yup.string()
      .min(3, "Nama minimal 3 karakter")
      .max(50, "Nama maksimal 50 karakter")
      .matches(/^[a-zA-Z\s]+$/, "Nama hanya boleh berisi huruf dan spasi")
      .trim()
      .required("Nama harus diisi"),
    email: Yup.string()
      .email("Format email tidak valid")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Format email tidak valid"
      )
      .required("Email harus diisi"),
    password: Yup.string()
      .min(6, "Password minimal 6 karakter")
      .max(100, "Password terlalu panjang")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password harus mengandung huruf besar, huruf kecil, dan angka"
      )
      .required("Password harus diisi"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password harus sama")
      .required("Konfirmasi password harus diisi"),
  });

  useEffect(() => {
    if (location.pathname === "/register") {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }
  }, [location.pathname]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const userData = {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
      };

      // Gunakan useAuth hook untuk register
      const result = await register(userData);

      if (result.success) {
        console.log("Registration successful:", result.data);
        resetForm();

        // Menggunakan notifikasi yang lebih baik daripada alert
        const successMessage = document.createElement("div");
        successMessage.className = "message message-success";
        successMessage.textContent = "Registrasi berhasil! Silahkan login.";
        document.body.appendChild(successMessage);

        // Hapus pesan setelah 3 detik
        setTimeout(() => {
          document.body.removeChild(successMessage);
          navigate("/login", { replace: true });
        }, 3000);
      } else {
        setRegisterError(result.message || "Gagal melakukan registrasi");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setRegisterError(error.message || "Gagal melakukan registrasi");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      {loading ? (
        <Loading />
      ) : (
        <div className="register">
          <h1 className="register-title">Register</h1>
          <Formik
            initialValues={{
              full_name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="register-form">
                <div className="form-group">
                  <Field
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    id="register-fullname"
                    className={`form-control ${
                      errors.full_name && touched.full_name ? "error" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="full_name"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    id="register-email"
                    className={`form-control ${
                      errors.email && touched.email ? "error" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    id="register-password"
                    className={`form-control ${
                      errors.password && touched.password ? "error" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Konfirmasi Password"
                    id="register-confirm-password"
                    className={`form-control ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "error"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="password-requirements">
                  <p>Password harus memenuhi kriteria berikut:</p>
                  <ul>
                    <li>Minimal 6 karakter</li>
                    <li>Mengandung minimal 1 huruf besar</li>
                    <li>Mengandung minimal 1 huruf kecil</li>
                    <li>Mengandung minimal 1 angka</li>
                  </ul>
                </div>

                {registerError && (
                  <div className="message message-error">{registerError}</div>
                )}

                <button
                  type="submit"
                  id="register-button"
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Sign Up"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </MainLayout>
  );
}

export default Register;
