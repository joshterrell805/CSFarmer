function CheckboxOrRadioBase({input, onClickDescription, children}) {
  return (
    <div style={{display: 'flex', flexDirection: 'row', marginBottom: '1rem'}}>
      <div style={{display: 'flex', marginRight: '0.5rem'}}>
        {input}
      </div>
      <div style={{display: 'flex'}} onClick={() => onClickDescription && onClickDescription()}>
        <span style={{paddingTop: "0.3rem"}}>{children}</span>
      </div>
    </div>
  );

}