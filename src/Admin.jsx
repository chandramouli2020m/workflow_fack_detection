import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const [docType, setDocType] = useState('Aadhaar');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Document successfully queued for database upload!');
    // Backend API integration will go here
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-slate-800">Admin Database Management</h2>
          <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">Sign Out</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
            <select 
              value={docType} 
              onChange={(e) => setDocType(e.target.value)}
              className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Aadhaar">Aadhaar Card</option>
              <option value="PAN">PAN Card</option>
              <option value="Passport">Passport</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Citizen Full Name</label>
            <input type="text" required className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Document ID Number</label>
            <input type="text" required className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Official Document (Scan)</label>
            <input type="file" required className="w-full border border-slate-300 rounded p-2 bg-slate-50" />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 mt-4">
            Upload to Database
          </button>
        </form>
      </div>
    </div>
  );
}   