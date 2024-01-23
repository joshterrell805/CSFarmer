function SubTitle({style, children, id}) {
  return <h2 style={style} id={id || 'sub-title'}>{children}</h2>;
}