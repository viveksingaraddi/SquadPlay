import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    game: "All games",
    skill: "All skill levels",
    location: "Anywhere"
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchPlayers();
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [filters]);

  const fetchPlayers = async () => {
    try {
      const { search, game, skill, location } = filters;
      let url = `http://localhost:5001/api/users?name=${search}&game=${game}&skill=${skill}&location=${location}`;
      
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

  const handleSendRequest = async (receiverId, game) => {
    try {
      const res = await fetch("http://localhost:5001/api/requests/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ receiverId, game: game || "General" })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Request sent!");
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
            <select
              className="w-full px-4 py-3 bg-[#f8f8f8] rounded-2xl border-none focus:ring-2 focus:ring-orange-500 appearance-none"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            >
              <option>Anywhere</option>
              <option>Koramangala, Bangalore</option>
              <option>HSR Layout, Bangalore</option>
              <option>Indiranagar, Bangalore</option>
            </select>
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
                onClick={() => handleSendRequest(player._id, player.preferredGames[0])}
                className="w-full bg-gradient-to-r from-[#ff8c37] to-[#ffc33d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 hover:opacity-90 transition transform active:scale-[0.98]"
              >
                Send play request
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {players.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No players found matching your criteria.</p>
        </div>
      )}

    </div>
  );
}