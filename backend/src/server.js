const app = require('./app');
const { port } = require('./config/env');

app.listen(port, '0.0.0.0', () => {
  console.log(`BenefitFlow AI backend listening on http://0.0.0.0:${port}`);
});
