const Button = ({ text, icon, disabled, onClick }) => {
  return <button onClick={onClick} disabled={disabled}>{icon && <span>{icon}</span>} {text}</button>
}

export default Button;