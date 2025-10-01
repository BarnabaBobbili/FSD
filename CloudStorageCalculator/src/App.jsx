// jsx
import { useState } from 'react';
import './App.css';

const CATEGORIES = {
  image: { label: 'Image', rate: 1.20, overhead: 0.10, extra: 0 },
  video: { label: 'Video', rate: 2.00, overhead: 0.20, extra: 0.50 }, // retrieval
  audio: { label: 'Audio', rate: 1.50, overhead: 0.05, extra: 0 },
  document: { label: 'Document', rate: 0.80, overhead: 0.02, extra: 0 },
  archive: { label: 'Archive', rate: 0.60, overhead: 0, extra: 0 } // min 30 days
};

const FILE_EXTENSIONS = {
  // Images
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
  // Videos
  mp4: 'video', avi: 'video', mov: 'video', mkv: 'video', webm: 'video', flv: 'video',
  // Audio
  mp3: 'audio', wav: 'audio', flac: 'audio', aac: 'audio', ogg: 'audio',
  // Documents
  pdf: 'document', doc: 'document', docx: 'document', txt: 'document', rtf: 'document',
  xls: 'document', xlsx: 'document', ppt: 'document', pptx: 'document',
  // Archives
  zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive'
};

function detectCategory(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  return FILE_EXTENSIONS[ext] || 'document';
}

function bytesToGB(bytes) {
  return bytes / (1024 ** 3);
}

function calculateCost(sizeGB, category) {
  const config = CATEGORIES[category];
  const withOverhead = sizeGB * (1 + config.overhead);
  const baseCost = withOverhead * config.rate;
  const extraCost = withOverhead * config.extra;
  
  // Archive minimum 30-day charge
  let finalCost = baseCost + extraCost;
  if (category === 'archive') {
    const minCost = sizeGB * 0.60 * 30 / 30; // 30 days minimum
    finalCost = Math.max(finalCost, minCost);
  }
  
  return {
    sizeGB: +sizeGB.toFixed(4),
    withOverhead: +withOverhead.toFixed(4),
    baseCost: +baseCost.toFixed(2),
    extraCost: +extraCost.toFixed(2),
    total: +finalCost.toFixed(2)
  };
}

