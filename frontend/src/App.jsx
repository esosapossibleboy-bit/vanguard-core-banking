import React, { useState } from 'react';
import LedgerSettlePanel from './LedgerSettlePanel';
import IsoMessagingConsole from './IsoMessagingConsole'; // 🌟 Import our new module!

export default function App() {
  // 1. 🧠 State Management Core Memory Boxes
  const [transferId, setTransferId] = useState('');
  const [debitAccount, setDebitAccount] = useState('acc_cash_reserve');
  const [debitAmount, setDebitAmount] = useState('');
  const [creditAccount, setCreditAccount] = useState('acc_liquidity_pool');
  const [creditAmount, setCreditAmount] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [auditTrail, setAuditTrail] = useState([]);

  // YEAR 2: ISO 20022 Compilation State Boxes
  const [isoTransferId, setIsoTransferId] = useState('');
  const [isoAmount, setIsoAmount] = useState('');
  const [isoCurrency, setIsoCurrency] = useState('EUR');
  const [isoDbtrAcc, setIsoDbtrAcc] = useState('acc_cash_reserve');
  const [isoCdtrAcc, setIsoCdtrAcc] = useState('acc_liquidity_pool');
  const [compiledXml, setCompiledXml] = useState('');

  // 2. 📝 Network Action: Dispatches a block transaction to the banking clearinghouse
  const handleExecuteSettlement = async () => {
    try {
      setError(''); setSuccess('');
      if (!transferId || !debitAmount || !creditAmount) { setError('All transactional bounds variables are mandatory!'); return; }

      const response = await fetch('http://localhost:3000/api/ledger/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferId,
          debits: [{ accountId: debitAccount, amount: Number(debitAmount) }],
          credits: [{ accountId: creditAccount, amount: Number(creditAmount) }]
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setAuditTrail((prev) => [data, ...prev]);
        
        // Pre-populate our Year 2 ISO compiler form fields automatically!
        setIsoTransferId(data.transferId);
        setIsoAmount(debitAmount);
        
        setTransferId(''); setDebitAmount(''); setCreditAmount('');
      } else { setError(data.error); }
    } catch { setError('Connection lost to sovereign banking vault gate.'); }
  };

  // 3. 📄 Network Action: Serializes data fields into an international ISO XML envelope
  const handleCompileISO = async () => {
    try {
      setError(''); setSuccess(''); setCompiledXml('');
      if (!isoTransferId || !isoAmount || !isoDbtrAcc || !isoCdtrAcc) { setError('Missing mandatory fields to compile message schema!'); return; }

      const response = await fetch('http://localhost:3000/api/ledger/compile-iso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferId: isoTransferId,
          amount: Number(isoAmount),
          currency: isoCurrency,
          dbtrAcc: isoDbtrAcc,
          cdtrAcc: isoCdtrAcc
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCompiledXml(data.isoXmlOutput);
        setSuccess(data.message);
      } else { setError(data.error); }
    } catch { setError('Clearinghouse ISO compilation parser engine offline.'); }
  };

  return (
    <div style={{ fontFamily: 'monospace', backgroundColor: '#0f172a', minHeight: '100vh', padding: '50px 20px', color: '#e2e8f0' }}>
      <center>
        <div style={{ textAlign: 'left', maxWidth: '1000px', marginBottom: '25px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>Vanguard Commercial Banking Node</span>
          <h1 style={{ margin: '4px 0 0 0', fontSize: '2.5rem', color: '#f8fafc', fontWeight: '800' }}>🏛️ VanguardCore Ledger</h1>
        </div>

        {error && <p style={{ color: '#f87171', backgroundColor: '#7f1d1d', padding: '12px', borderRadius: '8px', maxWidth: '1000px', textAlign: 'left', fontWeight: 'bold', border: '1px solid #b91c1c' }}>⚠️ ERROR_LOG: {error}</p>}
        {success && <p style={{ color: '#4ade80', backgroundColor: '#064e3b', padding: '12px', borderRadius: '8px', maxWidth: '1000px', textAlign: 'left', fontWeight: 'bold', border: '1px solid #047857' }}>🎉 CORE_LOG: {success}</p>}

        {/* --- Main Workspace Layout Grid --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '30px', width: '100%', maxWidth: '1000px', textAlign: 'left', marginTop: '25px' }}>
          
          {/* LEFT COLUMN: MODULAR INTAKE PANELS LAYER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <LedgerSettlePanel 
              transferId={transferId} setTransferId={setTransferId}
              debitAccount={debitAccount} setDebitAmount={setDebitAmount} debitAmount={debitAmount}
              creditAccount={creditAccount} setCreditAmount={setCreditAmount} creditAmount={creditAmount}
              handleExecuteSettlement={handleExecuteSettlement}
            />

            <IsoMessagingConsole 
              isoTransferId={isoTransferId} setIsoTransferId={setIsoTransferId}
              isoAmount={isoAmount} setIsoAmount={setIsoAmount}
              isoCurrency={isoCurrency} setIsoCurrency={setIsoCurrency}
              isoDbtrAcc={isoDbtrAcc} setIsoDbtrAcc={setIsoDbtrAcc}
              isoCdtrAcc={isoCdtrAcc} setIsoCdtrAcc={setIsoCdtrAcc}
              handleCompileISO={handleCompileISO}
              compiledXml={compiledXml}
            />
          </div>

          {/* RIGHT COLUMN: REAL-TIME CRYPTOGRAPHIC AUDIT RAIL LIST MONITOR */}
          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#10b981', borderBottom: '2px solid #334155', paddingBottom: '10px', fontSize: '1.2rem' }}>📜 Secure Audit Trail Ledger</h3>
            
            {auditTrail.length === 0 ? (
              <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center', padding: '30px', border: '1px dashed #475569', borderRadius: '8px' }}>
                Awaiting inbound double-entry confirmation tokens...
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '550px', overflowY: 'auto' }}>
                {auditTrail.map((tx, index) => (
                  <div key={index} style={{ padding: '12px', backgroundColor: '#0f172a', borderRadius: '6px', border: '1px solid #475569', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f8fafc', fontWeight: 'bold', marginBottom: '4px' }}>
                      <span>🆔 TX ID: {tx.transferId}</span>
                      <span style={{ color: '#10b981' }}>✓ COMMITTED</span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b', wordBreak: 'break-all', fontSize: '0.75rem' }}>
                      <b>SHA-256 Seal:</b> <code style={{ color: '#94a3b8' }}>{tx.auditSignature}</code>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </center>
    </div>
  );
}
