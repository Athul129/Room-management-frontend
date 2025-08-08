import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/api";

const StaffRoomDetail = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await API.get(`rooms/${id}/`);
                setRoom(res.data);
            } catch (err) {
                console.error("Failed to fetch room details:", err);
            }
        };

        fetchRoom();
    }, [id]);

    // if (loading) return <p className="p-6">Loading...</p>;
    if (!room) return <p className="p-6 text-red-500">Room not found.</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
            {/* Back Button */}
            <button
                onClick={() => navigate("/staff-dashboard")}
                className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
                ← Back to Room List
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">{room.name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl shadow p-6 mb-6">
                <div className="space-y-2 text-gray-700">
                    <p><span className="font-semibold">Room Number:</span> {room.room_number}</p>
                    <p><span className="font-semibold">Type:</span> {room.room_type}</p>
                    <p><span className="font-semibold">Category:</span> {room.category}</p>
                    <p><span className="font-semibold">Status:</span>
                        <span className={`ml-1 font-medium ${room.status === "available"
                            ? "text-green-600"
                            : room.status === "booked"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}>{room.status}</span>
                    </p>
                    <p><span className="font-semibold">Price:</span> ₹{room.price}</p>
                </div>
                <div className="text-gray-700">
                    <p className="font-semibold mb-1">Details:</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{room.details}</p>
                </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Facilities</h3>
                {room.facilities?.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {room.facilities.map((f) => (
                            <li key={f.id}>{f.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No facilities listed.</p>
                )}
            </div>

            {/* Room Images */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Room Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room.room_images?.length > 0 ? (
                        room.room_images.map((img) => (
                            <img
                                key={img.id}
                                src={img.image}
                                className="w-full h-40 object-cover rounded-lg shadow-sm"
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">No images available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffRoomDetail;

