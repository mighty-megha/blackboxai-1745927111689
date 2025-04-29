import React, { useEffect, useState } from 'react';

export default function Analytics({ token }) {
  const [moodData, setMoodData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [error, setError] = useState('');

  const fetchMoodAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/mood', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!response.ok) throw new Error('Failed to fetch mood analytics');
      const data = await response.json();
      setMoodData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProgressAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/progress', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!response.ok) throw new Error('Failed to fetch progress analytics');
      const data = await response.json();
      setProgressData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMoodAnalytics();
    fetchProgressAnalytics();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Progress Analytics</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {moodData && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Mood Distribution</h3>
          <ul className="list-disc list-inside">
            {Object.entries(moodData).map(([mood, percent]) => (
              <li key={mood}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}: {percent}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {progressData && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Goal Progress</h3>
          <p>Goals Completed: {progressData.goalsCompleted} / {progressData.totalGoals}</p>
          <p>Journal Entries: {progressData.journalEntries}</p>
          <p>Meditation Sessions: {progressData.meditationSessions}</p>
        </div>
      )}
    </div>
  );
}
