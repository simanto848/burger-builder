import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { register } from "../services/authService";
import "./Auth.css";

export default function Register() {
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values) => {
    console.log("Form submitted", values);
    try {
      const data = await register(values);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="formContainer">
      <Toaster position="top-center" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="form">
          <button
            style={{
              width: "100%",
              backgroundColor: "#d6770f",
              color: "white",
              cursor: "pointer",
              padding: "0.7rem",
              border: "none",
              borderRadius: "5px",
            }}
          >
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              Switch to Login
            </Link>
          </button>
          <div className="formControl">
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
            />
            <ErrorMessage name="email" component={"div"} className="error" />
          </div>
          <div className="formControl">
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="Password"
            />
            <ErrorMessage name="password" component={"div"} className="error" />
          </div>
          <div className="formControl">
            <Field
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
            />
            <ErrorMessage
              name="confirmPassword"
              component={"div"}
              className="error"
            />
          </div>
          <button type="submit" className="sucessBtn">
            Sign Up
          </button>
        </Form>
      </Formik>
    </div>
  );
}
