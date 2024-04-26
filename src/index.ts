import express from "express";
const app = express();
const PORT = 8080;
import diagnosesRouter from "./routes/diagnoses";

app.use(express.json());

// TODO: Crear el endpoint de comunicación /api/diagnoses para retornar todos los diagnosticos por HTTP GET

app.get("/api/ping", (_req, res) => {
  console.log("Something just pinged");
  res.send("pong");
});

app.use("/api/diagnoses", diagnosesRouter);

app.listen(PORT, () => console.log(`Server open in port: ${PORT}`));
