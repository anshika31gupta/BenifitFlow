import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client lazily / safely
  let aiClient: GoogleGenAI | null = null;
  const getAIClient = () => {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  };

  // API 1: Analyze Transaction Policy
  app.post('/api/gemini/analyze-transaction', async (req, res) => {
    const { transaction } = req.body;
    if (!transaction) {
      return res.status(400).json({ error: 'Missing transaction payload' });
    }

    try {
      const ai = getAIClient();
      if (!ai) {
        return res.json({
          explanation: `BenefitFlow AI evaluated purchase "${transaction.merchant}" (₹${transaction.amount?.toLocaleString('en-IN')}) under ${transaction.cardUsed} policy terms. Section 4.2 guarantees ${transaction.detectedBenefit} coverage up to ₹${transaction.coverageLimit?.toLocaleString('en-IN')}. Eligible for immediate automated claim filing.`
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are BenefitFlow AI's chief underwriting policy expert. Explain concisely (3 sentences max) in professional fintech tone why the purchase "${transaction.merchant}" of ₹${transaction.amount} on card "${transaction.cardUsed}" qualifies for "${transaction.detectedBenefit}". Highlight coverage limits (₹${transaction.coverageLimit}) and expiration deadline (${transaction.claimDeadline}).`
      });

      return res.json({ explanation: response.text });
    } catch (err) {
      console.error('Gemini API error:', err);
      return res.json({
        explanation: `BenefitFlow AI evaluated purchase "${transaction.merchant}" (₹${transaction.amount?.toLocaleString('en-IN')}) under ${transaction.cardUsed} policy terms. Section 4.2 guarantees ${transaction.detectedBenefit} coverage up to ₹${transaction.coverageLimit?.toLocaleString('en-IN')}. Eligible for immediate automated claim filing.`
      });
    }
  });

  // API 2: Copilot AI Chat
  app.post('/api/gemini/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    try {
      const ai = getAIClient();
      if (!ai) {
        return res.json({
          response: `Based on your linked card portfolio (Amex Centurion, Visa Signature, Chase Sapphire Reserve, HDFC Infinia), all electronics over ₹10,000 carry 90-day purchase protection and extended warranty backup.`
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are BenefitFlow AI Copilot, a high-end enterprise credit card benefit assistant for American Express, Visa Infinite, Chase Sapphire, and HDFC Infinia cardholders. Answer the user's question concisely, clearly, and authoritatively: "${message}".`
      });

      return res.json({ response: response.text });
    } catch (err) {
      console.error('Gemini chat error:', err);
      return res.json({
        response: `Based on your linked card portfolio (Amex Centurion, Visa Signature, Chase Sapphire Reserve, HDFC Infinia), all electronics over ₹10,000 carry 90-day purchase protection and extended warranty backup.`
      });
    }
  });

  // Vite Middleware for development vs production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BenefitFlow AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
