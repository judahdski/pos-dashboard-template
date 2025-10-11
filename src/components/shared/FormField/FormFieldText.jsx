import { useRef } from "react";
import { randomDigitGen } from "./utils";

export const FormFieldText = (
  type,
  {
    id,
    icon,
    label,
    placeholder = "Type here",
    name,
    value,
    defaultValue,
    helperText,
    onChange,
    onBlur,
    onFocus,
    onAbort,
    required = false,
    disabled = false,
    readOnly = false,
    className,
    style
  }) => {
  const timeoutID = useRef(null);

  const ID = !id ? `${randomDigitGen()}-${type.toString().toLowerCase()}` : id;

  const onChangeHandler = (event) => {
    if (timeoutID.current) clearTimeout(timeoutID.current);

    timeoutID.current = setTimeout(() => {
      // validate input
      onChange(event);
    }, 2000);
  }

  const onBlurHandler = (event) => {
    onBlur(event);
  }

  const onFocusHandler = (event) => {
    onFocus(event);
  }

  const onAbortHandler = (event) => {
    onAbort(event);
  }

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="text"
        id={ID}
        name={name}
        value={value ?? defaultValue}
        placeholder={placeholder}
        className={`input input-bordered ${className}`}
        onChange={(e) => onChangeHandler(e)}
        onBlur={(e) => onBlurHandler(e)}
        onFocus={(e) => onFocusHandler(e)}
        onAbort={(e) => onAbortHandler(e)}
        style={style}
        readOnly={readOnly}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}