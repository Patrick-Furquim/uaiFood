import express from 'express';
import routes from './routes/index.js';

const app = express();

app.use(express.json());
app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

export default app;