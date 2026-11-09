// ========================================================
// 📦 STEP 1: BRING IN ALL OUR TOOLS (IMPORTS)
// ========================================================
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto'; 
import { writeLedgerEntry } from './database.js';
import { compileToISO20022 } from './isoCompiler.js'; // 🌟 NEW: Bring in our Year 2 ISO Compiler module!

// ========================================================
// 🏰 STEP 2: BUILD THE CASTLE & SET UP THE FORCEFIELDS
// ========================================================
export const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hook up our full-stack production asset folder bridge doorway
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ========================================================
// 🪙 STEP 3: CREATE THE SLOTS (ROUTES)
// ========================================================

// Slot 1: Sovereign Double-Entry Ingestion Settlement Route
app.post('/api/ledger/settle', (req, res) => {
  const { transferId, debits, credits } = req.body;

  if (!transferId || !debits || !credits) {
    return res.status(400).json({ error: 'Malformed banking settlement data payload entries rejected.' });
  }

  const totalDebits = debits.reduce((sum, item) => sum + item.amount, 0);
  const totalCredits = credits.reduce((sum, item) => sum + item.amount, 0);

  if (totalDebits !== totalCredits) {
    return res.status(422).json({
      error: 'Sovereign Accounting Ledger Error: Mathematical asymmetry detected! Total Debits must perfectly equal Total Credits.'
    });
  }

  const blockDataString = JSON.stringify({ transferId, totalDebits, totalCredits });
  const secureSignature = crypto.createHmac('sha256', 'master-bank-signing-secret')
    .update(blockDataString)
    .digest('hex');

  const unifiedEntries = [
    ...debits.map(d => ({ accountId: d.accountId, type: 'DEBIT', amount: d.amount })),
    ...credits.map(c => ({ accountId: c.accountId, type: 'CREDIT', amount: c.amount }))
  ];

  writeLedgerEntry({
    transferId,
    entries: unifiedEntries,
    auditSignature: secureSignature
  });

  res.status(201).json({
    message: 'Financial block transfer reconciled and safely committed to the immutable audit trail!',
    status: 'RECONCILED_AND_COMMITTED',
    transferId,
    auditSignature: secureSignature,
    // Pass raw base fields out to help the frontend capture compiler context variables smoothly
    amount: totalDebits,
    dbtrAcc: debits[0].accountId,
    cdtrAcc: credits[0].accountId
  });
});

// 📄 Slot 2: NEW! Year 2 ISO 20022 Financial Messaging Compiler Gateway
app.post('/api/ledger/compile-iso', (req, res) => {
  const { transferId, amount, currency, dbtrAcc, cdtrAcc } = req.body;

  if (!transferId || !amount || !currency || !dbtrAcc || !cdtrAcc) {
    return res.status(400).json({ error: 'Missing mandatory fields required to construct ISO 20022 financial envelope!' });
  }

  // Pass variables straight into our rule-enforced international standard parser matrix
  const compilationResult = compileToISO20022({
    msgId: `MSG_${transferId.toUpperCase()}`,
    amount,
    currency,
    dbtrAcc,
    cdtrAcc
  });

  if (!compilationResult.success) {
    return res.status(422).json({ error: compilationResult.error });
  }

  res.status(200).json({
    message: 'Banking transaction successfully compiled into standard ISO 20022 pacs.008 format!',
    isoXmlOutput: compilationResult.xmlPayload
  });
});

// ========================================================
// ⚡ STEP 4: START THE APPLIANCE CORE ENGINE (LISTEN)
// ========================================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log('=========================================');
  console.log(`🏛️ VANGUARD CORE BANKING INTERFACE LIVE ON PORT ${PORT}!`);
  console.log(`👉 Visit http://localhost:${PORT}/ in your browser`);
  console.log('=========================================');
});
