import { expect, test, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from './server.js'; // We will build this server next!
import { initDatabase } from './database.js'; // We will build this database next!

beforeEach(() => {
  // Wipe our banking tables completely clean before every single run to ensure isolated state tracking
  initDatabase();
});

test('Sovereign Balance Challenge: Perfectly balanced double-entry accounting records must pass checks cleanly', async () => {
  // 1. Arrange: Mock a standard balanced B2B transfer payload ($10,000 corporate settlement)
  const balancedTransferPayload = {
    transferId: 'tx_settle_001a',
    debits: [{ accountId: 'acc_corporate_ingestion', amount: 10000 }],
    credits: [{ accountId: 'acc_liquidity_reserve', amount: 10000 }] // Perfectly Balanced!
  };

  // 2. Act: Dispatch the financial block transfer to our API ingestion core slot
  const response = await request(app)
    .post('/api/ledger/settle')
    .send(balancedTransferPayload);

  // 3. Assert: The banking guard dog verifies the ledger successfully reconciles the rows
  expect(response.status).toBe(201);
  expect(response.body.status).toBe('RECONCILED_AND_COMMITTED');
  expect(response.body.auditSignature).toBeDefined();
});

test('Liquidity Defense: Asymmetrical transaction data entries must be flatly rejected and blocked', async () => {
  // 1. Arrange: Input an unbalanced fraudulent ledger entry block (Missing money outlier anomaly!)
  const unbalancedTransferPayload = {
    transferId: 'tx_fraud_002b',
    debits: [{ accountId: 'acc_corporate_ingestion', amount: 5000 }],
    credits: [{ accountId: 'acc_liquidity_reserve', amount: 4950 }] // 🚨 MISMATCH! Missing $50!
  };

  // 2. Act: Pass the transaction through our compliance validator matrix gate
  const response = await request(app)
    .post('/api/ledger/settle')
    .send(unbalancedTransferPayload);

  // 3. Assert: The accountant engine checks the mathematical parameters, locks the lane, and throws a 422 error!
  expect(response.status).toBe(422);
  expect(response.body.error).toBe('Sovereign Accounting Ledger Error: Mathematical asymmetry detected! Total Debits must perfectly equal Total Credits.');
});

test('ISO 20022 Integration Gate Check: End-to-end lookup and translation to compliant XML message envelopes', async () => {
  // 1. Arrange: Assemble a valid transmission body matching global SEPA rules criteria
  const isoPayload = {
    transferId: 'tx_iso_999',
    amount: 50000,
    currency: 'EUR',
    dbtrAcc: 'ACC_SENDER_BOE',
    cdtrAcc: 'ACC_RECEIVER_FED'
  };

  // 2. Act: Trigger our brand new ISO 20022 translation compiler gateway endpoint
  const response = await request(app)
    .post('/api/ledger/compile-iso')
    .send(isoPayload);

  // 3. Assert: Verify the gate returns a pristine 200 OK status and standard XML tags!
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Banking transaction successfully compiled into standard ISO 20022 pacs.008 format!');
  expect(response.body.isoXmlOutput).toContain('<MsgId>MSG_TX_ISO_999</MsgId>');
  expect(response.body.isoXmlOutput).toContain('<IntrBkSttlmAmt Ccy="EUR">50000</IntrBkSttlmAmt>');
});
