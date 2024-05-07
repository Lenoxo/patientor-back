import express from "express";
import {
  getAllPatientsWithoutSsn,
  addPatient,
  getPatientData,
} from "../services/patientService";
const router = express.Router();
import { checkPatientData } from "../utils";

router.get("/", (_req, res) => {
  const patients = getAllPatientsWithoutSsn();
  res.send(patients);
});

router.get("/:id", (req, res) => {
  try {
    const response = getPatientData(req.params.id);
    res.json(response);
  } catch (error) {
    if (error instanceof Error) {
      res.statusCode = 404;
      res.send(error.message);
    }

    console.error(error);
  }
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
