export const FormFieldNumber = ({ label, placeholder = "Type here", name, value, helperText }) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="number"
        name={name}
        value={value}
        placeholder={placeholder}
        className="input input-bordered"
      />
    </div>
  );
}