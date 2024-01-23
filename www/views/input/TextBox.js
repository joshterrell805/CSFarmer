function TextBox({id, label, type, formValidator, optional, placeholder, rows}) {
  const value = formValidator.getValue(id);
  const errorReason = formValidator.getErrorReason(id);
  const errorMessage = formValidator.getFieldErrorMessage(id);

  const finalPlaceholder = placeholder || (optional ? '(optional)' : null);
  const onChange = formValidator.onTextChangeEvent;
  const className = errorReason ? 'errorBox' : 'noErrorBox';
  const commonInputArgs = {id, placeholder: finalPlaceholder, className, onChange, value}

  const inputEl = rows && rows > 1 ? (
    <textarea
      rows={rows}
      {...commonInputArgs}
    ></textarea>
  ) : (
    <input
      type={type || "text"}
      {...commonInputArgs}
    ></input>
  );
  
  return (
    <div>
      <Label>{label}<ErrorSpan errorMessage={errorMessage}/></Label>
      {inputEl}
  </div>
  )
}