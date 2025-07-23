
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API from '../../api/api';

function VerifyOtp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const username = localStorage.getItem('reset_username');

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/verify-otp/', { username, otp });
            if (res.data.Success) {
                Swal.fire('Success', 'OTP Verified', 'success');
                navigate('/reset-password');
            } else {
                Swal.fire('Error', res.data.message, 'error');
            }
        } catch {
            Swal.fire('Error', 'Something went wrong!', 'error');
        }
    };

    const handleResend = async () => {
        try {
            const res = await API.post('/request-otp/', { username });
            if (res.data.Success) {
                Swal.fire('Success', 'OTP resent to your email.', 'success');
            } else {
                Swal.fire('Error', res.data.message, 'error');
            }
        } catch {
            Swal.fire('Error', 'Failed to resend OTP.', 'error');
        }
    };

    if (!username) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-center text-gray-700 text-lg">
                    Username missing. Please go back to{' '}
                    <span
                        onClick={() => navigate('/forgot-password')}
                        className="text-blue-600 underline cursor-pointer"
                    >
                        Forgot Password
                    </span>
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify OTP</h2>
                <form onSubmit={handleVerify} className="space-y-5">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Enter OTP</label>
                        <input
                            type="text"
                            placeholder="Enter OTP sent to your email"
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 rounded-md"
                    >
                        Verify OTP
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        onClick={handleResend}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Resend OTP
                    </button>
                </div>

                <div className="text-center mt-2">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyOtp;

