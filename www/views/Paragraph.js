function Paragraph({style, className, id, children}) {
  const body = typeof children == 'string' ? children.trim() : children;
  return <p className={className} id={id} style={style}>{body}</p>
}