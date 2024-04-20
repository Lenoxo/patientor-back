import express from "express";
const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/api/ping', (_req, res) => {
  console.log('Something just pinged');
  res.send('pong');
});

app.listen(PORT, () => console.log(`Server open in port: ${PORT}`));
