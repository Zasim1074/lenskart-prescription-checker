export const PRESCRIPTION_LIMITS = {
  sph: { min: -20, max: 20, increment: 0.25 },
  cyl: { min: -6, max: 6, increment: 0.25 },
  axis: { min: 1, max: 180 },
};

const decimalPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
const wholeNumberPattern = /^\d+$/;

function parseDecimal(value) {
  const normalized = value.trim();
  if (!decimalPattern.test(normalized)) return null;

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function validatePower(value, field, limits, errors) {
  const number = parseDecimal(value);

  if (value.trim() === "") {
    errors[field] = `${field.endsWith("Sph") ? "SPH" : "CYL"} is required.`;
  } else if (number === null) {
    errors[field] = "Enter a valid number.";
  } else if (number < limits.min || number > limits.max) {
    errors[field] =
      `Must be between ${limits.min.toFixed(2)} and +${limits.max.toFixed(2)} D.`;
  } else if (
    Math.abs(
      number / limits.increment - Math.round(number / limits.increment),
    ) > 1e-8
  ) {
    errors[field] = `Use increments of ${limits.increment.toFixed(2)} D.`;
  }

  return number;
}

function validateAxis(value, field, required, errors, limits) {
  const normalized = value.trim();
  if (normalized === "") {
    if (required) errors[field] = "Axis is required when CYL is nonzero.";
    return;
  }

  const number = wholeNumberPattern.test(normalized) ? Number(normalized) : NaN;
  if (
    !Number.isSafeInteger(number) ||
    number < limits.min ||
    number > limits.max
  ) {
    errors[field] = `Enter a whole number from ${limits.min} to ${limits.max}.`;
  }
}

export function validatePrescription(values, limits = PRESCRIPTION_LIMITS) {
  const errors = {};

  for (const side of ["left", "right"]) {
    const sphField = `${side}Sph`;
    const cylField = `${side}Cyl`;
    const axisField = `${side}Axis`;
    validatePower(values[sphField], sphField, limits.sph, errors);
    const cyl = validatePower(values[cylField], cylField, limits.cyl, errors);
    validateAxis(
      values[axisField],
      axisField,
      cyl !== null && cyl !== 0,
      errors,
      limits.axis,
    );
  }

  return errors;
}
