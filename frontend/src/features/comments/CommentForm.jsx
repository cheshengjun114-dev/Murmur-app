export function CommentForm({
  value,
  placeholder,
  submitLabel,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <textarea
        className="min-h-24 w-full resize-y rounded-[8px] border border-stone-300 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#17443f] focus:ring-4 focus:ring-emerald-900/10"
        maxLength={1000}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-stone-500">{value.length}/1000</span>
        <div className="flex gap-2">
          {onCancel && (
            <button
              className="rounded-[8px] border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
              type="button"
              onClick={onCancel}
            >
              취소
            </button>
          )}
          <button
            className="rounded-[8px] bg-[#17443f] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-300"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
