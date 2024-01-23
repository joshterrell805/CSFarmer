const StayInTheLoop = (() => {
  const submissionStatusById = {};

  function Form({id, subtitle, pages, submit, finishedMessage}) {
    const [pageNum, setPageNum] = useState(1);
    const [dataByPageNum, setDataByPageNum] = useState({});
    const [pageHistoryStack, setPageHistoryStack] = useState([]);
    const [isSendComplete, setIsSendComplete] = useState(false);
    const [sendingSubmissionId, setSendingSubmissionId] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const errorMessageRef = useRef();
    const page = pages[pageNum];
    const isLastPage = pageNum == pages.length - 1;

    function BackButton() {
      return pageNum == 1 ? (
        <Button name="Cancel" />
      ) : (
        <Button name="Back" onClick={() => {
          if (G.isEmpty(pageHistoryStack)) {
            throw new Error(`Expected non-empty history stack ${pageNum}`)
          }
          else {
            const prevPageNum = G.last(pageHistoryStack);
            const newHistory = pageHistoryStack.slice(0, pageHistoryStack.length - 1);
            setPageHistoryStack(newHistory);
            setPageNum(prevPageNum);
          }
        }} />
      );
    }

    function FormMenu() {
      let menu = null;
      if (isSendComplete) {
        menu = (
          <Menu>
            <Button name="Continue"></Button>
          </Menu>
        );
      } else if (isSending) {
        menu = (
          <Menu>
            <Button name="Cancel" onClick={() => {
              if (submissionStatusById == 'sending') {
                su
              }
            }}></Button>
          </Menu>
        );
      } else if (!isLastPage) {
        menu = (
          <Menu>
            <Button name="Next" onClick={() => {
              const isInvalid = formValidator.validate();
              if (isInvalid) {
                G.scrollToRef(errorMessageRef);
              } else {
                const data = page.getData();
                const nextPageNum = page.nextPage ? page.nextPage() : pageNum + 1;
                setPageNum(nextPageNum);
                setDataByPageNum({...dataByPageNum, [pageNum]: data});
              }
            }}></Button>
            <BackButton />
          </Menu>
        );
      } else {
        menu = (
          <Menu>
            <Captcha>
              <Button text="Submit" name="Send" disabled={isSending} onClick={() => {
                const isInvalid = formValidator.validate();
                if (isInvalid) {
                  G.scrollToRef(errorMessageRef);
                } else {
                  const data = page.getData();
                  const newDataByPageNum = {...dataByPageNum, [pageNum]: data};
                  submit(newDataByPageNum, () => {
                    setIsSending(false);
                    setIsSendComplete(true);
                    App._scrollTop();
                  })
                  setIsSending(true);
                  setDataByPageNum(newDataByPageNum);
                  App._scrollTop();
                }
              }} />
            </Captcha>
            <BackButton disabled={isSending} />
          </Menu>
        );
      }
      return menu;
    }

    function FormBody() {
      if (isSendComplete) {
        return finishedMessage;
      } else if (isSending) {
        return <Paragraph>Sending...</Paragraph>;
      } else {
        return page.render();
      }
    }

    return (
      <Page 
        id = {id}
        subtitle = {subtitle}
        menu = { <FormMenu /> }
      >
        <FormBody />
      </Page>
    );
  }
  function FormPage({validationFn, errorMessageFn, getBody, nextPage}) {
    const formValidator = new FormValidator({validationFn, errorMessageFn});
    this.nextPage = nextPage ? (() => nextPage(formValidator)) : null;
    this.render = () => getBody(formValidator)
    this.getData = () => formValidator.getFilledForm();
  }
  return function StayInTheLoop() {
    const formValidator = new FormValidator({
      validationFn: () => {
        const validationFns = [
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

    const Page1 = (
      <FormPage
        validationFn = {(formValidator) => {
          formValidator.validateAtLeastOnePresent("Send-AtLeastOneChecked", [
            "notify-produce-near-me",
            "notify-newsletter",
          ])
        }}
        errorMessageFn = {(formValidator) => {
          formValidator.getErrorReason("Send-AtLeastOneChecked") == "none-present" ? (
            "Oops! There's nothing checked.\n\nIf you'd like emails, please check at least one box above. Otherwise, please press \"Cancel.\""
          ) : ""
        }}
        nextPage = {(formValidator) => {
          formValidator.getValue("notify-produce-near-me") == "checked" ? 2 : 3
        } }
        getBody = {(formValidator) => {
          <>
            <fieldset>
              <Paragraph>By clicking the first check-box below, you can indicate your interest to farmers and co-ops near you.</Paragraph>
              <Label>Please select your preferences...</Label>
              <Indent>
                <Checkbox formValidator={formValidator} id="notify-produce-near-me">Send me an email when a farmer has produce available nearby</Checkbox>
                <Checkbox formValidator={formValidator} id="notify-newsletter">I'm interested in receiving an email newsletter about CSFarmer (once per month or less)</Checkbox>
              </Indent>
            </fieldset>
            <ErrorMessage formValidator={formValidator} ref={errorMessageRef} />
            <img src="/images/veggies-001.jpg" />
          </>

        }}
      />
    );

    const Page2 = (
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
    );

    const x =           <TextBox id="email" placeholder="example: charlie@gmail.com" formValidator={formValidator} label="Your email" />;
    return (
      <Form
        id='stay-in-the-loop'
        subtitle='Stay in the Loop'
        pages = {[page1]}
        submit = {(data, onComplete) => {
          console.log('todo: send data', data);
          setTimeout(onComplete, 1000);
        }}
        finishedMessage = {
          <>
            <DemoError />
            <Paragraph>{`
              Thank you!
              
              Automatic emails are not enabled yet. You should get an email in a few days confirming your preferences.
            `}</Paragraph>
            <img src="/images/piglets-001.jpg" />
          </>
        }
      />
    );
  }
})();