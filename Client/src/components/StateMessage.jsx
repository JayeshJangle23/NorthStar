export default function StateMessage({ title, children, action }) {
  return <div className="state-message"><div className="state-symbol">✳</div><h2>{title}</h2>{children && <p>{children}</p>}{action}</div>;
}
