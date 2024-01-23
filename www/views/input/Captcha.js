function Captcha({onClick, children}) {
  const [show, setShow] = useState(false); // this disables captcha
  // TODO: re-enable captcha when needed.
  
  return show ? (
    <Button name="Send"
            text="Captcha - I'm not a robot"
            onClick={() => setShow(false)}
    />
  ) : children;
}