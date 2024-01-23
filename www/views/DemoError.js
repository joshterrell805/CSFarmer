function DemoError() {
  const isDemoMode = useContext(DemoModeContext);
  return isDemoMode ? (
    <Paragraph className="errorFont">⚠ Important: nothing has actually been submitted. This website is in "demo" mode.</Paragraph>
  ) : null;
}