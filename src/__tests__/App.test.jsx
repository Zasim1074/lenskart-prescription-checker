import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App.jsx";

afterEach(cleanup);

function eye(name) {
  return within(screen.getByRole("group", { name }));
}

function enterValidPrescription() {
  fireEvent.change(eye("Left Eye").getByLabelText("SPH (D)"), {
    target: { value: "-2.25" },
  });
  fireEvent.change(eye("Left Eye").getByLabelText("CYL (D)"), {
    target: { value: "-1.00" },
  });
  fireEvent.change(eye("Left Eye").getByLabelText("Axis (°)"), {
    target: { value: "90" },
  });
  fireEvent.change(eye("Right Eye").getByLabelText("SPH (D)"), {
    target: { value: "1.50" },
  });
  fireEvent.change(eye("Right Eye").getByLabelText("CYL (D)"), {
    target: { value: "0" },
  });
}

describe("LensCheck form", () => {
  it("shows field errors and validates successfully after values are corrected", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Validate" }));
    expect(screen.getAllByText(/is required/)).toHaveLength(4);
    expect(eye("Left Eye").getByLabelText("SPH (D)")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    enterValidPrescription();
    fireEvent.click(screen.getByRole("button", { name: "Validate" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Prescription values are valid.",
    );
    expect(screen.queryByText(/is required/)).not.toBeInTheDocument();
  });

  it("resets entered values and validation errors", () => {
    render(<App />);
    fireEvent.change(eye("Left Eye").getByLabelText("SPH (D)"), {
      target: { value: "12abc" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Validate" }));
    expect(screen.getByText("Enter a valid number.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(eye("Left Eye").getByLabelText("SPH (D)")).toHaveValue("");
    expect(screen.queryByText("Enter a valid number.")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
