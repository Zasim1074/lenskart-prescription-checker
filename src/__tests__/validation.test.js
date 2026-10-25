import { describe, expect, it } from "vitest";
import { validatePrescription } from "../utils/validation.js";

const validPrescription = {
  leftSph: "-2.25",
  leftCyl: "-1.00",
  leftAxis: "90",
  rightSph: "1.50",
  rightCyl: "0",
  rightAxis: "",
};

describe("validatePrescription", () => {
  it("accepts a valid prescription", () => {
    expect(validatePrescription(validPrescription)).toEqual({});
  });

  it("marks every empty required field", () => {
    expect(
      validatePrescription({
        leftSph: "",
        leftCyl: "",
        leftAxis: "",
        rightSph: "",
        rightCyl: "",
        rightAxis: "",
      }),
    ).toEqual({
      leftSph: "SPH is required.",
      leftCyl: "CYL is required.",
      rightSph: "SPH is required.",
      rightCyl: "CYL is required.",
    });
  });

  it("rejects SPH and CYL outside their configured ranges", () => {
    const errors = validatePrescription({
      ...validPrescription,
      leftSph: "-20.25",
      leftCyl: "6.25",
    });

    expect(errors.leftSph).toMatch(/between/);
    expect(errors.leftCyl).toMatch(/between/);
  });

  it.each(["0", "181", "90.5"])("rejects invalid Axis value %s", (axis) => {
    expect(
      validatePrescription({ ...validPrescription, leftAxis: axis }).leftAxis,
    ).toMatch(/whole number from 1 to 180/);
  });

  it("rejects values outside quarter-diopter increments", () => {
    const errors = validatePrescription({
      ...validPrescription,
      leftSph: "1.10",
      rightCyl: "-2.10",
    });

    expect(errors.leftSph).toMatch(/increments of 0.25/);
    expect(errors.rightCyl).toMatch(/increments of 0.25/);
  });

  it.each(["12abc", "NaN", "Infinity", "-Infinity"])(
    "rejects malformed numeric input %s",
    (input) => {
      expect(
        validatePrescription({ ...validPrescription, leftSph: input }).leftSph,
      ).toBe("Enter a valid number.");
    },
  );

  it("allows a blank Axis for zero CYL but validates an Axis when supplied", () => {
    expect(
      validatePrescription({ ...validPrescription, leftAxis: "0" }).leftAxis,
    ).toMatch(/whole number/);
    expect(
      validatePrescription({
        ...validPrescription,
        leftCyl: "0",
        leftAxis: "",
      }),
    ).toEqual({});
  });

  it("requires Axis when CYL is nonzero", () => {
    expect(
      validatePrescription({ ...validPrescription, leftAxis: "" }).leftAxis,
    ).toMatch(/required/);
  });
});
