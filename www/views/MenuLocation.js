function MenuLocation() {
  const isPhoneMode = useContext(PhoneModeContext);
  const menuLocationString = isPhoneMode ? 'below' : 'on the right';
  return <>{menuLocationString}</>;
}