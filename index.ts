import express from "express";
const app = express();
app.use(express.json());
const PORT = 8080;

app.get('/api/ping', (_req, res) => {
  console.log('Something just pinged');
  res.send('pong');
});

app.listen(PORT, () => console.log(`Server open in port: ${PORT}`));
