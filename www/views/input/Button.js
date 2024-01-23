function Button(params) {
  const {name, onClick} = params;
  let {text} = params
  const buttonInfo = Button.getButtonInfo(name);

  text = text || buttonInfo.text || name;
  const {defaultOnClick, special} = buttonInfo;
  const onClickFn = onClick || defaultOnClick;

  if (!onClickFn) {
    throw Error(`no onClick defined for button: ${name}`);
  }

  function emitAndHandleClick() {
    UsageEmitter.emitButtonPressed(name);
    onClickFn();
  }

  return <input type="button" 
                onClick={emitAndHandleClick}
                value={text}
                className={special ? 'special' : null}
  />;
}

Button.getButtonInfo = function getButtonInfo(name) {
  const infoByName = {
    "Learn-More": {
      text: "Learn more",
      defaultOnClick: () => App.gotoPage('/learn-more'),
    },
    "Message": {
      text: "Ask a question\nor share a thought",
      defaultOnClick: () => App.gotoPage('/message'),
      special: true,
    },
    "Stay-In-The-Loop": {
      text: "Let me know when there's\nfresh produce near me",
      defaultOnClick: () => App.gotoPage('/stay-in-the-loop'),
      special: true,
    },
    "Why-Local": {
      text: "Why local matters",
      defaultOnClick: () => App.gotoPage('/learn-more/why-local'),
    },
    "Pre-Register": {
      text: "Pre-register as a farmer",
      defaultOnClick: () => App.gotoPage('/pre-register'),
      special: true,
    },
    "Team": {
      text: "About the team",
      defaultOnClick: () => App.gotoPage('/learn-more/team'),
    },
    "Main-Menu": {
      text: "Return to the main menu",
      defaultOnClick: () => App.mainMenu(),
    },
    "Cancel": {
      defaultOnClick: () => App.goBack(),
    },
    "Send": {
      special: true,
    },
    "Back": {
      text: "Go back",
      defaultOnClick: () => App.goBack(),
    },
    "Continue": {
      text: "Continue",
      defaultOnClick: () => App.goBack(),
    },
    "Next": {
      special: true,
    },
    "Pricing": {
      text: "Pricing (for farmers)",
      defaultOnClick: () => App.gotoPage('/learn-more/pricing'),
    },
    "Regenerative-Community": {
      text: "Grow with regenerative\nfarmers around the world",
      defaultOnClick: () => App.gotoPage('/regenerative-community'),
    },
    "Regenerative-Community/Join": {
      text: "Join our community!",
      special: true,
      defaultOnClick: () => window.open('https://discord.com/invite/DNH834xXZg', '_blank').focus(),
    }
  };
  const info = infoByName[name];
  if (!info) {
    throw Error(`Button info ${name} not found`)
  }
  return info;
};