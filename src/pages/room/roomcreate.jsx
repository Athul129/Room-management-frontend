import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../../api/api";
// import FacilityDropdown from "../../components/facility";

function RoomCreate() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [form, setForm] = useState({
    name: "",
    details: "",
    room_type: "",
    room_number: "",
    price: "",
    category: "",
    status: "",
    facilities: [],
    cover_image: null,
    room_images: [],
  });

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await API.get("facilities/");
        if (res.data.Success) {
          setFacilities(res.data.data);
        } else {
          console.error("Facility fetch error:", res.data.message);
        }
      } catch (err) {
        console.error("Failed to fetch facilities:", err);
      }
    };
    fetchFacilities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;  // This is called destructuring. It means: const name = e.target.name;
    setForm({ ...form, [name]: value }); // This dynamically sets the property using the name string.eg:setForm({ ...form, price: "1200" });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target; // Destructure to get name and files from the event target
    if (name === "cover_image") {
      setForm({ ...form, cover_image: files[0] });
    } else if (name === "room_images") {
      setForm({ ...form, room_images: files }); // This accepts multiple files, form.room_images becomes an array-like object holding all selected images.
    }
  };
  const handleFacilityChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value); // converts that into a real array (because selectedOptions is not a normal array). map // iterates over each selected option and returns an array of their values.
    setForm({ ...form, facilities: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("details", form.details);
    formData.append("room_type", form.room_type);
    formData.append("room_number", form.room_number);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("status", form.status);
    formData.append("cover_image", form.cover_image);

    for (let i = 0; i < form.room_images.length; i++) {
      formData.append("room_images", form.room_images[i]);  // This loops through the room_images array and appends each image to the FormData object.
    }

    form.facilities.forEach((id) => {
      formData.append("facilities", id); // This appends each selected facility ID to the FormData object.  and FormData does not support arrays directly.
    });

    try {
      const res = await API.post("rooms/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.Success) {
        Swal.fire("Room created successfully!");
        navigate("/admin-dashboard");
      } else {
        alert("Failed: " + res.data.message);
      }
    } catch (err) {
      console.error("Error creating room:", err);
      alert("Something went wrong while creating the room.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* <BackToHomeButton /> */}
      <h2 className="text-2xl font-bold mb-4">Create Room</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Room Name" required className="w-full border p-2 rounded" />

        <textarea name="details" value={form.details} onChange={handleChange} placeholder="Room Details" required className="w-full border p-2 rounded" />

        <select name="room_type" value={form.room_type} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Select Room Type</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
        </select>

        <input type="text" name="room_number" value={form.room_number} onChange={handleChange} placeholder="Room Number" required className="w-full border p-2 rounded" />

        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" required className="w-full border p-2 rounded" />

        <select name="category" value={form.category} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Select Category</option>
          <option value="ac">AC</option>
          <option value="non_ac">Non-AC</option>
        </select>

        <select name="status" value={form.status} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Select Status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <label className="block font-semibold">Cover Image</label>
        <input type="file" name="cover_image" accept="image/*" onChange={handleFileChange} required className="w-full border p-2 rounded" />

        <label className="block font-semibold">Room Images</label>
        <input type="file" name="room_images" accept="image/*" onChange={handleFileChange} multiple className="w-full border p-2 rounded" />
        <label className="block font-semibold">Facilities</label>
        <select
          multiple
          value={form.facilities}
          onChange={handleFacilityChange}
          className="w-full border p-2 rounded h-32"
        >
          {facilities.map((facility) => (
            <option key={facility.id} value={facility.id}>
              {facility.name}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Room
        </button>
      </form>
    </div>
  );
}

export default RoomCreate;
