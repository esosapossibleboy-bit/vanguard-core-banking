import React from 'react';

export default function IsoMessagingConsole({
  isoTransferId, setIsoTransferId,
  isoAmount, setIsoAmount,
  isoCurrency, setIsoCurrency,
  isoDbtrAcc, setIsoDbtrAcc,
  isoCdtrAcc, setIsoCdtrAcc,
  handleCompileISO,
  compiledXml
}) {
  return (
    <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#eab308', borderBottom: '2px solid #334155', paddingBottom: '10px', fontSize: '1.1rem' }}>
        📄 ISO 20022 Financial Messaging Terminal
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
          <input type="text" placeholder="Transfer Ref ID..." value={isoTransferId} onChange={(e) => setIsoTransferId(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none' }} />
          <input type="number" placeholder="Amount..." value={isoAmount} onChange={(e) => setIsoAmount(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
          <input type="text" placeholder="Sender (Debtor) Acc..." value={isoDbtrAcc} onChange={(e) => setIsoDbtrAcc(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none' }} />
          <select value={isoCurrency} onChange={(e) => setIsoCurrency(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none' }}>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        <input type="text" placeholder="Receiver (Creditor) Acc..." value={isoCdtrAcc} onChange={(e) => setIsoCdtrAcc(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none' }} />

        <button onClick={handleCompileISO} style={{ padding: '12px', backgroundColor: '#eab308', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
          🛠️ Compile ISO 20022 pacs.008 XML
        </button>
      </div>

      {compiledXml && (
        <div style={{ marginTop: '15px' }}>
          <span style={{ color: '#eab308', fontWeight: 'bold', fontSize: '0.8rem', display: 'block', marginBottom: '6px' }}>📜 VALIDATED CLEARINGHOUSE XML MESSAGING BLOCK:</span>
          <pre style={{ margin: '0', backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', overflowX: 'auto', fontSize: '0.75rem', color: '#cbd5e1', border: '1px solid #475569', maxHeight: '200px' }}>
            <code>{compiledXml}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
