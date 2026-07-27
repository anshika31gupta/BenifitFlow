const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { corsOrigin, nodeEnv } = require('./config/env');
const { notFoundHandler, errorMiddleware } = require('./middlewares/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const cardRoutes = require('./routes/cardRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const benefitRoutes = require('./routes/benefitRoutes');
const claimRoutes = require('./routes/claimRoutes');
const ruleRoutes = require('./routes/ruleRoutes');
const insightRoutes = require('./routes/insightRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((item) => item.trim()).filter(Boolean),
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/', (_req, res) => {
  res.json({ status: 'running', service: 'BenefitFlow Backend' });
});

app.get('/health', (_req, res) => {
  res.json({ success: true });
});

app.get('/api/health', (_req, res) => {
  res.json({ success: true });
});

// Auth
app.use('/api/auth', authRoutes);

// Core resources
app.use('/api/cards', cardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/benefits', benefitRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/history', claimRoutes); // History view reuses claims (claim lifecycle IS the history)
app.use('/api/uploads', uploadRoutes);

// AI (kept at the same path the existing frontend already calls)
app.use('/api/gemini', aiRoutes);

app.use(notFoundHandler);
app.use(errorMiddleware);

module.exports = app;
