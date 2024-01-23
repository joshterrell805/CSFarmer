function RadioGroup({id, formValidator, mapping, label}) {
  const radios = [];
  const selectedId = formValidator.getValue(id);
  const errorReason = formValidator.getErrorReason(id);
  const errorMessage = formValidator.getFieldErrorMessage(id);

  function setSelectedId(selectedId) {
    formValidator.onRadioChange(id, selectedId);
  }

  for (let [key, value] of Object.entries(mapping)) {
    const radio = <Radio key={key} id={key} {...{selectedId, setSelectedId}}>{value}</Radio>;
    radios.push(radio);
  }

  return (
    <div>
      <Label>{label}<ErrorSpan errorMessage={errorMessage}/></Label>
      <Indent id={id} className={errorReason ? 'errorBox' : 'noErrorBox'}>{radios}</Indent>
    </div>
  );
}