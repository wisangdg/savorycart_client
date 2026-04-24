import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../hooks";
import "../styles/auth.css";

function Login() {
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // CSS variables are now defined in variables.css

  // Skema validasi dengan Yup
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format email tidak valid")
      .required("Email harus diisi"),
    password: Yup.string()
      .min(6, "Password minimal 6 karakter")
      .required("Password harus diisi"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Gunakan useAuth hook untuk login
      const result = await login(values.email, values.password);

      if (result.success) {
        // Tampilkan pesan sukses
        console.log("Login berhasil!");

        // Redirect ke halaman home atau dashboard
        navigate("/", { replace: true });
      } else {
        // Jika login gagal
        setLoginError(
          result.message || "Gagal login, periksa email dan password"
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError(error.message || "Gagal login, periksa email dan password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="login">
        <h1 className="login-title">Login</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="login-form">
              <div className="form-group">
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    id="login-email"
                    className={`form-control ${
                      errors.email && touched.email ? "error" : ""
                    }`}
                    aria-label="Email address"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="form-error"
                />
              </div>

              <div className="form-group">
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    id="login-password"
                    className={`form-control ${
                      errors.password && touched.password ? "error" : ""
                    }`}
                    aria-label="Password"
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="form-error"
                />
              </div>

              {loginError && (
                <div className="message message-error">{loginError}</div>
              )}

              <button
                type="submit"
                id="login-button"
                className="btn btn-primary"
                disabled={isSubmitting}
                aria-label="Login to your account"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        <p>or</p>
        <button type="submit" id="register-redirect">
          <Link to={"/register"} className="register-link">
            <FaUserPlus className="register-icon" /> Sign Up
          </Link>
        </button>
      </div>
    </MainLayout>
  );
}

export default Login;
