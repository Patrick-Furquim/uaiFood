import express from 'express';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../swagger.json'), 'utf8'));

app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, { explorer: true })
);

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado no servidor!' });
});

export default app;