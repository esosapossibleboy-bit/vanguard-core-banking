import { expect, test } from 'vitest';
import { compileToISO20022 } from './isoCompiler.js'; // We will build this module next!

test('ISO 20022 Compiler: Valid banking parameters must successfully parse into standard XML envelopes', () => {
  // 1. Arrange: Input standard valid transaction parameters
  const validTransfer = {
    msgId: 'MSG_VANGUARD_777',
    amount: 25000,
    currency: 'USD',
    dbtrAcc: 'ACC_SENDER_123',
    cdtrAcc: 'ACC_RECEIVER_456'
  };

  // 2. Act: Pass it through our automated XML compilation matrix module
  const result = compileToISO20022(validTransfer);

  // 3. Assert: Verify the engine outputs the precise structural tags the banking clearinghouse expects
  expect(result.success).toBe(true);
  expect(result.xmlPayload).toContain('<MsgId>MSG_VANGUARD_777</MsgId>');
  expect(result.xmlPayload).toContain('<IntrBkSttlmAmt Ccy="USD">25000</IntrBkSttlmAmt>');
  expect(result.xmlPayload).toContain('<Id>ACC_SENDER_123</Id>');
});

test('ISO Compliance Check: Unsupported three-character currency tokens must block messaging compilation', () => {
  // 1. Arrange: Input an invalid currency parameters payload (Crypto token instead of fiat!)
  const invalidTransfer = {
    msgId: 'MSG_FRAUD_888',
    amount: 500,
    currency: 'BTC', // 🚨 INVALID! Banking schema only permits standard FIAT currencies (USD, EUR, GBP)
    dbtrAcc: 'ACC_SENDER_123',
    cdtrAcc: 'ACC_RECEIVER_456'
  };

  // 2. Act: Pass it into our compiler engine
  const result = compileToISO20022(invalidTransfer);

  // 3. Assert: The compiler catches the illegal parameter and halts execution cleanly
  expect(result.success).toBe(false);
  expect(result.error).toBe('ISO 20022 Schema Error: Invalid or unsupported clearinghouse fiat currency token!');
});
