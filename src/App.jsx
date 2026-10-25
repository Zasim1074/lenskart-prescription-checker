import { useState } from 'react'
import PrescriptionField from './components/PrescriptionField.jsx'
import { validatePrescription } from './utils/validation.js'
import './App.css'

const initialValues = {
  leftSph: '',
  leftCyl: '',
  leftAxis: '',
  rightSph: '',
  rightCyl: '',
  rightAxis: '',
}

const eyeFields = [
  {
    name: 'Left Eye',
    fields: [
      { key: 'leftSph', label: 'SPH', unit: 'D', inputMode: 'decimal' },
      { key: 'leftCyl', label: 'CYL', unit: 'D', inputMode: 'decimal' },
      { key: 'leftAxis', label: 'Axis', unit: '°', inputMode: 'numeric' },
    ],
  },
  {
    name: 'Right Eye',
    fields: [
      { key: 'rightSph', label: 'SPH', unit: 'D', inputMode: 'decimal' },
      { key: 'rightCyl', label: 'CYL', unit: 'D', inputMode: 'decimal' },
      { key: 'rightAxis', label: 'Axis', unit: '°', inputMode: 'numeric' },
    ],
  },
]

function App() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(false)

  function handleChange(field, value) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }))
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }
      delete nextErrors[field]
      return nextErrors
    })
    setIsValid(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validatePrescription(values)
    setErrors(validationErrors)
    setIsValid(Object.keys(validationErrors).length === 0)
  }

  function handleReset() {
    setValues(initialValues)
    setErrors({})
    setIsValid(false)
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Prescription tools</p>
        <h1>LensCheck</h1>
        <p className="intro">
          Check that your prescription values are complete and within the
          accepted input ranges.
        </p>
      </header>

      <form className="prescription-card" noValidate onSubmit={handleSubmit}>
        <div className="form-heading">
          <div>
            <h2>Enter prescription</h2>
            <p>Values are checked for format and plausibility only.</p>
          </div>
        </div>

        <div className="eye-grid">
          {eyeFields.map(({ name, fields }) => (
            <fieldset className="eye-section" key={name}>
              <legend>{name}</legend>
              <div className="field-grid">
                {fields.map(({ key, label, unit, inputMode }) => (
                  <PrescriptionField
                    key={key}
                    id={key}
                    label={label}
                    unit={unit}
                    inputMode={inputMode}
                    value={values[key]}
                    error={errors[key]}
                    onChange={(value) => handleChange(key, value)}
                  />
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="form-footer">
          <p className="range-note">
            SPH: −20.00 to +20.00 D · CYL: −6.00 to +6.00 D · Axis: 1–180°
          </p>
          <div className="form-actions">
            <button className="button button-secondary" type="button" onClick={handleReset}>
              Reset
            </button>
            <button className="button button-primary" type="submit">
              Validate
            </button>
          </div>
        </div>

        {isValid && (
          <p className="success-message" role="status">
            Prescription values are valid.
          </p>
        )}
      </form>
      <p className="disclaimer">
        This tool checks input rules only and is not a clinical assessment.
      </p>
    </main>
  )
}

export default App
