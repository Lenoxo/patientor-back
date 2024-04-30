/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from "express";
import {
  getAllPatientsWithoutSsn,
  addPatient,
} from "../services/patientService";
const router = express.Router();
import { checkPatientData } from "../utils";

// TODO: 6. Corregir error de tipo en data/patients.ts

router.get("/", (_req, res) => {
  const patients = getAllPatientsWithoutSsn();
  res.send(patients);
});

router.post("/", (req, res) => {
  try {
    const parsedPatientData = checkPatientData(req.body);
    const result = addPatient(parsedPatientData);
    res.send(result);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      res.statusCode = 400;
      res.send(error.message);
    }
  }
});
export default router;
