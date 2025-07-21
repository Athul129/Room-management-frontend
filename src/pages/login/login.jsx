import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import API from '../../api/api';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';



const Login = () => {
  const navigate = useNavigate();

  const [visible, setVisible] = useState({
    password: false,
  });


  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = "Username is required";
      }
      if (!values.password) {
        errors.password = "Password is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const res = await API.post("login/", values);
        const role = res.data.role;

        if (role === 1) {
          Swal.fire("Welcome admin");
          navigate("/admin-dashboard");
        } else if (role === 2) {
          Swal.fire("Welcome staff");
          navigate("/staff-dashboard");
        } else if (role === 3) {
          Swal.fire("Welcome to the Luxora Hotel");
          navigate("/user-home");
        } else {
          Swal.fire("Invalid role");
        }
      } catch (error) {
        console.error("Login failed:", error);
        Swal.fire("Error", "Login failed. Please try again.", "error");
      }
    }
  });

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/login-page.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="min-h-screen flex items-center justify-center px-4 backdrop-brightness-75">
        <div className="bg-white/15 backdrop-blur-md shadow-lg rounded-xl p-8 w-full max-w-md border border-none">
          <h2 className="text-2xl font-semibold text-center text-black-600 mb-6">
            Sign In to Your Account
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                className="w-full bg-transparent text-white placeholder-white font-semibold border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-white text-m mt-1">{formik.errors.username}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={visible.password ? 'text' : 'password'}
                placeholder="Enter your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full bg-transparent text-white font-semibold placeholder-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                onClick={() => setVisible({ ...visible, password: !visible.password })}
                className="absolute right-3 top-2.5 text-white cursor-pointer"
              >
                {visible.password ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </div>

              {formik.touched.password && formik.errors.password && (
                <p className="text-white text-m mt-1">{formik.errors.password}</p>
              )}
            </div>
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-m text-white font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Login
            </button>

            <p className="text-center text-sm text-black">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-black hover:underline font-medium">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

