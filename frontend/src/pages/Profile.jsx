import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    skillLevel: "",
    preferredGames: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (res.ok) setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        alert("Profile updated!");
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGameToggle = (game) => {
    const games = user.preferredGames.includes(game)
      ? user.preferredGames.filter(g => g !== game)
      : [...user.preferredGames, game];
    setUser({ ...user, preferredGames: games });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-500 mb-8">Update your preferences and availability.</p>
          
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Form fields here */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full px-4 py-3 bg-[#f8f8f8] border-none rounded-2xl text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
              <input
                type="text"
                placeholder="e.g. Koramangala, Bangalore"
                value={user.location}
                onChange={(e) => setUser({ ...user, location: e.target.value })}
                className="w-full px-4 py-3 bg-[#f8f8f8] border-none rounded-2xl focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
              <textarea
                placeholder="Tell others about your playing style..."
                value={user.bio}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                className="w-full px-4 py-3 bg-[#f8f8f8] border-none rounded-2xl focus:ring-2 focus:ring-orange-500 h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skill Level</label>
              <select
                value={user.skillLevel}
                onChange={(e) => setUser({ ...user, skillLevel: e.target.value })}
                className="w-full px-4 py-3 bg-[#f8f8f8] border-none rounded-2xl focus:ring-2 focus:ring-orange-500 appearance-none"
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Games</label>
              <div className="flex flex-wrap gap-2">
                {["Badminton", "Volleyball", "Cricket", "Tennis", "Chess", "Table Tennis"].map(game => (
                  <button
                    key={game}
                    type="button"
                    onClick={() => handleGameToggle(game)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                      user.preferredGames?.includes(game) 
                        ? "bg-black text-white" 
                        : "bg-[#f0f0f0] text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {game}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#ff8c37] to-[#ffc33d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 hover:opacity-90 transition transform active:scale-[0.98] mt-4"
            >
              Save Profile
            </button>
          </form>
          
          {/* ✅ LAST CONNECTIONS SECTION */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Last Connections</h2>
            {user.lastConnections && user.lastConnections.length > 0 ? (
              <div className="space-y-4">
                {user.lastConnections.map((connection) => (
                  <div key={connection._id} className="flex items-center gap-4 bg-[#f8f8f8] p-4 rounded-2xl border border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {connection.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{connection.name}</h3>
                      <p className="text-sm text-gray-500">{connection.location || "Location unknown"}</p>
                    </div>
                    <div className="hidden md:flex flex-wrap gap-1 justify-end">
                      {connection.preferredGames?.map((game, i) => (
                        <span key={i} className="bg-white text-gray-600 text-[10px] px-2 py-1 rounded-full border border-gray-200">
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">You haven't played with anyone yet. Head to the home page to find partners!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
