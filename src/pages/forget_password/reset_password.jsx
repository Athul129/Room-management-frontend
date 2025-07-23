import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const username = localStorage.getItem('reset_username');

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            Swal.fire('Error', 'Passwords do not match!', 'error');
            return;
        }

        try {
            const res = await API.post('/reset-password/', {
                username,
                new_password: password,
            });

            if (res.data.Success) {
                Swal.fire('Success', 'Password reset successfully!', 'success');
                localStorage.removeItem('reset_username');
                navigate('/login');
            } else {
                Swal.fire('Error', res.data.message, 'error');
            }
        } catch {
            Swal.fire('Error', 'Something went wrong!', 'error');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <form onSubmit={handleReset}>
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border p-2 mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border p-2 mb-4"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;

