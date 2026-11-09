import Loki from 'lokijs';

const db = new Loki('vanguardBankingVault.db', {
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 4000
});

let ledgerCollection;

function databaseInitialize() {
  ledgerCollection = db.getCollection('ledger_stream') || db.addCollection('ledger_stream');
}

/**
 * Clean-slate switch used exclusively by our automated test suites
 */
export function initDatabase() {
  if (!ledgerCollection) databaseInitialize();
  ledgerCollection.clear();
}

/**
 * Commits a validated, perfectly balanced transaction block permanently to the audit ledger stream.
 * @param {Object} block - The balanced debit/credit dataset profile
 */
export function writeLedgerEntry(block) {
  if (!ledgerCollection) databaseInitialize();
  
  ledgerCollection.insert({
    transferId: block.transferId,
    entries: block.entries,
    auditSignature: block.auditSignature,
    committedAt: new Date().toISOString()
  });

  db.saveDatabase(); // Instantly write the banking blocks onto permanent storage disk!
}

databaseInitialize();
