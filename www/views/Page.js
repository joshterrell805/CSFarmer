function Page({subtitle, children, id, menu, disableTitleClick, hideTitle}) {
  const transitionProgress = useContext(TransitionProgressContext);
  const transitionStyle = {opacity: 0.8 + 0.2 * transitionProgress};
  return (
    <>
      <TitleBar noClick={disableTitleClick} hideTitle={hideTitle}>
        {
          G.typeOf(subtitle) === 'string' ? (
            <SubTitle>{subtitle}</SubTitle>
          ) : (
            // TODO RP1: remove when all pages refactored to pass string.
            subtitle
          )
        }
      </TitleBar>
      <div id="content-and-menu">
        <div id="content-container">
          <div id="content">
            <div 
              className="page"
              id={id}
              style={transitionStyle}
            >
              {children}
            </div>
          </div>
        </div>
        <div id="menu-container">
          <div style={transitionStyle}>
            {menu}
          </div>
        </div>
      </div>
    </>
  );
}