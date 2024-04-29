import { NonSsnPatient, Patient } from "../types";
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

function addPatient(newPatientData: Patient) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  newPatientData.id = uuid();
  patientsData.push(newPatientData);
  return newPatientData;
}

export { getAllPatients, getAllPatientsWithoutSsn, addPatient };
