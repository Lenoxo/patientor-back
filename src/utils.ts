import {
  Diagnose,
  Discharge,
  Gender,
  HealthCheckRating,
  NewEntry,
  NewPatient,
  SickLeave,
} from "./types";

function assertNever(value: never): never {
  throw new Error(`This type is not expected in entries: ${value}`);
}

// Simple type predicates

function isString(text: unknown): text is string {
  return typeof text === "string" || text instanceof String;
}

function isNumber(num: unknown): num is number {
  return typeof num === "number";
}

function isDate(date: string): boolean {
  return Boolean(Date.parse(date));
}

function isGender(gender: string): gender is Gender {
  return Object.values(Gender)
    .map((val) => val.toString())
    .includes(gender);
}

function isHealthCheckRating(rating: number): rating is HealthCheckRating {
  return Object.values(HealthCheckRating)
    .map((val) => val) // Here the val is a number according to the HealthCheckRating type values
    .includes(rating);
}

// Individual checks

function checkDate(date: unknown): string {
  if (!isString(date) || !isDate(date)) {
    throw new Error(`Incorrect or missing date: ${date}`);
  }
  return date;
}

const parseDiagnosisCodes = (object: unknown): Array<Diagnose["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnose["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnose["code"]>;
};

function checkHealthRating(rating: unknown): HealthCheckRating {
  if (!rating || !isNumber(rating) || !isHealthCheckRating(rating)) {
    throw new Error(`Incorrect healthCheckRating value: ${rating}`);
  }
  return rating;
}

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

function checkSickLeave({
  startDate,
  endDate,
}: {
  startDate: unknown;
  endDate: unknown;
}): SickLeave {
  if (!startDate || !isString(startDate) || !isDate(startDate)) {
    throw new Error(
      `Incorrect or missing startDate in sickLeave: ${startDate}`,
    );
  }

  if (!endDate || !isString(endDate) || !isDate(endDate)) {
    throw new Error(`Incorrect or missing endDate in sickLeave: ${endDate}`);
  }

  return { startDate, endDate };
}

function checkOccupationalHealthcareData({
  employerName,
  sickLeave,
}: {
  employerName: unknown;
  sickLeave?: SickLeave;
}) {
  if (!isString(employerName)) {
    throw new Error(`Incorrect employerName: ${employerName}`);
  }

  // TODO: Find a better way to handle this without using the any type
  let checkedData: any = {};

  checkedData.employerName = checkName(employerName);

  if (sickLeave) {
    checkedData.sickLeave = checkSickLeave(sickLeave);
  }

  return checkedData;
}

function checkDischarge(discharge: unknown): Discharge {
  if (
    !discharge ||
    typeof discharge !== "object" ||
    !("date" in discharge) ||
    !("criteria" in discharge)
  ) {
    throw new Error(`Incorrect or missing discharge: ${discharge}`);
  }

  return {
    date: checkDate(discharge.date),
    criteria: checkDescription(discharge.criteria),
  };
}

// Main data checks

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

function checkAdditionalEntryData(object: unknown) {
  if (!object || typeof object !== "object" || !("type" in object)) {
    throw new Error("Field type missing in entry data");
  }

  switch (object.type) {
    case "Hospital":
      if (!("discharge" in object)) {
        throw new Error("Field discharge missing in entry data");
      }
      return {
        discharge: checkDischarge(object.discharge),
      };
    case "OccupationalHealthcare":
      if (!("employerName" in object)) {
        throw new Error("Field employerName missing in entry data");
      }

      // I let here this variable because in the return of checkOccupationalHealthcareData there are several keys for the object.

      const occupationalHealthcareData =
        checkOccupationalHealthcareData(object);
      return occupationalHealthcareData;
    case "HealthCheck":
      if (!("healthCheckRating" in object)) {
        throw new Error("Field healthCheckRating missing in entry data");
      }

      return {
        healthCheckRating: checkHealthRating(object.healthCheckRating),
      };

    default:
      assertNever(object);
  }
}

function checkEntryData(object: unknown): NewEntry {
  if (!object || typeof object !== "object") {
    throw new Error("Patient data not sent");
  }

  let parsedEntryData;

  if (
    "description" in object &&
    "date" in object &&
    "specialist" in object &&
    "diagnosisCodes" in object
  ) {
    parsedEntryData = {
      description: checkDescription(object.description),
      date: checkDate(object.date),
      specialist: checkSpecialist(object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object),
    };
  }

  if ("type" in object) {
    // TODO: Fix the error caused by handling this object with the type unknown
    const additionalEntryData = checkAdditionalEntryData(object);
    parsedEntryData = {
      ...parsedEntryData,
      ...additionalEntryData,
    } as NewEntry;
    return parsedEntryData;
  }

  throw new Error("Missing BaseEntry data fields");
}

export { checkPatientData, checkEntryData };
