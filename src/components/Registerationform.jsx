import React from "react";
import { useFormik } from "formik";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useState } from 'react';



const RegisterForm = ({ extraFields = [], validationSchema, onSubmit, title = "Register" }) => {
  const [visible, setVisible] = useState({
    password: false,
  });
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      ...extraFields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}), //acc(accumulator) is an object that accumulates the values of extra fields
    },
    validationSchema,
    onSubmit,
    validateOnChange: false, //Doesn’t validate while typing.
    validateOnBlur: true, //Validates when the input field loses focus.
  });

  return (
    <div className="max-w-md mx-auto mt-12 bg-gray-50 rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">{title}</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-5">

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formik.values.username}
            onChange={formik.handleChange} // This function updates the form state when the input changes
            onBlur={formik.handleBlur} // This function marks the field as touched when it loses focus
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.username && formik.errors.username && (
            <div className="text-red-500 text-sm">{formik.errors.username}</div>
          )}

        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>

        {extraFields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label || field.placeholder}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched[field.name] && formik.errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{formik.errors[field.name]}</p>
            )}

          </div>
        ))}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={visible.password ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              onClick={() => setVisible({ ...visible, password: !visible.password })}
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
            >
              {visible.password ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}

          </div>

        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
        >
          {title}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

