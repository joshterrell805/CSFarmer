(() => {
  window.addEventListener("popstate", (event) => {
    const {url} = event.state;
    App._setPage(url);
  });
})();

(() => {
  window.onerror = (msg, url, line, col, error) => {
    let stackTrace = error.stack || ({url, line, col} + '')
    UsageEmitter.emitErrorUncaught(msg, stackTrace)
  };
})();

const PhoneModeContext = React.createContext();
const DemoModeContext = React.createContext();
const MenuPositionContext = React.createContext();
const TransitionProgressContext = React.createContext(0);
const SunProgressContext = React.createContext(0);

(() => {
  const urlOnLoad = window.location.pathname;
  console.log('URL on load:', window.location + '', urlOnLoad);

  // to make navigation make sense, push a few entries into the history
  const urlsToPush = [];
  // first push the home entry
  urlsToPush.push('/')
  
  
  const pageOnLoad = G.getCurrentPageFromUrl(urlOnLoad);
  if (pageOnLoad != '/') {
    // next, push every page to traverse to urlOnLoad
    const fragments = pageOnLoad.substring(1).split('/');
    for (let count = 1; count <= fragments.length; ++count) {
      const historyEntry = fragments.slice(0, count);
      const historyUrl = '/' + historyEntry.join('/');
      urlsToPush.push(historyUrl);
    }
  }
  
  // actually push to the browser history
  for (const urlToPush of urlsToPush) {
    //console.log(`pushing ${urlToPush} to history`);
    window.history.pushState({url: urlToPush}, '', urlToPush);
  }
})();

