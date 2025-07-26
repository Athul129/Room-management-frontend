import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const FacilityCreate = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire("Please enter a facility name.");
      return;
    }

    try {
      const res = await API.post("facility_create/", { name });

      if (res.data && res.data.data) {
        Swal.fire("Facility created successfully!");
        setName("");
        navigate("/facility-list"); 
      } else {
        Swal.fire("Failed", res.data.message || "Unknown error", "error");
      }
    } catch (err) {
      console.error("Error creating facility:", err);
      Swal.fire("Something went wrong.", "", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Facility</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Facility Name"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default FacilityCreate;
