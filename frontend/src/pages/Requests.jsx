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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/requests/received`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/requests/${id}`, {
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
          <div className="space-y-6">
            {requests.map((req) => (
              <div key={req._id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-yellow-400 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                      {req.sender.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{req.sender.name}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                        {req.sender.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {req.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(req._id, "accepted")}
                          className="bg-black text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition shadow-lg shadow-gray-200"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(req._id, "declined")}
                          className="bg-gray-100 text-gray-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 transition"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className={`px-6 py-2 rounded-full text-sm font-bold capitalize ${
                        req.status === "accepted" ? "bg-[#e8fbf7] text-[#1ebc9c]" : "bg-red-50 text-red-500"
                      }`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-[#f8f8f8] p-6 rounded-3xl">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Game</p>
                    <p className="font-semibold text-gray-800">{req.game}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Time</p>
                    <p className="font-semibold text-gray-800">{req.time}</p>
                  </div>
                  <div className="col-span-2 mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Arena</p>
                    <p className="font-semibold text-gray-800">{req.arena}</p>
                  </div>
                </div>

                {req.message && (
                  <div className="px-4 border-l-4 border-orange-200 italic text-gray-600 text-sm">
                    "{req.message}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
