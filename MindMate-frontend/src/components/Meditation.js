import React, { useEffect, useState } from 'react';

export default function Meditation({ token }) {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  const fetchSessions = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/meditation', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch meditation sessions');
      }
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Meditation & Breathing Exercises</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {sessions.length === 0 ? (
        <p>No meditation sessions available.</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session) => (
            <li key={session.id} className="border border-gray-300 rounded p-4">
              <h3 className="text-xl font-semibold">{session.title}</h3>
              <p className="mb-2">{session.description}</p>
              <p className="text-sm text-gray-600">Duration: {session.duration} minutes</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
