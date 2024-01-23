const TitleBar = (() => {
  
  function Sun() {
    // sun starts at bottom left, off screen (as-if facing south)
    // initial position is: top: 100%, left: 0
    // mid position is: top: -sunHeight*0.55, left: calc(50% + sunWidth*0.5)
    // end position is: top: 100%, left: calc(100% + sunWidth)
    const {sunCompletedFraction, sunHeightFraction} = useContext(SunProgressContext);
    
    const sunEl = document.getElementById('sun');
    let sunStyle = null;
    if (sunEl != null) {
      const sunRect = sunEl.getBoundingClientRect();
      const [sunWidth, sunHeight] = [sunRect.width, sunRect.height];
      const xFraction = sunCompletedFraction;
      const yFraction = sunHeightFraction;

      sunStyle = {
        top: `-${sunHeight*0.55*yFraction}px`,
        left: `calc(${xFraction*100}% + ${sunWidth * xFraction}px)`,
      }
    }
    return <div id="sun" style={sunStyle}/>;
  }

  return function TitleBar({noClick, children, hideTitle}) {
    return (
      <div id="title-bar">
        <Sun/>
        <div id="title-container">
          <h1
              id="title"
              style={hideTitle ? {display: 'none'} : null}
              className={noClick ? null : 'clickable'}
              onClick={() => !noClick && App.gotoPage('/')}
          >CSFarmer</h1>
          {children}
        </div>
      </div>
    );
  }
})();