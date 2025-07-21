
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/Registerationform";
import { Link } from "react-router-dom";



const UserRegister = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phonenumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await API.post("register/", values);
      if (res.data.Success) {
        Swal.fire("Success", res.data.message, "success");
        navigate("/login");
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Registration failed", "error");
    }
  };

  return (
    <>
      <RegisterForm
        title="User Registration"
        extraFields={[
          { name: "phonenumber", placeholder: "Phone Number" },
          { name: "address", placeholder: "Address" },
        ]}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      />

      <p className="text-sm text-center mt-4 text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </>
  );

};

export default UserRegister;
