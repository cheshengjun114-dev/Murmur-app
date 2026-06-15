export function PostForm({
  categories,
  form,
  formError,
  isSubmitting,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form className="mt-8 space-y-5 rounded-[8px] border border-stone-200 bg-white p-6 shadow-sm" onSubmit={onSubmit}>
      <label className="block" htmlFor="categoryId">
        <span className="text-sm font-medium text-stone-800">카테고리</span>
        <select
          className="mt-2 h-12 w-full rounded-[8px] border border-stone-300 bg-white px-4 text-base outline-none focus:border-[#17443f] focus:ring-4 focus:ring-emerald-900/10"
          id="categoryId"
          value={form.categoryId}
          onChange={onChange('categoryId')}
        >
          <option value="">카테고리 선택</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block" htmlFor="title">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-stone-800">제목</span>
          <span className="text-xs text-stone-500">{form.title.length}/100</span>
        </div>
        <input
          className="mt-2 h-12 w-full rounded-[8px] border border-stone-300 bg-white px-4 text-base outline-none focus:border-[#17443f] focus:ring-4 focus:ring-emerald-900/10"
          id="title"
          maxLength={100}
          placeholder="제목을 입력하세요"
          value={form.title}
          onChange={onChange('title')}
        />
      </label>

      <label className="block" htmlFor="content">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-stone-800">내용</span>
          <span className="text-xs text-stone-500">{form.content.length}/2000</span>
        </div>
        <textarea
          className="mt-2 min-h-72 w-full resize-y rounded-[8px] border border-stone-300 bg-white px-4 py-3 text-base leading-7 outline-none focus:border-[#17443f] focus:ring-4 focus:ring-emerald-900/10"
          id="content"
          maxLength={2000}
          placeholder="익명으로 나누고 싶은 이야기를 적어주세요"
          value={form.content}
          onChange={onChange('content')}
        />
      </label>

      {formError && (
        <p className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <button
          className="rounded-[8px] border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 hover:border-stone-500"
          type="button"
          onClick={onCancel}
        >
          취소
        </button>
        <button
          className="rounded-[8px] bg-[#17443f] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-300"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
