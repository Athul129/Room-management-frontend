import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../../api/api";
import ProfileForm from "../../components/editform";


const EditStaffProfile = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        phonenumber: "",
        address: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("profile-staff/");
                if (res.data.Success) {
                    setForm(res.data.data);
                }
            } catch (error) {
                Swal.fire("Error", "Could not load profile", "error");
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put("staff_profile_update/", form);
            if (res.data.Success) {
                Swal.fire("Success", res.data.message, "success");
                navigate("/profile-staff");
            } else {
                Swal.fire("Error", res.data.message, "error");
            }
        } catch (err) {
            Swal.fire("Error", "Update failed", "error");
        }
    };
    const handleCancel = () => {
        navigate("/profile-staff");
    };

    return (
        <ProfileForm
            form={form}
            handleChange={handleChange}
            handleSubmit={handleUpdate}
            handleCancel={handleCancel}
            title="Edit Staff Profile"
        />
    );
};

export default EditStaffProfile;