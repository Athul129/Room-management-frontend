
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import Swal from 'sweetalert2';

const AdminRoomEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        details: "",
        room_type: "",
        room_number: "",
        price: "",
        category: "",
        status: "",
        cover_image: null,
        facilities: [],
        room_images: [],
    });

    const [facilitiesList, setFacilitiesList] = useState([]);
    const [existingCoverImage, setExistingCoverImage] = useState(null);
    const [existingRoomImages, setExistingRoomImages] = useState([]);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await API.get(`/rooms/${id}/`);
                const room = res.data;
                setForm({
                    name: room.name,
                    details: room.details,
                    room_type: room.room_type,
                    room_number: room.room_number,
                    price: room.price,
                    category: room.category,
                    status: room.status,
                    cover_image: null,
                    facilities: room.facilities.map(f => f.id),
                    room_images: [],
                });
                setExistingCoverImage(room.cover_image);
                setExistingRoomImages(room.room_images);
            } catch (err) {
                console.error("Failed to fetch room", err);
            }
        };

        const fetchFacilities = async () => {
            try {
                const res = await API.get("/facilities/");
                setFacilitiesList(res.data.data);
            } catch (err) {
                console.error("Failed to fetch facilities", err);
            }
        };

        fetchRoom();
        fetchFacilities();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    // };
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "cover_image") {
            setForm({ ...form, cover_image: files[0] });
        } else if (name === "room_images") {
            setForm({ ...form, room_images: files });
        }
    };


    const handleFacilityChange = (value) => {  
        if (form.facilities.includes(value)) { //// If facility is already selected (checkbox was checked), remove it
            setForm({ ...form, facilities: form.facilities.filter(f => f !== value) }); //if it is already selected, remove it from the list using fileter
        } else {
            setForm({ ...form, facilities: [...form.facilities, value] }); // if it is not selected, add it to the list
        }
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

        if (form.cover_image instanceof File) {
            formData.append("cover_image", form.cover_image); // instace of means that it is a  real file or not
        }

        form.facilities.forEach(id => {
            formData.append("facilities", id);
        });

        for (let i = 0; i < form.room_images.length; i++) {
            formData.append("room_images", form.room_images[i]);
        }

        // form.room_images.forEach(img => {
        //     formData.append("room_images", img);
        // });

        try {
            const res = await API.put(`/rooms/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.message) {
                Swal.fire("Room updated!");
                navigate(`/rooms/${id}`);
            } else {
                Swal.fire("Update failed: " + res.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Update failed: " + (err.response?.data?.message || "Unknown error"));
        }
    };


    return (
        <div className="p-4 max-w-2xl mx-auto">
            {/* <BackToHomeButton /> */}
            <h2 className="text-xl font-bold mb-4">Edit Room</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2" />
                <textarea name="details" value={form.details} onChange={handleChange} placeholder="Details" className="w-full border p-2" />
                <input type="text" name="room_number" value={form.room_number} onChange={handleChange} placeholder="Room Number" className="w-full border p-2" />
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full border p-2" />

                <select name="room_type" value={form.room_type} onChange={handleChange} className="w-full border p-2">
                    <option value="">Select Type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                </select>
                <select name="category" value={form.category} onChange={handleChange} required className="w-full border p-2">
                    <option value="">Select Category</option>
                    <option value="ac">AC</option>
                    <option value="non_ac">Non-AC</option>
                </select>
                <select name="status" value={form.status} onChange={handleChange} required className="w-full border p-2">
                    <option value="">Select Status</option>
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                </select>


                {existingCoverImage && (
                    <div>
                        <p>Current Cover Image:</p>
                        <img src={`${existingCoverImage}`} alt="cover" className="w-40 mb-2" />
                    </div>
                )}
                <input type="file" name="cover_image" onChange={handleFileChange} className="w-full border p-2" />

                <p className="mt-4 font-semibold">Facilities</p>
                <div className="flex flex-wrap gap-2">
                    {facilitiesList.map(facility => (
                        <label key={facility.id} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                value={facility.id}
                                checked={form.facilities.includes(facility.id)} // includes to check if a specific value is in the array:  checked is a boolean prop 
                                onChange={(e) => handleFacilityChange(parseInt(e.target.value))} // parseInt converts the string value to an integer
                            />
                            {facility.name}
                        </label>
                    ))}
                </div>
                <p className="mt-4 font-semibold">Room Images</p>

                {existingRoomImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {existingRoomImages.map((img) => (
                            <img
                                key={img.id}
                                src={img.image}
                                className="w-32 h-24 object-cover rounded"
                            />
                        ))}
                    </div>
                )}

                <input
                    type="file"
                    name="room_images"
                    multiple
                    onChange={handleFileChange}
                    className="w-full border p-2"
                />


                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Room</button>
            </form>
        </div>
    );
};

export default AdminRoomEdit;
