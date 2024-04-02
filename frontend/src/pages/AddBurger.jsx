import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { addBurger } from "../services/productService";
import "./Auth.css";

export default function AddBurger() {
  const initialValues = {
    name: "",
    price: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Please provide burger name!"),
    price: Yup.string().required("Please provide burger price!"),
  });

  const handleSubmit = async (values) => {
    const result = await addBurger(values);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
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
            <h3>Add Burger</h3>
          </button>
          <div className="formControl">
            <Field
              type="text"
              id="name"
              name="name"
              placeholder="Enter Burger Name"
            />
            <ErrorMessage name="name" component="div" className="error" />{" "}
          </div>
          <div className="formControl">
            <Field
              type="text"
              id="price"
              name="price"
              placeholder="Enter Burger Price"
            />
            <ErrorMessage name="price" component="div" className="error" />{" "}
          </div>
          <button type="submit" className="sucessBtn">
            Add Burger
          </button>
        </Form>
      </Formik>
    </div>
  );
}
