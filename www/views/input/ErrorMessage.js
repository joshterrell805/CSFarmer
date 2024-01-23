const ErrorMessage = React.forwardRef(({formValidator}, ref) => {
  const paragraphs = formValidator.getErrorMessage()
    .split('\n')
    .map((line, i) => (
      <Paragraph key={i} className="errorFont">{line}</Paragraph>
    ));

  return (
    <div ref={ref}>
      {paragraphs}
    </div>
  );
});