const G = {
  timestampOnLoad: Date.now(),
  typeOf: function typeOf(param) {
    return Array.isArray(param) ? 'array' : typeof param;
  },
  isEmpty: function isEmpty(param) {
    const paramType = G.typeOf(param);
    switch(paramType) {
      case 'string':
      case 'array':
        return param.length == 0;
      case 'object':
        return G.isEmpty(Object.keys(param));
      default:
        throw Error(`unhandled type: ${paramType}`)
    }
  },
  first: function first(param) {
    const paramType = G.typeOf(param);
    switch(paramType) {
      case 'string':
      case 'array':
        return param[0];
      default:
        throw Error(`unhandled type: ${paramType}`)
    }
  },
  last: function last(param) {
    const paramType = G.typeOf(param);
    switch(paramType) {
      case 'string':
      case 'array':
        return param[param.length - 1];
      default:
        throw Error(`unhandled type: ${paramType}`)
    }
  },
  isWhitespace: function isWhitespace(str) {
    return G.isEmpty(str.trim());
  },
  getCurrentPageFromUrl: function getCurrentPageFromUrl(url) {
    if (url == '/' || url == '') {
      return '/';
    } else if (url && url[0] == '/') {
      return url;
    } else {
      throw new Error(`unrecognized url: ${url}`)
    }
  },
  getCurrentPage: function getCurrentPage() {
    return G.getCurrentPageFromUrl(window.location.pathname)
  },
  scrollToRef: function scrollToRef(ref) {
    G.async(() => {
      ref.current.scrollIntoView({behavior: "smooth"});
    });
  },
  async: function async(fn) {
    setTimeout(() => requestAnimationFrame(fn), 1);
  },
  convertRemToPixels: function convertRemToPixels(rem) {    
      return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  },
  randomIntBetween: function randomIntBetween(min, max) {
    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    // The maximum is exclusive and the minimum is inclusive
  },
};
