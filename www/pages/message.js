function Message() {
  const [isSent, setIsSent] = useState(false);
  const errorMessageRef = useRef();
  const formValidator = new FormValidator({
    validationFn: () => {
      return {
        ...formValidator.validateNotEmpty(["message"]),
        ...formValidator.validateLimit("message", 2000)
      }
    },
    errorMessageFn: () => {
      const errorReason = formValidator.getErrorReason("message");
      switch(errorReason) {
        case 'required':
          return 'Oops! Please type a message in the box above, then press send.';
        case 'limit':
          return 'Oops! Please shorten your message.';
        case undefined:
          return '';
        default:
          throw Error(`unrecognized errorReason: ${errorReason}`)
      }
    },
  });
  function onSendPressed() {
    const isInvalid = formValidator.validate();
    if (isInvalid) {
      G.scrollToRef(errorMessageRef);
    } else {
      console.log('TODO: send message', formValidator.getFilledForm())
      setIsSent(true);
      App._scrollTop();
    }
  }
  return (
    <Page 
      menu = {
        isSent ? (
          <Menu>
            <Button name="Continue" />
          </Menu>
        ) : (
          <Menu>
            <Captcha>
              <Button name="Send" onClick={onSendPressed} />
            </Captcha>
            <Button name="Cancel" />
          </Menu>
        )
      }
      subtitle = 'Send a Message'
    >
      {
      isSent ? (
        <div>
          <DemoError />
          <Paragraph>Thank you for your message!</Paragraph>
          <Paragraph/>
          <img src="/images/piglets-001.jpg" />
        </div>
      ) : (
        <div>
          <img src="/images/sheep-001.jpg" />
          <Paragraph>{`
            Feel free to share your questions, perspectives, feedback, concerns... or even criticisms!
            
            Your message could validate something, or shed new light.
          `}</Paragraph>
          <TextBox id="name" formValidator={formValidator} label="Name" optional={true} />
          <TextBox id="email" formValidator={formValidator} label="Email" type="email" optional={true} />
          <TextBox id="message" formValidator={formValidator} label="Message" rows="4" />
          <ErrorMessage ref={errorMessageRef} formValidator={formValidator} />
        </div>
      )
  }
    </Page>
  );
}