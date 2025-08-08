
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import API from '../../../api/api';
import { useNavigate } from 'react-router-dom';

const StaffBookRoom = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Separate states for form fields
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await API.get('admin/users/');
        const roomsRes = await API.get('/roomstaff/');
        if (usersRes.data.Success) setUsers(usersRes.data.data);
        if (roomsRes.data.Success) setRooms(roomsRes.data.data);
      } catch (error) {
        console.error("Fetch error", error);
      }
    };
    fetchData();
  }, []);

  const calculateTotalPrice = () => {
    if (!roomId || !checkIn || !checkOut) return 0;

    const selectedRoom = rooms.find(r => r.id === parseInt(roomId));
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const days = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    return selectedRoom && days > 0 ? selectedRoom.price * days : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/staff/book-room/', {
        user_id: userId,
        room: roomId,
        check_in: checkIn,
        check_out: checkOut,
      });

      if (res.data.Success) {
        Swal.fire('Success', res.data.message, 'success').then(() => {
          navigate('/staff-bookings');
        });
      } else {
        Swal.fire('Error', res.data.message, 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      Swal.fire('Error', msg, 'error');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Book Room for User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1 font-medium">Select User</label>
          <select value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full border px-3 py-2 rounded">
            <option value="">-- Select User --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Room</label>
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className="w-full border px-3 py-2 rounded">
            <option value="">-- Select Room --</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name} - ₹{r.price}/night</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Check-in Date</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Check-out Date</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {(roomId && checkIn && checkOut) && (
          <div className="text-green-600 font-medium">
            Total Price: ₹{calculateTotalPrice()}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Room for User
        </button>
      </form>
    </div>
  );
};

export default StaffBookRoom;

