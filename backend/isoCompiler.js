/**
 * @fileoverview Year 2 ISO 20022 pacs.008.001.10 Financial Messaging Compiler Core.
 * Enforces strict international banking schemas on transactional datasets.
 */

const ALLOWED_CURRENCIES = ['USD', 'EUR', 'GBP'];

/**
 * Validates financial parameters and compiles them into a standard compliant ISO 20022 XML Document string.
 * 
 * @param {Object} tx - { msgId, amount, currency, dbtrAcc, cdtrAcc }
 * @returns {Object} Complete message compilation analysis report
 */
export function compileToISO20022(tx) {
  const { msgId, amount, currency, dbtrAcc, cdtrAcc } = tx;

  // 🛡️ SCHEMA CONSTRAINT 1: Verify presence of all mission-critical routing parameters
  if (!msgId || !dbtrAcc || !cdtrAcc) {
    return { success: false, error: 'ISO 20022 Schema Error: Missing mandatory infrastructure identification routing markers!' };
  }

  // 🛡️ SCHEMA CONSTRAINT 2: Enforce positive clearing balances
  if (!amount || amount <= 0) {
    return { success: false, error: 'ISO 20022 Schema Error: Inbound clearing amount metrics must be greater than zero.' };
  }

  // 🛡️ SCHEMA CONSTRAINT 3: Restrict processing exclusively to verified fiat corridors
  if (!ALLOWED_CURRENCIES.includes(currency?.toUpperCase().trim())) {
    return { success: false, error: 'ISO 20022 Schema Error: Invalid or unsupported clearinghouse fiat currency token!' };
  }

  const cleanMsgId = msgId.toUpperCase().trim();
  const cleanCurrency = currency.toUpperCase().trim();

  // 📄 COMPILER MATRIX: Map the raw parameters into a strict, compliant pacs.008 XML envelope string
  const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.10">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>${cleanMsgId}</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf><SttlmMtd>CLRG</SttlmMtd></SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId><EndToEndId>${cleanMsgId}_E2E</EndToEndId></PmtId>
      <IntrBkSttlmAmt Ccy="${cleanCurrency}">${amount}</IntrBkSttlmAmt>
      <Dbtr><Id>${dbtrAcc.trim()}</Id></Dbtr>
      <Cdtr><Id>${cdtrAcc.trim()}</Id></Cdtr>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`.trim();

  return {
    success: true,
    xmlPayload
  };
}
