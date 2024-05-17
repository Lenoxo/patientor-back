import { BaseEntry, Diagnose, Gender, NewPatient } from "./types";

// function assertNever(value: never): never {
//   throw new Error(`This type is not expected in entries: ${value}`)
// }

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

function checkDate(date: unknown): string {
  if (!isString(date) || !isDate(date)) {
    throw new Error(`Incorrect or missing date: ${date}`);
  }

  return date;
}

const parseDiagnosisCodes = (object: unknown): Array<Diagnose['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnose['code']>;
  }

  return object.diagnosisCodes as Array<Diagnose['code']>;
};

function checkName(name: unknown): string {
  if (!name || !isString(name)) {
    throw new Error(`Incorrect or missing name: ${name}`);
  }
  return name;
}

function checkDescription(description: unknown): string {
  if (!description || !isString(description)) {
    throw new Error(`Incorrect or missing description: ${description}`);
  }
  return description;
}

function checkSpecialist(specialist: unknown): string {
  if (!specialist || !isString(specialist)) {
    throw new Error(`Incorrect or missing specialist: ${specialist}`);
  }
  return specialist;
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
      dateOfBirth: checkDate(object.dateOfBirth),
      ssn: checkSsn(object.ssn),
      gender: checkGender(object.gender),
      occupation: checkOccupation(object.occupation),
    };
  }

  throw new Error("Missing patient data fields");
}

type BaseEntryWithoutId = Omit<BaseEntry, "id">

function checkEntryData(object: unknown): BaseEntryWithoutId {
  if (!object || typeof object !== "object") {
    throw new Error("Patient data not sent");
  }

  if ("description" in object && "date" in object && "specialist" in object && "diagnosisCodes" in object) {
    return {
      description: checkDescription(object.description),
      date: checkDate(object.date),
      specialist: checkSpecialist(object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object),
    }
  }

  throw new Error("Missing BaseEntry data fields");
}

export { checkPatientData, checkEntryData };
