import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import API from '../../api/api';

function ChangePassword() {
    const [form, setForm] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [visible, setVisible] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.new_password !== form.confirm_password) {
            Swal.fire('Error', 'New passwords do not match!', 'error');
            return;
        }

        try {
            const res = await API.post('/change-password/', form);
            if (res.data.Success) {
                Swal.fire('Success', res.data.message, 'success');
                setForm({ old_password: '', new_password: '', confirm_password: '' });
            } else {
                Swal.fire('Error', res.data.message, 'error');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Swal.fire('Error', 'An error occurred while changing the password.', 'error');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Old Password */}
                <div className="relative">
                    <input
                        type= {visible.old ? 'text' : 'password'}// if visible, show text else show password
                        name="old_password"
                        placeholder="Old Password"
                        value={form.old_password}
                        onChange={handleChange}
                        className="w-full border p-2 pr-10 rounded"
                        required
                    />
                    <div
                        onClick={() => setVisible({ ...visible, old: !visible.old })} //not visible!
                        className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                    >
                        {visible.old ? <EyeInvisibleOutlined /> : <EyeOutlined />} 
                    </div>
                </div>

                {/* New Password */}
                <div className="relative">
                    <input
                        type={visible.new ? 'text' : 'password'}
                        name="new_password"
                        placeholder="New Password"
                        value={form.new_password}
                        onChange={handleChange}
                        className="w-full border p-2 pr-10 rounded"
                        required
                    />
                    <div
                        onClick={() => setVisible({ ...visible, new: !visible.new })}
                        className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                    >
                        {visible.new ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <input
                        type={visible.confirm ? 'text' : 'password'}
                        name="confirm_password"
                        placeholder="Confirm New Password"
                        value={form.confirm_password}
                        onChange={handleChange}
                        className="w-full border p-2 pr-10 rounded"
                        required
                    />
                    <div
                        onClick={() => setVisible({ ...visible, confirm: !visible.confirm })}
                        className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                    >
                        {visible.confirm ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;
