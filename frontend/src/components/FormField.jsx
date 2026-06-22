export function FormField({ id, label, type = 'text', value, onChange, placeholder, autoComplete }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-semibold text-[#5f4037]">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 h-12 w-full rounded-[8px] border border-[#e7d6cf] bg-white px-4 text-base text-[#43251d] outline-none transition placeholder:text-[#b7a39b] focus:border-[#df8063] focus:ring-4 focus:ring-[#e47758]/10"
      />
    </label>
  );
}
