import express from "express";
import { getAllPatientsWithoutSsn } from "../services/patientService";
const router = express.Router();

router.get("/", (_req, res) => {
  const patients = getAllPatientsWithoutSsn();
  res.send(patients);
});

export default router;
