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
      const res = await fetch("http://localhost:5001/api/users/me", {
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
      const res = await fetch("http://localhost:5001/api/users/profile", {
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
                      user.preferredGames.includes(game) 
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
        </div>
      </div>
    </div>
  );
}
