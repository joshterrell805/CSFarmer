function ErrorSpan({errorMessage}) {
  return errorMessage ? (
    <> <span className="errorFont">({errorMessage})</span></>
  ) : null;
}