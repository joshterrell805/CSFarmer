
const UsageEmitter = (() => {

  let unsavedEvents = [];
  let nextOrderNum = 1;
  function getCurrentLocation() { return window.location + ''; }
  function emitEvent(type, info, screenState) {
    let event = {
      "pageLoadId": LoadMetadata.pageLoadId,
      "order": nextOrderNum++,
      type,
      "context": {
        "location": getCurrentLocation(),
        "timestamp": Date.now(),
        "screenState": screenState || null,
      },
      info,
    };
    unsavedEvents.push(event);
  }

  function UsageEmitter() {
    this.emitPageLoaded = function emitPageLoaded() {
      let info = {
        locationOnLoad: LoadMetadata.locationOnLoad,
        siteLoadedTimestamp: LoadMetadata.siteLoadedTimestamp,
        appVersion: LoadMetadata.appVersion,
        referrer: LoadMetadata.referrer,
        userAgent: LoadMetadata.userAgent,
      };
      let screenState = App._getScreenState();
      emitEvent("PageLoaded", info, screenState);
    };

    this.emitButtonPressed = function emitButtonPressed(buttonId) {
      let info = {buttonId};
      emitEvent("ButtonPressed", info);
    };

    this.emitLinkClicked = function emitLinkClicked(linkId) {
      let info = {linkId};
      emitEvent("LinkClicked", info);
    }

    this.emitErrorUncaught = function emitErrorUncaught(message, stackTrace) {
      let info = {message, stackTrace};
      emitEvent("ErrorUncaught", info);
    }

    this.emitScreenResized = function emitScreenResized() {
      emitEvent("ScreenResized", null, App._getScreenState());
    }

    this.emitPageChanged = function emitPageChanged() {
      emitEvent("PageChanged", null);
    }

    this.emitPageScrolled = function emitPageScrolled(visiblePercent, scrollPercent) {
      let info = {visiblePercent, scrollPercent};
      emitEvent("PageScrolled", info);
    }
  }


  function randomShort() { return G.randomIntBetween(500, 1500) }
  function randomLong() { return G.randomIntBetween(2000, 8000) }
  function submit() {
    let timeout = null;
    if (unsavedEvents.length > 0) {
      timeout = randomLong();
      submitEvents(unsavedEvents);
      unsavedEvents = [];
    } else {
      timeout = randomShort();
    }
    setTimeout(submit, timeout);
  }
  setTimeout(submit, randomShort());
  function submitEvents(events) {
    const request = {
      requestId: randomUUID(),
      newEvents: events,
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", Urls.usageServer + "/events");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(request));
  }



  return new UsageEmitter({})
})();