const fmtINR = (amount) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export default function App() {
  const [files, setFiles] = useState([]);
  const [manualEntry, setManualEntry] = useState({ name: '', size: '', category: 'document' });

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    const newFiles = uploadedFiles.map((file, index) => {
      const category = detectCategory(file.name);
      const sizeGB = bytesToGB(file.size);
      const cost = calculateCost(sizeGB, category);
      
      return {
        id: Date.now() + index,
        name: file.name,
        sizeBytes: file.size,
        category,
        cost,
        isUploaded: true
      };
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleManualAdd = () => {
    const { name, size, category } = manualEntry;
    if (!name.trim() || !size || Number(size) <= 0) {
      alert('Enter valid name and size.');
      return;
    }
    
    const sizeBytes = Number(size) * 1024 * 1024; // MB to bytes
    const sizeGB = bytesToGB(sizeBytes);
    const cost = calculateCost(sizeGB, category);
    
    const newFile = {
      id: Date.now(),
      name: name.trim(),
      sizeBytes,
      category,
      cost,
      isUploaded: false
    };
    
    setFiles(prev => [...prev, newFile]);
    setManualEntry({ name: '', size: '', category: 'document' });
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const reset = () => {
    setFiles([]);
    setManualEntry({ name: '', size: '', category: 'document' });
  };

  // Calculations
  const categoryTotals = files.reduce((acc, file) => {
    const cat = file.category;
    if (!acc[cat]) acc[cat] = { count: 0, totalCost: 0 };
    acc[cat].count++;
    acc[cat].totalCost += file.cost.total;
    return acc;
  }, {});

  const totalMonthlyCost = files.reduce((sum, file) => sum + file.cost.total, 0);
  const totalYearlyCost = totalMonthlyCost * 12;

  return (
    <div className="container">
      <h1>Cloud Storage Calculator</h1>

      <div className="card">
        <h2>Add Files</h2>
        
        <div className="row">
          <label>Upload Files</label>
          <input type="file" multiple onChange={handleFileUpload} />
        </div>

        <div className="row">
          <label>Manual Entry</label>
          <div className="manual-entry">
            <input
              type="text"
              placeholder="File name"
              value={manualEntry.name}
              onChange={(e) => setManualEntry(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Size (MB)"
              min="0"
              step="0.1"
              value={manualEntry.size}
              onChange={(e) => setManualEntry(prev => ({ ...prev, size: e.target.value }))}
            />
            <select
              value={manualEntry.category}
              onChange={(e) => setManualEntry(prev => ({ ...prev, category: e.target.value }))}
            >
              {Object.entries(CATEGORIES).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <button onClick={handleManualAdd}>Add</button>
          </div>
        </div>

        <div className="actions">
          <button onClick={reset}>Reset All</button>
        </div>
      </div>

      {/* Category Pricing Table */}
      <div className="card">
        <h2>Category Pricing</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Storage Rate (₹/GB)</th>
                <th>Overhead</th>
                <th>Retrieval/Retention</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <tr key={key}>
                  <td>{cat.label}</td>
                  <td>₹{cat.rate.toFixed(2)}</td>
                  <td>
                    {cat.overhead > 0
                      ? `+${(cat.overhead * 100).toFixed(0)}% size`
                      : "—"}
                  </td>
                  <td>
                    {key === "video"
                      ? `Retrieval ₹${cat.extra.toFixed(2)}/GB`
                      : key === "archive"
                      ? "Min charge 30 days"
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {files.length > 0 && (
        <>
          <div className="card">
            <h2>Files Breakdown</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Category</th>
                    <th>Size (GB)</th>
                    <th>With Overhead</th>
                    <th>Monthly Cost</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(file => (
                    <tr key={file.id}>
                      <td>{file.name}</td>
                      <td>{CATEGORIES[file.category].label}</td>
                      <td>{file.cost.sizeGB}</td>
                      <td>{file.cost.withOverhead} GB</td>
                      <td>{fmtINR(file.cost.total)}</td>
                      <td>
                        <button onClick={() => removeFile(file.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2>Summary</h2>
            
            <h3>Per Category</h3>
            {Object.entries(categoryTotals).map(([category, data]) => (
              <div key={category}>
                <strong>{CATEGORIES[category].label}:</strong> {data.count} files, {fmtINR(data.totalCost)}
              </div>
            ))}

            <div className="totals">
              <div><strong>Monthly Total:</strong> {fmtINR(totalMonthlyCost)}</div>
              <div><strong>Yearly Total:</strong> {fmtINR(totalYearlyCost)}</div>
            </div>
          </div>

          <div>
            <h3>Per File Details</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Category</th>
                    <th>Size (GB)</th>
                    <th>+Overhead</th>
                    <th>Storage Cost</th>
                    <th>Extra</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(file => (
                    <tr key={file.id}>
                      <td>{file.name}</td>
                      <td>{CATEGORIES[file.category].label}</td>
                      <td>{file.cost.sizeGB}</td>
                      <td>
                        {file.cost.withOverhead} GB
                        {CATEGORIES[file.category].overhead > 0
                          ? ` (+${CATEGORIES[file.category].overhead * 100}%)`
                          : ""}
                      </td>
                      <td>{fmtINR(file.cost.baseCost)}</td>
                      <td>
                        {file.category === "video"
                          ? `Retrieval: ${fmtINR(file.cost.extraCost)}`
                          : file.category === "archive"
                          ? "Min 30 days"
                          : file.cost.extraCost > 0
                          ? fmtINR(file.cost.extraCost)
                          : "—"}
                      </td>
                      <td><strong>{fmtINR(file.cost.total)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}