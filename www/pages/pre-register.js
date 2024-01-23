
const PreRegister = (() => {

  function Page1({finishFormPage, defaults, pageOptions}) {
    const formValidator = new FormValidator({
      validationFn: () => formValidator.validateNotEmpty(["name", "country", "postal-code", "years-farmed"]),
      errorMessageFn: () => formValidator.wasError() ? (
        'Oops!\nPlease scroll up and fill out the required field(s) in red.'
      ) : null,
      defaults,
    });

    const commonOptions = {formValidator}
    const menu = (
      <Menu>
        <Button name="Next" onClick={() => {
          const isInvalid = formValidator.validate();
          if (isInvalid) {
            G.scrollToRef(errorMessageRef);
          } else {
            finishFormPage(formValidator.getFilledForm());
          }
        }} />
        <Button name="Cancel" />
      </Menu>
    );
    const errorMessageRef = useRef();
    return (
      <Page {...{menu, ...pageOptions}}>
        <Paragraph className='sentiment'>Support your community, and be <span>community-supported.</span></Paragraph>
        <Paragraph className='sentiment'>Understand what your <span>community needs.</span></Paragraph>
        <Paragraph className='sentiment'>Feed your community.</Paragraph>
        <img src="/images/farm-001.jpg" />
        <Paragraph>Our hope is to help you easily and effectively connect with the wealth of online customers in your community.</Paragraph>
        <Paragraph>Pre-registering only takes a couple of minutes to complete.</Paragraph>
        <Paragraph></Paragraph>
        <fieldset>
          <TextBox id="name" label="Your name" {...commonOptions} />
          <TextBox id="farm-name" label="Your farm's name" optional {...commonOptions} />
          <TextBox id="country" placeholder="example: USA" label="Country" {...commonOptions} />
          <TextBox id="postal-code" placeholder="example: 10065" label="Postal code" {...commonOptions} />
          <RadioGroup
            id="years-farmed"
            label="How many years have you farmed?"
            mapping={{
              "years-0-1": "0-1 years",
              "years-2-4": "2-4 years",
              "years-5-10": "5-10 years",
              "years-11-20": "11-20 years",
              "years-20-plus": `21 or more years${formValidator.getValue("years-farmed") == "years-20-plus" ? "! 🥳" : ""}`,
            }}
            {... commonOptions}
          />
        </fieldset>
        <ErrorMessage ref={errorMessageRef} {...commonOptions} />
      </Page>
    );
  }



  function Page2({finishFormPage, previousFormPage, defaults, pageOptions}) {
    const formValidator = new FormValidator({
      validationFn: () => formValidator.validateAtLeastOnePresent("Page2-AtLeastOne", [
        "produced-short-lived-fruits-veggies-or-nuts",
        "produced-herbs", "produced-long-lived-veggies",
        "produced-perennial-fruits",
        "produced-tree-nuts",
        "produced-flowers",
        "produced-mixed-produce",
        "produced-eggs",
        "produced-meat",
        "produced-dairy",
        "produced-mushrooms",
        "produced-livestock-or-pet-feed",
        "produced-certified-organic",
        "produced-value-added-foods",
        "produced-other"
      ]),
      errorMessageFn: () => formValidator.wasError() ? (
        'Oops! You must grow, produce, and sell at least one food to pre-register as a farmer.'
      ) : null,
      defaults,
    });

    function SecondLine({children}) {
      return <div style={{marginTop: '0.25rem', fontStyle: 'italic'}}>{children}</div>
    }
    const errorMessageRef = useRef();
    const menu = (
      <Menu>
        <Button name="Next" onClick={() => {
            const isInvalid = formValidator.validate();
            if (isInvalid) {
              G.scrollToRef(errorMessageRef);
            } else {
              finishFormPage(formValidator.getFilledForm());
            }
        }} />
        <Button name="Back" onClick={() => previousFormPage(formValidator.getFilledForm())} />
      </Menu>
    );
    return (
      <Page {...{menu, ...pageOptions}}>
        <Paragraph>Page 2 of 4</Paragraph>
        <fieldset>
          <img src="/images/seedlings-001.jpg" />
          <Label>I grow, produce, and sell...</Label>
          <Indent>
            <Checkbox formValidator={formValidator} id="produced-short-lived-fruits-veggies-or-nuts">Short-lived fruits, veggies, or nuts<SecondLine>Examples: tomatoes, carrots, lettuce, kale, potatoes, melons, squash, brussels sprouts, peanuts...</SecondLine></Checkbox>
            <Checkbox formValidator={formValidator} id="produced-herbs">Herbs<SecondLine>Examples: basil, cilantro, rosemary, sage...</SecondLine></Checkbox>
            <Checkbox formValidator={formValidator} id="produced-long-lived-veggies">Long-lived veggies<SecondLine>Examples: ginger, asparagus, artichoke...</SecondLine></Checkbox>
            <Checkbox formValidator={formValidator} id="produced-perennial-fruits">Perennial fruits<SecondLine>Examples: apples, avocados, oranges, papayas, grapes, berries...</SecondLine></Checkbox>
            <Checkbox formValidator={formValidator} id="produced-tree-nuts">Tree nuts<SecondLine>Examples: pecans, pistachios, walnuts, cashews, almonds...</SecondLine></Checkbox>
            <Checkbox formValidator={formValidator} id="produced-flowers">Flowers<SecondLine>Examples: edible flowers, floral arrangements...</SecondLine></Checkbox>
            <Checkbox formValidator={formValidator} id="produced-mixed-produce">Mixed produce<SecondLine>Examples: CSA boxes, mixed greens...</SecondLine></Checkbox>
            <Checkbox formValidator={formValidator} id="produced-eggs">Eggs</Checkbox>
            <Checkbox formValidator={formValidator} id="produced-meat">Meat</Checkbox>
            <Checkbox formValidator={formValidator} id="produced-dairy">Dairy</Checkbox>
            <Checkbox formValidator={formValidator} id="produced-mushrooms">Mushrooms</Checkbox>
            <Checkbox formValidator={formValidator} id="produced-livestock-or-pet-feed">Animal feed</Checkbox>
            <Checkbox formValidator={formValidator} id="produced-certified-organic">Certified organic produce</Checkbox>
            <Checkbox formValidator={formValidator} id="produced-value-added-foods">Value-added foods<SecondLine>Examples: pickles, cheese, jams, meals, entrees, meal-kits, deserts...</SecondLine></Checkbox>
            <TextBox formValidator={formValidator} type="text" id="produced-other" label = "Other" />
          </Indent>
        </fieldset>
        <ErrorMessage ref={errorMessageRef} formValidator={formValidator} />
      </Page>
    );
  }



  function Page3({finishFormPage, previousFormPage, defaults, pageOptions}) {
    const formValidator = new FormValidator({
      validationFn: () => formValidator.validateAtLeastOnePresent("Page3-AtLeastOne", [
        "demographic-farmers-market",
        "demographic-co-op",
        "demographic-csa",
        "demographic-deliver",
        "demographic-buy-in-person",
        "demographic-pickup",
        "demographic-domestic",
        "demographic-international",
        "demographic-offer-other"
      ]),
      errorMessageFn: () => formValidator.wasError() ? (
        'Oops! You must offer your food to your customers in at least one way to pre-register as a farmer.'
        ) : null,
        defaults,
    });
    const errorMessageRef = useRef();
    const menu = (
      <Menu>
        <Button name="Next" onClick={() => {
          const isInvalid = formValidator.validate();
          if (isInvalid) {
            G.scrollToRef(errorMessageRef);
          } else {
            finishFormPage(formValidator.getFilledForm());
          }
        }} />
        <Button name="Back" onClick={() => previousFormPage(formValidator.getFilledForm())} />
      </Menu>
    );
    return (
      <Page {...{menu, ...pageOptions}}>
        <Paragraph>Page 3 of 4</Paragraph>
        <fieldset>
          <img src="/images/barn-001.jpg" />
          <Label>In the next 12 months, I will produce...</Label>
          <Indent>
            <Checkbox formValidator={formValidator} id="demographic-cash-crop-farmer">Large quantities of a few varieties of produce (i.e. cash crop farming)</Checkbox>
            <Checkbox formValidator={formValidator} id="demographic-market-gardener">A large variety of produce (i.e. CSA farming or market gardening)</Checkbox>
          </Indent>
          <Label>In the next 12 months, I will...</Label>
          <Indent>
            <Checkbox formValidator={formValidator} id="demographic-farmers-market">Sell produce at a local farmer's market</Checkbox>
            <Checkbox formValidator={formValidator} id="demographic-co-op">Sell produce through a cooperative of farmers</Checkbox>
            <Checkbox formValidator={formValidator} id="demographic-csa">Sell CSA shares</Checkbox>
            <Checkbox formValidator={formValidator} id="demographic-deliver">Deliver large orders to resturaunts, grocers, or other local businesses</Checkbox>
            <Checkbox formValidator={formValidator} id="demographic-buy-in-person">Enable customers to <i>buy</i> produce in-person at my farm, stand, or store</Checkbox>
            <Checkbox formValidator={formValidator} id="demographic-pickup">Enable customers to <i>pickup</i> their orders at my farm or elsewhere</Checkbox>
            <Checkbox formValidator={formValidator} id="demographic-domestic">Sell bulk produce domestically</Checkbox>
            <Checkbox formValidator={formValidator} id="demographic-international">Sell bulk produce internationally</Checkbox>
            <TextBox formValidator={formValidator} type="text" id="demographic-offer-other" label = "Other" />
          </Indent>
        </fieldset>
        <ErrorMessage ref={errorMessageRef} formValidator={formValidator} />
        
      </Page>
      
    );
  }
  

  
  function Page4({finishFormPage, previousFormPage, defaults, pageOptions}) {
    const formValidator = new FormValidator({
      validationFn: () => {
        if (requestedEmails) {
          return formValidator.validateNotEmpty('email');
        } else {
          return {};
        }
      },
      errorMessageFn: () => {
        if(formValidator.wasError()) {
          return 'Your email address is required in order to send you an email!';
        } else {
          return null;
        }
      },
      defaults,
    });

    const requestedEmails = ['notify-customers', 'notify-newsletter', 'notify-public', 'contact-okay'].some(
      id => formValidator.getValue(id) == 'checked'
    );
    const emailPlaceholder = requestedEmails ? 'example: alex@yahoo.com' : '(optional)'
    const contactOkayChecked = formValidator.getValue('contact-okay') == 'checked';
    const thankYouContactOkay = contactOkayChecked ? (<span className="highlight">&nbsp;&mdash; Thank You!</span>) : null;
    const errorMessageRef = useRef();
    const menu = (
      <Menu>
        <Captcha>
            <Button name="Send" text="Register!" onClick={() => {
              const isInvalid = formValidator.validate();
              if (isInvalid) {
                G.scrollToRef(errorMessageRef);
              } else {
                finishFormPage(formValidator.getFilledForm());
              }
            }} />
        </Captcha>
        <Button name="Back" onClick={() => previousFormPage(formValidator.getFilledForm())} />
      </Menu>
    );
    return (
      <Page {...{menu, pageOptions}}>
        <Paragraph>Last Page!</Paragraph>
        <fieldset>
          <img src="/images/cows-001.jpg" />
          <Label>Email me when...</Label>
          <Indent>
            <Checkbox formValidator={formValidator} id="notify-customers">Local customers are interested in buying the kinds of produce I grow</Checkbox>
            <Checkbox formValidator={formValidator} id="notify-newsletter">There's a newsletter about CSFarmer (once per month or less)</Checkbox>
            <Checkbox formValidator={formValidator} id="notify-public">I can list my farm or co-op on this website</Checkbox>
          </Indent>
          <Label style={{marginTop: "1rem"}}>Your input can help turn CSFarmer into something that really works well, and really is affordable. If you're willing to share with us, please check the box below.</Label>
          <Indent style={{marginBottom: "1rem"}}>
            <Checkbox formValidator={formValidator} id="contact-okay">Sure, I'll share a thought or two{thankYouContactOkay}</Checkbox>
          </Indent>
          <TextBox formValidator={formValidator} id="email" label="Your email" placeholder={emailPlaceholder} />
          <ErrorMessage ref={errorMessageRef} formValidator={formValidator} />
        </fieldset>
      </Page>
    );
  }

  function PageThankYou({pageOptions}) {
    const menu = (
      <Menu>
        <Button name="Continue"></Button>
      </Menu>
    );
    return (
      <Page {...{menu, ...pageOptions}}>
        <DemoError />
        <Paragraph>Thank you for pre-registering!</Paragraph>
        <Paragraph>If you checked any of the boxes on the last page, we'll be in touch!</Paragraph>
        <img src="/images/piglets-001.jpg" />
      </Page>
    );
  }

  return function ForFarmersPreRegister() {
    const [sent, setSent] = useState(false);
    const [page, setPage] = useState(1);
    const [filledPageByPageNum, setFilledPageByPageNum] = useState({});
    
    function updatePage(page, data) {
      const filledForm = {
        ...filledPageByPageNum,
        [page]: data,
      };
      setFilledPageByPageNum(filledForm);
      return filledForm;
    }

    function finishFormPage(filledPage) {
      const filledForm = updatePage(page, filledPage);
      if (page < 4) {
        console.log(`finished page ${page}`, filledForm)
        setPage(page+1);
      } else {
        console.log('TODO: send completed form', filledForm)
        setSent(true);
      }
      App._scrollTop();
    }

    function previousFormPage(partialPage) {
      if (page == 1) {
        throw Error("Error: no previous page to go back to!")
      }
      updatePage(page, partialPage);
      setPage(page - 1);
      App._scrollTop();
    }

    let body = null;
    const subtitle = <SubTitle>Farmer <span>Pre-Registration</span></SubTitle>;
    let pageOptions = {subtitle, id: 'pre-register'};
    if (sent) {
      body = <PageThankYou {...{pageOptions}} />
    } else {
      const defaults = filledPageByPageNum[page];
      const params = {pageOptions, finishFormPage, previousFormPage, defaults};
      switch(page) {
        case 1:
          body = <Page1 {...params} />;
          break;
        case 2:
          body = <Page2 {...params} />;
          break;
        case 3:
          body = <Page3 {...params} />;
          break;
        case 4:
          body = <Page4 {...params} />;
          break;
        default:
          throw Error(`Unknown page: ${page}`)
      }
    }
    return body;
  }
})();