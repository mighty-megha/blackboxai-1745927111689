import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import MoodTracker from './components/MoodTracker';
import AdminDashboard from './components/AdminDashboard';
import Journal from './components/Journal';
import Quotes from './components/Quotes';
import Meditation from './components/Meditation';
import Analytics from './components/Analytics';

export default function App() {
  const [token, setToken] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (jwtToken) => {
    setToken(jwtToken);
    // Decode token to check role (simple base64 decode, for demo only)
    try {
      const payload = JSON.parse(atob(jwtToken.split('.')[1]));
      setIsAdmin(payload.role === 'admin');
    } catch {
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
  };

  if (token) {
    if (isAdmin) {
      return (
        <div className="min-h-screen bg-blue-50 p-4">
          <AdminDashboard token={token} />
          <div className="max-w-xl mx-auto p-6">
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-blue-50 p-4 space-y-6">
        <Quotes token={token} />
        <MoodTracker token={token} />
        <Journal token={token} />
        <Meditation token={token} />
        <Analytics token={token} />
        <div className="max-w-xl mx-auto p-6">
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      {showSignup ? (
        <>
          <Signup onSignup={() => setShowSignup(false)} />
          <p className="text-center mt-4">
            Already have an account?{' '}
            <button
              onClick={() => setShowSignup(false)}
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
          </p>
        </>
      ) : (
        <>
          <Login onLogin={handleLogin} />
          <p className="text-center mt-4">
            Don't have an account?{' '}
            <button
              onClick={() => setShowSignup(true)}
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </>
      )}
    </div>
  );
}
