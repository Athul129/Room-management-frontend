import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

function ForgotPassword() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/request-otp/', { username });
            if (res.data.Success) {
                Swal.fire('Success', res.data.message, 'success');
                localStorage.setItem('reset_username', username);
                navigate('/verify-otp');
            } else {
                Swal.fire('Error', res.data.message, 'error');
            }
        } catch {
            Swal.fire('Error', 'Something went wrong!', 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-md"
                    >
                        Send OTP
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
