import {
  Diagnose,
  Discharge,
  Gender,
  HealthCheckRating,
  NewEntry,
  NewPatient,
  OccupationalHealthcareEntry,
  SickLeave
} from "./types";

type checkedOccupationalData = Pick<OccupationalHealthcareEntry, "employerName" | "sickLeave" | "type">;

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
  // I had to skip the check of !rating, because js as a weakly typed languange, parses the 0 in !rating as true in this if statement
  if (!isNumber(rating) || !isHealthCheckRating(rating)) {
    throw new Error(`Incorrect healthCheckRating value: ${rating}`);
  }
  return rating;
}

function checkString(string: unknown, errorMessage: string): string {
  if (!string || !isString(string)) {
    throw new Error(`${errorMessage}: ${string}`);
  }
  return string;
}

function checkGender(gender: unknown): Gender {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error(`Incorrect or missing gender: ${gender}`);
  }
  return gender;
}

function checkSickLeave({ startDate, endDate }: { startDate: unknown; endDate: unknown }): SickLeave {
  if (!startDate || !isString(startDate) || !isDate(startDate)) {
    throw new Error(`Incorrect or missing startDate in sickLeave: ${startDate}`);
  }

  if (!endDate || !isString(endDate) || !isDate(endDate)) {
    throw new Error(`Incorrect or missing endDate in sickLeave: ${endDate}`);
  }

  return { startDate, endDate };
}

function checkOccupationalHealthcareData({
  employerName,
  sickLeave
}: {
  employerName: unknown;
  sickLeave?: SickLeave;
}): checkedOccupationalData {
  if (!isString(employerName)) {
    throw new Error(`Incorrect employerName: ${employerName}`);
  }

  const checkedData: checkedOccupationalData = {
    employerName: checkString(employerName, "Incorrect or missing employerName"),
    type: "OccupationalHealthcare"
  };

  if (sickLeave) {
    checkedData.sickLeave = checkSickLeave(sickLeave);
  }

  return checkedData;
}

function checkDischarge(discharge: unknown): Discharge {
  if (!discharge || typeof discharge !== "object" || !("date" in discharge) || !("criteria" in discharge)) {
    throw new Error(`Incorrect or missing discharge: ${discharge}`);
  }

  return {
    date: checkDate(discharge.date),
    criteria: checkString(discharge.criteria, "Incorrect or missing criteria in discharge")
  };
}

// Main data checks

function checkPatientData(object: unknown): NewPatient {
  if (!object || typeof object !== "object") {
    throw new Error("Patient data not sent");
  }

  if ("name" in object && "dateOfBirth" in object && "ssn" in object && "gender" in object && "occupation" in object) {
    return {
      name: checkString(object.name, "Incorrect or missing name"),
      dateOfBirth: checkDate(object.dateOfBirth),
      ssn: checkString(object.ssn, "Incorrect or missing ssn"),
      gender: checkGender(object.gender),
      occupation: checkString(object.occupation, "Incorrect or missing occupation")
    };
  }

  throw new Error("Missing patient data fields");
}

function checkAdditionalEntryData(object: NewEntry) {
  if (!object || typeof object !== "object" || !("type" in object)) {
    throw new Error("Field type missing in entry data");
  }

  switch (object.type) {
    case "Hospital":
      if (!("discharge" in object)) {
        throw new Error("Field discharge missing in entry data");
      }
      return {
        type: "Hospital",
        discharge: checkDischarge(object.discharge)
      };
    case "OccupationalHealthcare":
      if (!("employerName" in object)) {
        throw new Error("Field employerName missing in entry data");
      }
      return checkOccupationalHealthcareData(object);

    case "HealthCheck":
      if (!("healthCheckRating" in object)) {
        throw new Error("Field healthCheckRating missing in entry data");
      }

      return {
        type: "HealthCheck",
        healthCheckRating: checkHealthRating(object.healthCheckRating)
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

  if ("description" in object && "date" in object && "specialist" in object && "diagnosisCodes" in object) {
    parsedEntryData = {
      description: checkString(object.description, "Incorrect or missing description"),
      date: checkDate(object.date),
      specialist: checkString(object.specialist, "Incorrect or missing specialist"),
      diagnosisCodes: parseDiagnosisCodes(object)
    };
  }

  if ("type" in object) {
    const additionalEntryData = checkAdditionalEntryData(object as NewEntry);
    parsedEntryData = {
      ...parsedEntryData,
      ...additionalEntryData
    } as NewEntry;
    return parsedEntryData;
  }

  throw new Error("Missing BaseEntry data fields");
}

export { checkPatientData, checkEntryData };
