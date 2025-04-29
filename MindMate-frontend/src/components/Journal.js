import React, { useState, useEffect } from 'react';

export default function Journal({ token }) {
  const [content, setContent] = useState('');
  const [moodTags, setMoodTags] = useState('');
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchEntries = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/journal', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch journal entries');
      }
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!content.trim()) {
      setError('Please enter journal content');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          content,
          moodTags: moodTags.split(',').map(tag => tag.trim()).filter(tag => tag),
          date: new Date().toISOString().split('T')[0],
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add journal entry');
      }
      setSuccess('Journal entry added successfully');
      setContent('');
      setMoodTags('');
      fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Personal Journal</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          rows="5"
          placeholder="Write your journal entry here..."
          required
        />
        <input
          type="text"
          value={moodTags}
          onChange={(e) => setMoodTags(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Mood tags (comma separated)"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Entry
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-8 mb-4">Your Journal Entries</h3>
      {entries.length === 0 ? (
        <p>No journal entries yet.</p>
      ) : (
        <ul className="space-y-4 max-h-64 overflow-y-auto">
          {entries.map((entry) => (
            <li key={entry.id} className="border border-gray-300 rounded p-4">
              <div className="text-gray-600 text-sm mb-2">{entry.date}</div>
              <div className="whitespace-pre-wrap">{entry.content}</div>
              {entry.moodTags && entry.moodTags.length > 0 && (
                <div className="mt-2">
                  <strong>Mood Tags:</strong>{' '}
                  {entry.moodTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded mr-2 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
