import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { Link } from "react-router-dom";


const FacilityList = () => {
    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const res = await API.get("facilities/");
                if (res.data.Success) {
                    setFacilities(res.data.data);
                } else {
                    console.error("Failed to fetch facilities:", res.data.message);
                }
            } catch (err) {
                console.error("Error fetching facilities:", err);
            }
        };

        fetchFacilities();
    }, []);


    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Facility List</h2>
                <Link
                    to="/facility-create"
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    + Create
                </Link>
            </div>

            {facilities.length === 0 ? (
                <p>No facilities found.</p>
            ) : (
                <ul className="list-disc pl-5 space-y-1">
                    {facilities.map((f) => (
                        <li key={f.id}>{f.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );

};

export default FacilityList;
