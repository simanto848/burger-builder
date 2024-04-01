import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { singInStart, signInSuccess } from "../redux/user/userSlice";
import { login } from "../services/authService"; // Import the login function
import "./Auth.css";

export default function Login() {
  const initialValues = {
    email: "",
    password: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (values) => {
    try {
      dispatch(singInStart());
      const data = await login(values);
      dispatch(signInSuccess(data));
      navigate("/home");
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
              to="/register"
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              Switch to Sign Up
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
          <button type="submit" className="sucessBtn">
            Login
          </button>
        </Form>
      </Formik>
    </div>
  );
}
