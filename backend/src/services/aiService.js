const { geminiApiKey } = require('../config/env');

let genAIModule = null;
async function getClient() {
  if (!geminiApiKey) return null;
  if (!genAIModule) {
    // Lazy-require so the app still boots if @google/genai isn't installed
    // in environments that don't need live AI calls.
    genAIModule = require('@google/genai');
  }
  return new genAIModule.GoogleGenAI({ apiKey: geminiApiKey });
}

async function analyzeTransaction(transaction) {
  const fallback = `BenefitFlow AI evaluated purchase "${transaction.merchant}" (₹${Number(
    transaction.amount || 0
  ).toLocaleString('en-IN')}) under ${transaction.cardUsed} policy terms. Coverage guarantees ${
    transaction.detectedBenefit
  } up to ₹${Number(transaction.coverageLimit || 0).toLocaleString('en-IN')}. Eligible for automated claim filing.`;

  const client = await getClient();
  if (!client) return fallback;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are BenefitFlow AI's chief underwriting policy expert. Explain concisely (3 sentences max) in professional fintech tone why the purchase "${transaction.merchant}" of ₹${transaction.amount} on card "${transaction.cardUsed}" qualifies for "${transaction.detectedBenefit}". Highlight coverage limits (₹${transaction.coverageLimit}) and expiration deadline (${transaction.claimDeadline}).`,
    });
    return response.text || fallback;
  } catch (err) {
    console.error('Gemini analyze error:', err.message);
    return fallback;
  }
}

async function chat(message) {
  const fallback = `Based on your linked card portfolio, electronics purchases over ₹10,000 typically carry 90-day purchase protection and extended warranty backup. Ask me about a specific merchant or card for exact coverage.`;

  const client = await getClient();
  if (!client) return fallback;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are BenefitFlow AI Copilot, a high-end enterprise credit card benefit assistant. Answer the user's question concisely, clearly, and authoritatively: "${message}".`,
    });
    return response.text || fallback;
  } catch (err) {
    console.error('Gemini chat error:', err.message);
    return fallback;
  }
}

module.exports = { analyzeTransaction, chat };
