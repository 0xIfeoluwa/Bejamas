export function CheckButton({ checked, onChange, label }) {
  return (
    <section className="checkbox">
      <label for="Category">
        <input type="checkbox" checked={checked} onClick={onChange} />
        {label}
      </label>
    </section>
  );
}