import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    game: "All games",
    skill: "All skill levels",
    location: "Anywhere"
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [arenas, setArenas] = useState([]);
  const [requestData, setRequestData] = useState({
    game: "",
    arena: "",
    time: "",
    message: ""
  });

  useEffect(() => {
    fetchPlayers();
  }, [filters]);

  // Fetch arenas when selected player changes
  useEffect(() => {
    const fetchArenas = async () => {
      if (selectedPlayer?.location) {
        try {
          // Attempt to extract city from location string
          const parts = selectedPlayer.location.split(",");
          const city = parts.length > 1 ? parts[parts.length - 2].trim() : parts[0].trim();
          
          const API_URL = import.meta.env.VITE_API_URL || "";
          const res = await fetch(`${API_URL}/api/arenas/search?city=${city}`);
          const data = await res.json();
          if (res.ok) setArenas(data);
        } catch (error) {
          console.error("Error fetching arenas:", error);
        }
      } else {
        setArenas([]);
      }
    };
    fetchArenas();
  }, [selectedPlayer]);

  const fetchPlayers = async () => {
    try {
      const { search, game, skill, location } = filters;
      const API_URL = import.meta.env.VITE_API_URL || "";
      let url = `${API_URL}/api/users?name=${search}&game=${game}&skill=${skill}&location=${location}`;
      
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (res.ok) setPlayers(data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const openRequestModal = (player) => {
    setSelectedPlayer(player);
    setRequestData({
      game: player.preferredGames[0] || "",
      arena: "",
      time: "",
      message: ""
    });
    setIsModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_URL}/api/requests/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ 
          receiverId: selectedPlayer._id, 
          ...requestData 
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Request sent successfully!");
        setIsModalOpen(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="px-12 py-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Find your next partner</h1>
        <p className="text-gray-500">{players.length} players match your filters.</p>
      </div>

      {/* Filter Bar */}
      <div className="px-12 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-3.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input
                type="text"
                placeholder="Search players, neighborhoods..."
                className="w-full pl-12 pr-4 py-3 bg-[#f8f8f8] rounded-2xl border-none focus:ring-2 focus:ring-orange-500"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            
            <div className="w-1/4">
              <select
                className="w-full px-4 py-3 bg-[#f8f8f8] rounded-2xl border-none focus:ring-2 focus:ring-orange-500 appearance-none"
                value={filters.game}
                onChange={(e) => setFilters({ ...filters, game: e.target.value })}
              >
                <option>All games</option>
                <option>Badminton</option>
                <option>Volleyball</option>
                <option>Cricket</option>
                <option>Tennis</option>
                <option>Chess</option>
              </select>
            </div>

            <div className="w-1/4">
              <select
                className="w-full px-4 py-3 bg-[#f8f8f8] rounded-2xl border-none focus:ring-2 focus:ring-orange-500 appearance-none"
                value={filters.skill}
                onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
              >
                <option>All skill levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div className="w-1/4">
            <input
              type="text"
              placeholder="Filter by city/location"
              className="w-full px-4 py-3 bg-[#f8f8f8] rounded-2xl border-none focus:ring-2 focus:ring-orange-500 appearance-none"
              value={filters.location === "Anywhere" ? "" : filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value || "Anywhere" })}
            />
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {players.map((player) => (
          <div key={player._id} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{player.name}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                  {player.location || "Location not set"}
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-6 text-sm italic">
              {player.bio || "No bio yet."}
            </p>

            <div className="mt-auto">
              <div className="flex flex-wrap gap-2 mb-8">
                {player.skillLevel && (
                  <span className="bg-[#e8fbf7] text-[#1ebc9c] text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                    {player.skillLevel}
                  </span>
                )}
                {player.preferredGames.map((game, index) => (
                  <span key={index} className="bg-[#f5f5f5] text-gray-600 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                    {game === "Badminton" && "🏸"}
                    {game === "Volleyball" && "🏐"}
                    {game === "Cricket" && "🏏"}
                    {game === "Tennis" && "🎾"}
                    {game === "Chess" && "♟️"}
                    {game}
                  </span>
                ))}
              </div>

              <button
                onClick={() => openRequestModal(player)}
                className="w-full bg-gradient-to-r from-[#ff8c37] to-[#ffc33d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 hover:opacity-90 transition transform active:scale-[0.98]"
              >
                Send play request
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* REQUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-8 text-gray-400 hover:text-black transition"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <h2 className="text-2xl font-bold mb-2">Request to Play</h2>
            <p className="text-gray-500 mb-8 italic">With {selectedPlayer?.name}</p>

            <form onSubmit={handleSendRequest} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Game Arena</label>
                <select 
                  required
                  className="w-full px-4 py-3 bg-[#f8f8f8] border-none rounded-2xl focus:ring-2 focus:ring-orange-500 appearance-none"
                  value={requestData.arena}
                  onChange={(e) => setRequestData({...requestData, arena: e.target.value})}
                >
                  <option value="">Select Arena</option>
                  {arenas.length > 0 ? (
                    arenas.map(arena => (
                      <option key={arena._id} value={`${arena.name} (${arena.address})`}>{arena.name} ({arena.address})</option>
                    ))
                  ) : (
                    <option disabled>No arenas found nearby</option>
                  )}
                  <option value="custom">Decide in chat</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Game</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-[#f8f8f8] border-none rounded-2xl focus:ring-2 focus:ring-orange-500 appearance-none"
                    value={requestData.game}
                    onChange={(e) => setRequestData({...requestData, game: e.target.value})}
                  >
                    {selectedPlayer?.preferredGames.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                  <input 
                    type="time"
                    required
                    className="w-full px-4 py-3 bg-[#f8f8f8] border-none rounded-2xl focus:ring-2 focus:ring-orange-500"
                    value={requestData.time}
                    onChange={(e) => setRequestData({...requestData, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
                <textarea 
                  placeholder="Hey, let's play a friendly match!"
                  className="w-full px-4 py-3 bg-[#f8f8f8] border-none rounded-2xl focus:ring-2 focus:ring-orange-500 h-24"
                  value={requestData.message}
                  onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#ff8c37] to-[#ffc33d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 hover:opacity-90 transition transform active:scale-[0.98] mt-4"
              >
                Confirm Request
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}