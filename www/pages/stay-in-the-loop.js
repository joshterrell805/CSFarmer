function StayInTheLoop() {
  const [isSendComplete, setIsSendComplete] = useState(false);
  const errorMessageRef = useRef();

  const formValidator = new FormValidator({
    validationFn: () => {
      const validationFns = [
        () => formValidator.validateAtLeastOnePresent("Send-AtLeastOneChecked", [
          "notify-produce-near-me",
          "notify-newsletter",
        ]),
        () => formValidator.validateNotEmpty("email"),
        () => (isNotifyProduceNearMeChecked ? formValidator.validateNotEmpty(["country", "postal-code"]) : {}),
      ];
      for (const fn of validationFns) {
        const result = fn();
        if (!G.isEmpty(result)) {
          return result;
        }
      }
      return {};
    },
    errorMessageFn: () => {
      let message = "";
      if (formValidator.getErrorReason("Send-AtLeastOneChecked") == "none-present") {
        message = "Oops! There's nothing checked.\n\nIf you'd like emails, please check at least one box above. Otherwise, please press \"Cancel.\"";
      } else if (formValidator.getErrorReason("email") == "required") {
        message = "Oops! If you'd like to be notified, please provide your email address above.";
      } else if (formValidator.getErrorReason("country") == "required" ||
                 formValidator.getErrorReason("postal-code") == "required") {
        message = "Oops! To receive an email when farmers have produce near you, please provide your country and postal code in the boxes above.";
      }
      return message;
    },
    defaults: {
      'within': '25-miles-40-kilometers'
    },
  });

  const isNotifyProduceNearMeChecked = formValidator.getValue("notify-produce-near-me") == "checked";

  let body = isSendComplete ? (
    <div>
      <DemoError />
      <Paragraph>{`
        Thank you!
        
        Automatic emails are not enabled yet. You should get an email in a few days confirming your preferences.
      `}</Paragraph>
      <img src="/images/piglets-001.jpg" />
    </div>
  ) : (() => {
    const withinAbout = isNotifyProduceNearMeChecked ? (
      <Indent factor={2} style={{marginBottom: '1rem'}}>
        <RadioGroup id="within" formValidator={formValidator} label="Within..." mapping={{
            "25-miles-40-kilometers": "25 miles (40 kilometers)",
            "50-miles-80-kilometers": "50 miles (80 kilometers)",
            "100-miles-160-kilomters": "100 miles (160 kilometers)",
          }}
        />
        <Paragraph>Of...</Paragraph>
        <Indent>
          <TextBox id="country" placeholder="example: France" formValidator={formValidator} label="Country" />
          <TextBox id="postal-code" placeholder="example: 75270" formValidator={formValidator} label="Postal code" />
        </Indent>
        <Label>I'm most interested in buying local produce for...</Label>
        <Indent>
          <Checkbox formValidator={formValidator} id="check-family">Myself, my family, and/or my small business</Checkbox>
          <Checkbox formValidator={formValidator} id="check-bulk-variety">My food business, which uses <i>a wide diveristy</i> of bulk produce (e.g. a resturaunt or a food bank/pantry)</Checkbox>
          <Checkbox formValidator={formValidator} id="check-bulk-specialty">My food business, which uses <i>a narrow selection</i> of bulk produce (e.g. a bakery that uses lots of apples and milk)</Checkbox>
          <Checkbox formValidator={formValidator} id="check-super-bulk-variety">My food business, which uses <i>thousands of dollars per week</i> of a wide diversity of bulk produce (e.g. a market/grocer or a large food bank/pantry)</Checkbox>
        </Indent>
      </Indent>
    ) : null;
    return (
      <div>
        <fieldset>
          <Paragraph>By clicking the first check-box below, you can indicate your interest to farmers and co-ops near you.</Paragraph>
          <TextBox id="email" placeholder="example: charlie@gmail.com" formValidator={formValidator} label="Your email" />
          <Label>Please select your preferences...</Label>
          <Indent>
            <Checkbox formValidator={formValidator} id="notify-produce-near-me">Send me an email when a farmer has produce available nearby</Checkbox>
            {withinAbout}
            <Checkbox formValidator={formValidator} id="notify-newsletter">I'm interested in receiving an email newsletter about CSFarmer (once per month or less)</Checkbox>
          </Indent>
        </fieldset>
        <ErrorMessage formValidator={formValidator} ref={errorMessageRef} />
        <img src="/images/veggies-001.jpg" />
      </div>
    )
  })();
  const subtitle = <SubTitle>Stay in the Loop</SubTitle>;
  const menu = isSendComplete ? (
    <Menu>
      <Button name="Continue"></Button>
    </Menu>
  ) : (
    <Menu>
      <Captcha>
          <Button text="Submit" name="Send"
                  onClick={() => {
                    const isInvalid = formValidator.validate();
                    if (isInvalid) {
                      G.scrollToRef(errorMessageRef);
                    } else {
                      console.log('TODO: submit message form with values.', formValidator.getFilledForm())
                      setIsSendComplete(true);
                      App._scrollTop();
                    }
                  }}
          />
      </Captcha>
      <Button name="Cancel" />
    </Menu>
  );
  return (
    <Page {...{menu, subtitle}}>      
      {body}
    </Page>
  );
}