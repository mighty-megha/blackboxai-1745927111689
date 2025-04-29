import React, { useState, useEffect } from 'react';

export default function GoalTracker({ token }) {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchGoals = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/goals', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();
      setGoals(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title.trim()) {
      setError('Please enter a goal title');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ title, description, frequency }),
      });
      if (!response.ok) {
        throw new Error('Failed to add goal');
      }
      setSuccess('Goal added successfully');
      setTitle('');
      setDescription('');
      setFrequency('daily');
      fetchGoals();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProgressChange = async (goalId, newProgress) => {
    if (newProgress < 0 || newProgress > 100) return;
    try {
      const response = await fetch(\`http://localhost:5000/api/goals/\${goalId}/progress\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ progress: newProgress }),
      });
      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
      fetchGoals();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Goal Tracker</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <form onSubmit={handleAddGoal} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Goal Title"
          className="w-full p-2 border border-gray-300 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          className="w-full p-2 border border-gray-300 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Goal
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Your Goals</h3>
      {goals.length === 0 ? (
        <p>No goals set yet.</p>
      ) : (
        <ul className="space-y-4 max-h-64 overflow-y-auto">
          {goals.map((goal) => (
            <li key={goal.id} className="border border-gray-300 rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold">{goal.title}</h4>
                <span className="text-sm text-gray-600">{goal.frequency}</span>
              </div>
              {goal.description && <p className="mb-2">{goal.description}</p>}
              <div>
                <label htmlFor={'progress-' + goal.id} className="block mb-1">
                  Progress: {goal.progress}%
                </label>
                <input
                  id={'progress-' + goal.id}
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => handleProgressChange(goal.id, Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
