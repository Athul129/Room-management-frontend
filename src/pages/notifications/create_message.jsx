import React, { useState } from 'react';
import Swal from 'sweetalert2';
import API from '../../api/api';

const AdminSendMessage = () => {
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message || !target) {
            Swal.fire('Error', 'Please select a target and enter a message.', 'error');
            return;
        }

        try {
            const response = await API.post('/admin/message/', {
                message,
                target,
            });

            if (response.data.Success) {
                Swal.fire('Success', response.data.message, 'success');
                setMessage('');
                setTarget('');
            } else {
                Swal.fire('Error', response.data.message, 'error');
            }
        } catch (error) {
            console.error('Message send error:', error);
            Swal.fire('Error', 'Something went wrong.', 'error');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
            <h2 className="text-2xl font-bold mb-4">Send Message</h2>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2 font-medium">Target Audience</label>
                <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full border px-4 py-2 mb-4 rounded"
                >
                    <option value="">-- Select Target --</option>
                    <option value="staff">Staff</option>
                    <option value="users">Users</option>
                </select>

                <label className="block mb-2 font-medium">Message</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border px-4 py-2 mb-4 rounded"
                    rows={4}
                    placeholder="Type your message here..."
                ></textarea>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default AdminSendMessage;
