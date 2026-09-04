import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleGovLogin = (e) => {
    e.preventDefault();
    navigate('/workspace');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminId === 'Zxcvbnm' && adminPassword === 'Zxcvbnm@121') {
      navigate('/admin');
    } else {
      alert('Access Denied: Invalid Admin Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center relative">
      
      {/* 3-Dot Admin Menu */}
      <button 
        onClick={() => setShowAdminModal(true)}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 transition-colors"
      >
        <MoreVertical size={24} />
      </button>

      {/* Gov Employee Login Box */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
          Border Security Portal
        </h2>
        <form onSubmit={handleGovLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
            <input type="text" required className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" required className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 mt-4">
            Login
          </button>
        </form>
      </div>

      {/* Admin Override Modal */}
      {showAdminModal && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">Admin Override</h3>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input 
                type="text" placeholder="Admin ID" value={adminId} onChange={(e) => setAdminId(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-red-500"
              />
              <input 
                type="password" placeholder="Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="w-1/2 bg-slate-200 text-slate-700 py-2 rounded">Cancel</button>
                <button type="submit" className="w-1/2 bg-red-600 text-white py-2 rounded">Authorize</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}