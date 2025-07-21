import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api/api";
import RegisterForm from "../components/Registerationform";

const AdminRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    //  Check if admin already exists
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await API.get("check-admin/");
                if (res.data.data?.admin_exists) {
                    navigate("/login"); 
                } else {
                    setLoading(false); 
                }
            } catch (err) {
                Swal.fire("Error", "Failed to check admin status", "error");
            }
        };

        checkAdmin();
    }, [navigate]);


    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const handleSubmit = async (values) => {
        try {
            const res = await API.post("create-admin/", values);
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

    if (loading) return <div>Loading...</div>;

    return (
        <RegisterForm
            title="Admin Registration"
            extraFields={[]} 
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        />
    );
};

export default AdminRegister;
