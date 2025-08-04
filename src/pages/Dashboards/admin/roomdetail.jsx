import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../../../api/api";

const AdminRoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const res = await API.get(`rooms/${id}/`);
        setRoom(res.data);
      } catch (err) {
        console.error("Failed to fetch room details:", err);
      }
    };

    fetchRoomDetail();
  }, [id]);

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This room will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await API.delete(`rooms/${id}/`);
        Swal.fire("Deleted!", "Room has been deleted.", "success");
        navigate("/admin-dashboard");
      } catch (err) {
        console.error("Failed to delete room:", err);
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  if (!room) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        {room.name}
      </h2>

      {/* Room Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Room Number:</span> {room.room_number}</p>
          <p><span className="font-semibold">Type:</span> {room.room_type}</p>
          <p><span className="font-semibold">Category:</span> {room.category}</p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${room.status === "available"
                ? "bg-green-100 text-green-800"
                : room.status === "booked"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
              {room.status}
            </span>
          </p>
          <p><span className="font-semibold">Price:</span> ₹{room.price}</p>
        </div>

        <div>
          <p className="font-semibold mb-1 text-gray-800">Details:</p>
          <p className="text-gray-600 whitespace-pre-wrap bg-gray-100 p-3 rounded">
            {room.details}
          </p>
        </div>
      </div>

      {/* Facilities */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Facilities</h3>
        {room.facilities?.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {room.facilities.map((f) => (
              <li key={f.id}>{f.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No facilities listed.</p>
        )}
      </div>

      {/* Room Images */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Room Images</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {room.room_images?.length > 0 ? ( //?(optional chaining) to avoid errors if room_images is undefined
            room.room_images.map((img) => (
              <img
                key={img.id} // Assuming img has an id property
                src={img.image}
                alt="room"
                className="rounded shadow-md w-full h-40 object-cover"
              />
            ))
          ) : (
            <p className="text-gray-500">No images uploaded.</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6 justify-end">
        <button
          onClick={() => navigate(`/edit/${room.id}`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminRoomDetail;
