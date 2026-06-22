import badmintonImg from "../assets/badminton.jpg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 GEOLOCATION
  const requestLocation = async (token) => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      try {
        const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`);
        const geoData = await geoRes.json();
        const locationStr = geoData.results[0]?.formatted_address || "Unknown Location";

        const API_URL = import.meta.env.VITE_API_URL || "";
        await fetch(`${API_URL}/api/users/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            location: locationStr,
            coordinates: { lat: latitude, lng: longitude }
          })
        });

        const storedUser = JSON.parse(localStorage.getItem("user"));
        storedUser.location = locationStr;
        storedUser.coordinates = { lat: latitude, lng: longitude };
        localStorage.setItem("user", JSON.stringify(storedUser));
        
        console.log("SquadPlay: Precise location saved.");
      } catch (err) {
        console.error("Google Geo error:", err);
      }
    });
  };

  // 🔹 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        await requestLocation(data.token);

        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful. Please login.");
        setIsSignup(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 FORGOT PASSWORD
  const handleForgotPassword = async () => {
    const userEmail = prompt("Enter your email");
    if (!userEmail) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] p-6">
      
      {/* Main Container */}
      <div className="w-full max-w-6xl h-[650px] bg-white rounded-3xl overflow-hidden flex shadow-2xl">

        {/* LEFT SIDE (FORM) */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="mb-6 text-xl font-semibold">SquadPlay</div>

          {/* Heading */}
          <h1 className="text-3xl font-bold mb-2">
            {isSignup ? "Create Account" : "Welcome Back"} <br />
            to SquadPlay
          </h1>

          <p className="text-gray-500 mb-6">
            Your journey toward peak performance continues here.
          </p>

          {/* Form */}
          <form
            onSubmit={isSignup ? handleSignup : handleLogin}
            className="space-y-4"
          >

            {isSignup && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />

            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />

              {!isSignup && (
                <span
                  onClick={handleForgotPassword}
                  className="absolute right-4 top-3 text-sm text-blue-500 cursor-pointer"
                >
                  Forgot?
                </span>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input type="checkbox" />
              <span>I agree to the Terms & Privacy</span>
            </div>

            {/* Button */}
            <button className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:opacity-90 transition">
              {isSignup ? "Sign up" : "Log in"}
            </button>

            {/* Divider */}
            <div className="text-center text-gray-400 text-sm">
              or continue with
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4">
              <button className="w-1/2 py-3 border rounded-xl">Google</button>
              <button className="w-1/2 py-3 border rounded-xl">Apple</button>
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
              <span
                onClick={() => setIsSignup(!isSignup)}
                className="text-black font-medium cursor-pointer"
              >
                {isSignup ? "Log in" : "Sign up"}
              </span>
            </p>

          </form>
        </div>

        {/* RIGHT SIDE (IMAGE) */}
        <div className="w-1/2 relative">
          <img
            src={badmintonImg}
            alt="sports"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/20"></div>

          <div className="absolute top-6 right-6 text-white text-lg font-semibold">
            SquadPlay
          </div>

          <div className="absolute bottom-6 left-6 text-white text-sm opacity-70">
          </div>
        </div>

      </div>
    </div>
  );
}