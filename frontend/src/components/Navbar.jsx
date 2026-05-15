import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div onClick={() => navigate("/home")} className="flex items-center gap-2 font-bold text-xl cursor-pointer">
        <div className="bg-orange-500 p-1.5 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </div>
        SquadPlay
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
        <button 
          onClick={() => navigate("/home")} 
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${isActive("/home") ? "bg-orange-50 text-orange-600" : "hover:text-gray-900 hover:bg-gray-50"}`}
        >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           Browse
        </button>
        <button 
          onClick={() => navigate("/requests")} 
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${isActive("/requests") ? "bg-orange-50 text-orange-600" : "hover:text-gray-900 hover:bg-gray-50"}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          Requests
        </button>
        <button 
          onClick={() => navigate("/profile")} 
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${isActive("/profile") ? "bg-orange-50 text-orange-600" : "hover:text-gray-900 hover:bg-gray-50"}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          Profile
        </button>
        <div className="w-px h-4 bg-gray-200 mx-2"></div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-xl hover:text-red-600 hover:bg-red-50 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Sign out
        </button>
      </div>
    </nav>
  );
}
