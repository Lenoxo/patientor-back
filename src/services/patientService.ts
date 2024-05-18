import { NewEntry, NewPatient, NonSsnPatient, Patient } from "../types";
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
    occupation
  }));
}

function getPatientData(id: string): Patient {
  const patientData = patientsData.find((patient) => patient.id === id);

  if (!patientData) {
    throw new Error("Patient not found");
  }

  return patientData;
}

function addPatient(newPatientData: NewPatient): Patient {
  const patientData = {
    id: uuid(),
    ...newPatientData
  };
  patientsData.push(patientData);
  return patientData;
}

function addEntry(id: Patient["id"], newEntryData: NewEntry): Patient {
  const patientData = getPatientData(id);
  patientData.entries?.push({
    id: uuid(),
    ...newEntryData
  });
  return patientData;
}

export { getAllPatients, getAllPatientsWithoutSsn, addPatient, getPatientData, addEntry };
