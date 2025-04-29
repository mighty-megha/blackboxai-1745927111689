import React, { useEffect, useState } from 'react';

export default function Quotes({ token }) {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');

  const fetchQuote = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/quotes/daily', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const data = await response.json();
      setQuote(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-semibold mb-4">Daily Motivational Quote</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {quote ? (
        <blockquote className="italic text-lg text-gray-700">"{quote.text}"</blockquote>
      ) : (
        <p>Loading quote...</p>
      )}
      <button
        onClick={fetchQuote}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        New Quote
      </button>
    </div>
  );
}
