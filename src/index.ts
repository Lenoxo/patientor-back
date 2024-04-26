import express from "express";
const app = express();
const PORT = 8080;
import diagnosesRouter from "./routes/diagnoses";
import patientsRouter from "./routes/patients";
import cors from "cors";

app.use(cors());
app.use(express.json());

app.get("/api/ping", (_req, res) => {
  console.log("Something just pinged");
  res.send("pong");
});

app.use("/api/diagnoses", diagnosesRouter);
app.use("/api/patients", patientsRouter);

app.listen(PORT, () => console.log(`Server open in port: ${PORT}`));
