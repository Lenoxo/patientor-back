/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from "express";
import {
  getAllPatientsWithoutSsn,
  addPatient,
} from "../services/patientService";
const router = express.Router();

// TODO: 1. Establecer endpoint de POST para /api/patients para agregar pacientes (Sin validaciones)
//  - Añadir la ruta en routes/patients.ts
//  - Añadir el metodo de addPatient en patientService
//    - Guardar en el array de patients el nuevo paciente
// TODO: 2. Introducir parsing seguro
// TODO: 3. Introducir validacion de datos
//  - Con captura de errores
// TODO: 4. Verificar que funcione desde el frontend
// TODO: 5. Cambiar el tipo de `gender` a enum

router.get("/", (_req, res) => {
  const patients = getAllPatientsWithoutSsn();
  res.send(patients);
});

router.post("/", (req, res) => {
  const patientData = req.body;
  const result = addPatient(patientData);
  res.send(result);
});
export default router;
