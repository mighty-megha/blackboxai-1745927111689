import React, { useState, useEffect } from 'react';

const emotions = [
  'Happy',
  'Sad',
  'Angry',
  'Anxious',
  'Calm',
  'Excited',
  'Tired',
  'Stressed',
];

export default function MoodTracker({ token }) {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [note, setNote] = useState('');
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMoodLogs = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/mood', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch mood logs');
      }
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMoodLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedEmotion) {
      setError('Please select an emotion');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          emotion: selectedEmotion,
          note,
          date: new Date().toISOString().split('T')[0],
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add mood log');
      }
      setSuccess('Mood log added successfully');
      setSelectedEmotion('');
      setNote('');
      fetchMoodLogs();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Mood Tracker</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select your emotion:</label>
          <select
            value={selectedEmotion}
            onChange={(e) => setSelectedEmotion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">-- Select Emotion --</option>
            {emotions.map((emotion) => (
              <option key={emotion} value={emotion}>
                {emotion}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Notes (optional):</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
            placeholder="Write a short note about your mood..."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Mood Log
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-8 mb-4">Your Mood Logs</h3>
      {logs.length === 0 ? (
        <p>No mood logs yet.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {logs.map((log) => (
            <li key={log.id} className="border border-gray-300 rounded p-2">
              <div>
                <strong>{log.date}</strong> - <em>{log.emotion}</em>
              </div>
              {log.note && <div className="text-gray-700">{log.note}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
