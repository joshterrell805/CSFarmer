function Radio({id, selectedId, setSelectedId, children}) {
  const input = (
    <input type="radio"
           id={id}
           onChange={event => {
             if (event.target.checked) {
              setSelectedId(id);
             }
           }}
           checked={selectedId == id}
      ></input>
  );
  return (
    <CheckboxOrRadioBase input={input} onClickDescription={() => {
      setSelectedId(id);
    }}>
      {children}
    </CheckboxOrRadioBase>
  );

}