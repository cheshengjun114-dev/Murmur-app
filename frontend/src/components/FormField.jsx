export function FormField({ id, label, type = 'text', value, onChange, placeholder, autoComplete }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-medium text-stone-800">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 h-12 w-full rounded-[8px] border border-stone-300 bg-white px-4 text-base text-stone-950 outline-none transition focus:border-[#17443f] focus:ring-4 focus:ring-emerald-900/10"
      />
    </label>
  );
}
