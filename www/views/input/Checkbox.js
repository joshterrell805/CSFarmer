function Checkbox({id, formValidator, children}) {
  function flipCheck() {
    const nowChecked = formValidator.getValue(id) != 'checked';
    formValidator.onCheckChange(id, nowChecked);
  }

  const input = (
    <input type="checkbox"
           id={id}
           onChange={flipCheck}
           checked={formValidator.getValue(id) == 'checked'}
    ></input>
  );
  return (
    <CheckboxOrRadioBase input={input} onClickDescription={flipCheck}>
      {children}
    </CheckboxOrRadioBase>
  );

}