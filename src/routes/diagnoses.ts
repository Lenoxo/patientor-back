import express from "express";
import { getAllDiagnoses } from "../services/diagnoseService";
const router = express.Router();

router.get("/", (_req, res) => {
  const diagnoses = getAllDiagnoses();
  res.send(diagnoses);
});

export default router;
