import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

export default function Workspace() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
  const [docType, setDocType] = useState('Passport');
  const [file, setFile] = useState(null);
  
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const [faceResult, setFaceResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // --- MODULE 1, 2, 3: OCR & Tampering ---
  const handleScan = async () => {
    if (!file) return alert("Please upload a document first!");
    
    setIsScanning(true);
    const formData = new FormData();
    formData.append('doc_type', docType);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/scan-document', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setScanResults(data);
    } catch (error) {
      console.error(error);
      alert("Failed to connect to AI server.");
    } finally {
      setIsScanning(false);
    }
  };

  // --- MODULE 4: Live Face Verification ---
  const handleFaceVerify = async () => {
    if (!file) return alert("Please upload an ID document to compare against!");
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return alert("Webcam not ready!");

    setIsVerifying(true);
    try {
      // Convert webcam screenshot (base64) to a File object
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const liveFile = new File([blob], "live_capture.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append('live_image', liveFile);
      formData.append('document_image', file);

      const response = await fetch('http://localhost:8000/api/verify-face', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setFaceResult(data);
    } catch (error) {
      console.error(error);
      alert("Face verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-slate-800">Border Security AI Screening</h1>
        <button onClick={() => navigate('/')} className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200">Logout</button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        
        {/* Left Column: Document Upload & OCR */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4 flex flex-col">
          <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">1. Document Input</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Identity Document</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full border border-slate-300 rounded p-2 mb-4">
              <option>Passport</option>
              <option>Visa</option>
              <option>National ID</option>
            </select>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full border border-slate-300 rounded p-2 bg-slate-50 mb-4" />
          </div>
          
          <button onClick={handleScan} disabled={isScanning} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-blue-300">
            {isScanning ? 'Running AI Extraction...' : 'Run AI Analysis'}
          </button>

          {/* Results Display */}
          {scanResults && (
            <div className={`mt-4 p-4 rounded border ${scanResults.verdict === 'Clear' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className="font-bold text-slate-700 mb-2">Security Verdict: {scanResults.verdict}</h3>
              <p className="text-sm text-slate-600 mb-1"><strong>Tamper Score:</strong> {scanResults.tampering_score}</p>
              <p className="text-sm text-slate-600 break-words"><strong>Extracted Data:</strong> {scanResults.extracted_text}</p>
            </div>
          )}
        </div>

        {/* Right Column: Live Face Capture & DeepFace */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4 flex flex-col">
          <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">2. Live Face Verification</h2>
          <div className="bg-slate-900 rounded overflow-hidden aspect-video relative flex items-center justify-center">
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
          </div>
          
          <button onClick={handleFaceVerify} disabled={isVerifying} className="w-full bg-emerald-600 text-white py-2 rounded font-semibold hover:bg-emerald-700 disabled:bg-emerald-300">
            {isVerifying ? 'Verifying Biometrics...' : 'Capture Face & Verify'}
          </button>

          {/* Face Match Results */}
          {faceResult && (
            <div className={`mt-4 p-4 rounded border ${faceResult.match ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className="font-bold text-slate-700 mb-2">Biometric Match: {faceResult.match ? "VERIFIED" : "FAILED"}</h3>
              <p className="text-sm text-slate-600"><strong>Distance Score:</strong> {faceResult.confidence_score} (Lower is better)</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}