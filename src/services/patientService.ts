import patientsData from "../../data/patients";
import { NonSsnPatient, Patient } from "../types";

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

export { getAllPatients, getAllPatientsWithoutSsn };
