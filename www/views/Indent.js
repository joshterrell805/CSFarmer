function Indent({id, className, factor, style, children}) {
  return <div id={id} className={className} style={{paddingLeft: (factor || 1) + 'rem', ...style}}>{children}</div>
}