import { NewPatient, NonSsnPatient, Patient } from "../types";
import patientsData from "../../data/patients";
import { v4 as uuid } from "uuid";

function getAllPatients(): Patient[] {
  return patientsData;
}

function getAllPatientsWithoutSsn(): NonSsnPatient[] {
  return patientsData.map(({ id, dateOfBirth, name, gender, occupation }) => ({
    id,
    dateOfBirth,
    name,
    gender,
    occupation,
  }));
}

function addPatient(newPatientData: NewPatient): Patient {
  const patientData = {
    id: uuid(),
    ...newPatientData,
  };
  patientsData.push(patientData);
  return patientData;
}

export { getAllPatients, getAllPatientsWithoutSsn, addPatient };