const Root = (() => {
  const SUN_LOOP_DURATION = 5 * 60 * 1000;
  let firstRender = true;
  let isDemoMode = LoadMetadata.isDemoMode;
  return function Root() {
    const [currentPage, setCurrentPage] = useState(G.getCurrentPage());
    const [isPhoneMode, setIsPhoneMode] = useState(true);
    const [menuActualPosition, setMenuActualPosition] = useState({top: 0});
    const [menuLastTimestamp, setMenuLastTimestamp] = useState(null);
    const [menuStartTop, setMenuStartTop] = useState(null);
    const [menuEndTop, setMenuEndTop] = useState(null);
    const [menuVelocity, setMenuVelocity] = useState(null);
    const [overlayStartTimestamp, setOverlayStartTimestamp] = useState(Date.now());
    const [overlayProgress, setOverlayProgress] = useState(0);
    
    const [sunAnimationStep, setSunAnimationStep] = useState(0);
    G.async(() => setSunAnimationStep(sunAnimationStep+1));
    const sunCompletedFraction = (((Date.now() - G.timestampOnLoad) % SUN_LOOP_DURATION) / SUN_LOOP_DURATION + 0.2) % 1;
    const sunHeightFraction = 1 - Math.pow(1 - 2*sunCompletedFraction, 2);
    const sunPosition = {sunCompletedFraction, sunHeightFraction};
    
    if (overlayStartTimestamp) {
      const now = Date.now();
      const duration = now - overlayStartTimestamp;
      const progress =  Math.min(1, duration / 500);
      if (progress >= 1) {
        G.async(() => {
          setOverlayStartTimestamp(null);
          setOverlayProgress(1);
        })
      } else {
        G.async(() => setOverlayProgress(progress));
      }
    }
    if (!isPhoneMode && menuStartTop !== null) {
      function asyncEndAnimation() {
        // console.log('ending animation', menuStartTop, menuEndTop);
        G.async(() => {
          setMenuActualPosition({top: menuEndTop});
          setMenuLastTimestamp(null);
          setMenuEndTop(null);
          setMenuStartTop(null);
          setMenuVelocity(null);
        })
      }
      function asyncAnimateWithNewTop(newTop, newVelocity) {
        const truncTop = parseInt(newTop);
        // console.log('animate step:', truncTop, newVelocity);
        G.async(() => {
          setMenuActualPosition({top: truncTop});
          setMenuLastTimestamp(now);
          setMenuVelocity(newVelocity)
        });
      }
      const now = Date.now();
      const direction = menuStartTop < menuEndTop ? 1 : -1;
      if (!menuLastTimestamp) {
        asyncAnimateWithNewTop(menuStartTop, 0.005 * direction);
      } else {
        const millisPerFrame = now - menuLastTimestamp;
        const newTop = menuActualPosition.top + menuVelocity * millisPerFrame
        if (direction > 0 ? newTop >= menuEndTop : newTop <= menuEndTop) {
          asyncEndAnimation();
        } else {
          const terminalSpeed = 1;
          const minTerminalSpeed = 0.02;
          const distanceRemaining = Math.abs(menuEndTop - menuActualPosition.top);
          const toForce = Math.min(1, distanceRemaining/500);
          const awayForce = 1 - Math.min(1, distanceRemaining/300);
          const acceleration = 1 + 8 * (1 + 4*toForce) * (1 + 4*toForce) / (5*5) ;
          const deceleration = -60 * ((1+4*awayForce) * (1+4*awayForce)) * (1+24*Math.abs(menuVelocity))*(1+24*Math.abs(menuVelocity)) / (5*5*25*25);
          const totalChangeInVelocity = direction * (acceleration + deceleration)/100 ;
          // console.log('acceleration', acceleration, deceleration, totalChangeInVelocity, menuVelocity);
          const newSpeed = Math.min(terminalSpeed, Math.abs(menuVelocity + totalChangeInVelocity));
          const newVelocity = direction * Math.max(minTerminalSpeed, newSpeed); 
          asyncAnimateWithNewTop(newTop + newVelocity * millisPerFrame,  newVelocity);
        }
      }
    }

    function onResize() {
      G.async(() => setOverlayStartTimestamp(Date.now()));
      onScroll();
    }
    function onScroll() {
      G.async(() => {
        setIsPhoneMode(App._isPhoneMode());
        const screenHeight = document.getElementById('app').getBoundingClientRect().height;
        const titleHeight = document.getElementById('title-bar').getBoundingClientRect().height;
        const menuEl = document.getElementById('menu');
        const menuRect = menuEl.getBoundingClientRect();
        const menuHeight = menuRect.height;
        const menuTopPx = getComputedStyle(menuEl).top;
        const menuTop = parseInt(menuTopPx.substring(0, menuTopPx.length-2));
        const menuContainerRect = document.getElementById('menu-container').getBoundingClientRect();
        const menuContainerTop = menuContainerRect.top;
        const menuContainerHeight = menuContainerRect.height;
        const maxTop = menuContainerHeight - menuHeight - G.convertRemToPixels(1) - 2 /* bottom border */;
        const newTop = Math.max(0, Math.min(maxTop, parseInt(screenHeight < menuHeight ? (
          // condition: when screenheight is too small to show entire menu
          // (1) keep menu at top until entire menu has been scrolled through
          // (2) then keep bottom of menu at bottom of screen
          // (3) don't exceed bottom of menuContainer
          Math.min(
            // TODO don't hardcode these rem values
            menuContainerHeight - menuHeight + G.convertRemToPixels(2), // condition when menu is at bottom of page
            Math.max(0, -menuContainerTop - menuHeight + screenHeight) // condition when menu is static at top until screen sees bottom of menu
          )
        ) : (
          // condition: when screenheight is tall enough to show the entire menu
          // menu is always in center of screen... unless it would exceed its container.
          // screenHeight / 2 - menuHeight / 2 - menuContainerTop
          // or at top:
          -menuContainerTop //+ G.convertRemToPixels(0.5)
          // I think I like top better.. but does menu-container need a bg color and/or border?
        ))));
        // console.log('scrolling to', newTop)
        const startTop = Math.max(0, Math.min(maxTop, menuTop));
        // console.log({screenHeight, titleHeight, menuHeight, menuTopPx, menuTop, menuContainerTop, menuContainerHeight, maxTop, newTop, startTop})
        setMenuEndTop(newTop);
        setMenuStartTop(startTop);
        setMenuActualPosition({top: startTop});
      });
    }

    if (firstRender) {
      firstRender = false;
      G.async(() => UsageEmitter.emitPageLoaded());
      onResize();
      addEventListener("resize", onResize);
      document.getElementById('app').addEventListener("scroll", onScroll);
      G.async(() => {
        const last = {
          stringifiedScreenState: JSON.stringify(App._getScreenState()),
          scrollState: App._getScrollState(),
        }
        setInterval(() => {
          let currentStringifiedScreenState = JSON.stringify(App._getScreenState());
          if (currentStringifiedScreenState != last.stringifiedScreenState) {
            last.stringifiedScreenState = currentStringifiedScreenState;
            UsageEmitter.emitScreenResized();
          }
        }, 1000);

        setInterval(() => {
          let scrollState = App._getScrollState();
          let {visiblePercent, scrollPercent} = scrollState;
          if (
            Math.abs(visiblePercent - last.scrollState.visiblePercent) > 0.001
            ||
            Math.abs(scrollPercent - last.scrollState.scrollPercent) > 0.001
          ) {
            last.scrollState = scrollState;
            UsageEmitter.emitPageScrolled(visiblePercent, scrollPercent);
          }
        }, 1000);
      });

    }

    App.gotoPage = function gotoPage(page) {
      const newUrl = page;
      const state = {url: newUrl};
      window.history.pushState(state, '', newUrl);
      App._setPage(newUrl);
    }

    App.goBack = function goBack() {
      window.history.back();
    }

    App.mainMenu = function mainMenu() {
      App.gotoPage('/');
    }

    App._setPage = function _setPage(url) {
      const cleanUrl = G.getCurrentPageFromUrl(url);
      setCurrentPage(cleanUrl);
      App._scrollTop();
      onResize();
      G.async(() => UsageEmitter.emitPageChanged());
    }

    App._scrollTop = function _scrollTop() {
        G.async(() => {
          document.getElementById('app').scrollTo({top: 0, behavior: 'smooth'})
          onResize();
        });
    };

    App._isPhoneMode = function _isPhoneMode() {
      const menuEl = document.getElementById('menu')
      const position = getComputedStyle(menuEl).position;
      return position !== 'relative';
    };

    App._getScreenState = function _getScreenState() {
      let appRect = document.getElementById('app').getBoundingClientRect();
      return {
        "isPhoneMode": App._isPhoneMode(),
        "widthPx": Math.round(appRect.width),
        "heightPx": Math.round(appRect.height),
      }
    };

    App._getScrollState = function _getScrollState() {
      let appRect = document.getElementById('app').getBoundingClientRect();
      let rootRect = document.getElementById('root').getBoundingClientRect();

      // since root will always be in body, with no margins I can just do:
      let visiblePercent = (appRect.height / rootRect.height) * 100;
    
      return {
        "visiblePercent": visiblePercent,
        "scrollPercent": getVerticalScrollPercentage(document.getElementById('root'))
      }
      function getVerticalScrollPercentage(elm){
        // https://stackoverflow.com/a/28994709/1433127
        var p = elm.parentNode
        return (elm.scrollTop || p.scrollTop) / (p.scrollHeight - p.clientHeight ) * 100
      }
    };

    let body = null;
    switch (currentPage) {
      case '/':
        body = <Home />;
        break;
      case '/message':
        body = <Message />
        break;
      case '/stay-in-the-loop':
        body = <StayInTheLoop />;
        break;
      case '/pre-register':
        body = <PreRegister />;
        break;
      case '/learn-more':
        body = <LearnMore />;
        break;
      case '/learn-more/why-local':
        body = <WhyLocal />;
        break;
      case '/learn-more/team':
        body = <AboutTheTeam />
        break;
      case '/learn-more/pricing':
        body = <Pricing />;
        break;
      case '/regenerative-community':
        body = <RegenerativeCommunity />;
        break;
      case '/not-found':
        body = <NotFound />
        break;
      default:
        App.gotoPage('/not-found');
    }

    const colorFraction = 0.5 * sunHeightFraction + 0.5;
    const alphaFraction = 0.1 * sunHeightFraction + 0.4;
    // color translated to rgba from primaryBright
    const rootStyle = null; // {backgroundColor: `rgba(${255 * colorFraction}, ${252 * colorFraction}, ${223 * colorFraction}, ${alphaFraction})`}
    return (
      <div id="root" style={rootStyle}>
        <DemoModeContext.Provider value={isDemoMode}>
          <PhoneModeContext.Provider value={isPhoneMode}>
            <SunProgressContext.Provider value={sunPosition}>
              <MenuPositionContext.Provider value={menuActualPosition}>
                <TransitionProgressContext.Provider value={overlayProgress}>
                  {body}
                </TransitionProgressContext.Provider>
              </MenuPositionContext.Provider>
            </SunProgressContext.Provider>
          </PhoneModeContext.Provider>
        </DemoModeContext.Provider>
      </div>
    );
  }
})();
