import React, { useState } from "react";
import Swal from "sweetalert2";
import API from "../../api/api";

const SubmitComplaint = () => {
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            Swal.fire("Error", "Please enter a complaint message.", "error");
            return;
        }

        try {
            const response = await API.post("/complaints/submit/", { message });

            if (response.data.Success) {
                Swal.fire("Success", "Complaint submitted successfully!", "success");
                setMessage("");
            } else {
                Swal.fire("Error", response.data.message, "error");
            }
        } catch (error) {
            console.error("Submission error:", error);
            Swal.fire("Error", "Failed to submit complaint.", "error");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 mt-8 bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">Report an Issue</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue here..."
                    rows="5"
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default SubmitComplaint;
