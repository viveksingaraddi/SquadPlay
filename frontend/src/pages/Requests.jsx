import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/requests/received", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (res.ok) setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5001/api/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setRequests(requests.map(r => r._id === id ? { ...r, status } : r));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-10 py-12">
        <h1 className="text-3xl font-bold mb-2">Play Requests</h1>
        <p className="text-gray-500 mb-8">Manage your incoming game invitations.</p>

        {loading ? (
          <div>Loading...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm text-center">
            <p className="text-gray-400">No requests received yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {req.sender.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{req.sender.name}</h3>
                    <p className="text-gray-500 text-sm">
                      wants to play <span className="text-orange-500 font-semibold">{req.game}</span> • {req.sender.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(req._id, "accepted")}
                        className="bg-black text-white px-6 py-2.5 rounded-2xl font-semibold hover:opacity-90 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req._id, "declined")}
                        className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-2xl font-semibold hover:bg-gray-200 transition"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                      req.status === "accepted" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
