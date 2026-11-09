import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import React from 'react';
import App from './App';

// Mock the global network fetch engine so it responds instantly with isolated mock data payloads
global.fetch = vi.fn((url, options) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ 
      message: 'Financial block transfer reconciled and safely committed to the immutable audit trail!',
      status: 'RECONCILED_AND_COMMITTED',
      transferId: 'tx_mock123_pass',
      auditSignature: '8f411b5a4156_mock_hash_tag_signature_hex_stream'
    })
  });
});

test('Double-Entry UI Ingestion: Executing a balanced settlement should render a success alert banner and audit trail card', async () => {
  render(<App />);

  // Fill out financial forms fields precisely by targeting their input labels
  fireEvent.change(screen.getByPlaceholderText(/e.g. tx_settle_101/i), { target: { value: 'tx_mock123_pass' } });
  fireEvent.change(screen.getByLabelText(/Dr Amount \(\$\)/i), { target: { value: '5000' } });
  fireEvent.change(screen.getByLabelText(/Cr Amount \(\$\)/i), { target: { value: '5000' } });

  // Click the execute settlement action button trigger
  fireEvent.click(screen.getByText(/Reconcile & Commit Block rows/i));

  // 🌟 FIX: Hunt for our crisp corporate 'CORE_LOG' prefix text banner!
  const successBanner = await screen.findByText(/CORE_LOG:/i);
  expect(successBanner).toBeInTheDocument();
  
  // Verify the cryptographic audit rail displays the signature
  expect(screen.getByText(/tx_mock123_pass/i)).toBeInTheDocument();
  expect(screen.getByText(/8f411b5a4156_mock_hash_tag_signature_hex_stream/i)).toBeInTheDocument();
});
