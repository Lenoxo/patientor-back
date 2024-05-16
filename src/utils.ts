import { Gender, NewPatient } from "./types";

function isString(text: unknown): text is string {
  return typeof text === "string" || text instanceof String;
}

function isDate(date: string): boolean {
  return Boolean(Date.parse(date));
}

function isGender(gender: string): gender is Gender {
  return Object.values(Gender)
    .map((val) => val.toString())
    .includes(gender);
}

function checkDateOfBirth(date: unknown): string {
  if (!isString(date) || !isDate(date)) {
    throw new Error(`Incorrect or missing date: ${date}`);
  }

  return date;
}

function checkName(name: unknown): string {
  if (!name || !isString(name)) {
    throw new Error(`Incorrect or missing name: ${name}`);
  }
  return name;
}

function checkSsn(ssn: unknown): string {
  if (!ssn || !isString(ssn)) {
    throw new Error(`Incorrect or missing ssn: ${ssn}`);
  }
  return ssn;
}

function checkGender(gender: unknown): Gender {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error(`Incorrect or missing gender: ${gender}`);
  }
  return gender;
}

function checkOccupation(occupation: unknown): string {
  if (!occupation || !isString(occupation)) {
    throw new Error(`Incorrect or missing occupation: ${occupation}`);
  }

  return occupation;
}

function checkPatientData(object: unknown): NewPatient {
  if (!object || typeof object !== "object") {
    throw new Error("Patient data not sent");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    return {
      name: checkName(object.name),
      dateOfBirth: checkDateOfBirth(object.dateOfBirth),
      ssn: checkSsn(object.ssn),
      gender: checkGender(object.gender),
      occupation: checkOccupation(object.occupation),
    };
  }

  throw new Error("Missing patient data fields");
}

export { checkPatientData };
