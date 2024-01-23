function Menu({children}) {
  const menuPosition = useContext(MenuPositionContext);
  const isPhoneMode = useContext(PhoneModeContext);
  const style = (!isPhoneMode && menuPosition !== null) ? menuPosition : null;
  // console.log('menu Style:', style);
  return (
    <div id="menu" style={style}>
      {children}
    </div>
 );
}