function Link({children, name}) {
  const buttonInfo = Button.getButtonInfo(name);
  if (buttonInfo.defaultOnClick === undefined) {
    throw new Error(`Attempting to use button ${name} as link, but onClick not defined.`)
  }
  function emitAndHandleClick() {
    UsageEmitter.emitLinkClicked(name);
    buttonInfo.defaultOnClick();
  }
  return <a href='javascript:void(0)' role='button' onClick={emitAndHandleClick}>{children}</a>
}