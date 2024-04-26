import diagnosesData from "../../data/diagnoses";
import { Diagnose } from "../types";

function getAllDiagnoses(): Diagnose[] {
  return diagnosesData;
}

export { getAllDiagnoses };
