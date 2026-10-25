function PrescriptionField({
  id,
  label,
  unit,
  inputMode,
  value,
  error,
  onChange,
}) {
  const errorId = `${id}-error`

  return (
    <div className={`field${error ? ' field-invalid' : ''}`}>
      <label htmlFor={id}>
        {label} <span className="field-unit">({unit})</span>
      </label>
      <input
        id={id}
        name={id}
        type="text"
        inputMode={inputMode}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}

export default PrescriptionField
