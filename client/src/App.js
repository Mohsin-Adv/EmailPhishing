import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [senderEmail, setSenderEmail] = useState('');
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const analyzeEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        sender: senderEmail,
        email: emailText,
      });
      setResult(response.data.result);
    } catch (err) {
      setResult('Error analyzing email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center drop-shadow-sm">
          🛡️ Email Phishing Detector
        </h1>

        <input
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="email"
          placeholder="Sender email (e.g. support@paypal.com)"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
        />

        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
          placeholder="Paste the email content here..."
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
        />

        <div className="flex justify-center mt-6">
          <button
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
            onClick={analyzeEmail}
            disabled={loading}
          >
            {loading ? '🔍 Analyzing...' : '🚀 Analyze Email'}
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 border-l-4 border-blue-600 rounded shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">🧠 Result:</h2>
            <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;