import React from 'react';

export default function LedgerSettlePanel({
  transferId, setTransferId,
  debitAccount, setDebitAmount, debitAmount,
  creditAccount, setCreditAmount, creditAmount,
  handleExecuteSettlement
}) {
  const drValue = Number(debitAmount) || 0;
  const crValue = Number(creditAmount) || 0;
  const isBalanced = drValue === crValue && drValue > 0;

  return (
    <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#38bdf8', borderBottom: '2px solid #334155', paddingBottom: '10px', fontSize: '1.2rem' }}>
        ✍️ Inbound Settlement Queue Form
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label htmlFor="tx-id-input" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8' }}>Sovereign Transfer Identifier</label>
        <input id="tx-id-input" type="text" placeholder="e.g. tx_settle_101" value={transferId} onChange={(e) => setTransferId(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none', marginTop: '-6px' }} />

        {/* DEBIT GRID SIDE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px' }}>
          <div>
            <label htmlFor="dr-acc" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8' }}>Debit (Dr) Account ID</label>
            <input id="dr-acc" type="text" placeholder="e.g. acc_cash_reserve" value={debitAccount} onChange={(e) => setDebitAmount(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none', width: '90%' }} />
          </div>
          <div>
            <label htmlFor="dr-amt" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8' }}>Dr Amount ($)</label>
            <input id="dr-amt" type="number" placeholder="0" value={debitAmount} onChange={(e) => setDebitAmount(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none', width: '100%' }} />
          </div>
        </div>

        {/* CREDIT GRID SIDE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px' }}>
          <div>
            <label htmlFor="cr-acc" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8' }}>Credit (Cr) Account ID</label>
            <input id="cr-acc" type="text" placeholder="e.g. acc_vault_vault" value={creditAccount} onChange={(e) => setCreditAmount(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none', width: '90%' }} />
          </div>
          <div>
            <label htmlFor="cr-amt" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8' }}>Cr Amount ($)</label>
            <input id="cr-amt" type="number" placeholder="0" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none', width: '100%' }} />
          </div>
        </div>

        {/* Real-time Balancing Matrix Indicator */}
        <div style={{ padding: '12px', backgroundColor: '#0f172a', borderRadius: '8px', border: `1px solid ${isBalanced ? '#047857' : '#b91c1c'}`, fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
          <span>LIQUIDITY STATUS: <span style={{ color: isBalanced ? '#4ade80' : '#f87171' }}>{isBalanced ? '⚖️ MATRICES EQUILIBRIUM' : '❌ ASYMMETRICAL LIQUIDITY DRIFT'}</span></span>
          <span style={{ color: '#94a3b8' }}>Dr: ${drValue} | Cr: ${crValue}</span>
        </div>

        <button 
          onClick={handleExecuteSettlement} 
          style={{ padding: '14px', backgroundColor: isBalanced ? '#38bdf8' : '#475569', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: isBalanced ? 'pointer' : 'not-allowed', marginTop: '5px' }}
          disabled={!isBalanced}
        >
          🔒 Reconcile & Commit Block rows
        </button>
      </div>
    </div>
  );
}
