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
    <form className="mt-8 space-y-5 rounded-[8px] border border-[#efd8ce] bg-[#fffdfb] p-6 shadow-sm" onSubmit={onSubmit}>
      <label className="block" htmlFor="categoryId">
        <span className="text-sm font-semibold text-[#5f4037]">카테고리</span>
        <select
          className="mt-2 h-12 w-full rounded-[8px] border border-[#e7d6cf] bg-white px-4 text-base outline-none focus:border-[#df8063] focus:ring-4 focus:ring-[#e47758]/10"
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
          <span className="text-sm font-semibold text-[#5f4037]">제목</span>
          <span className="text-xs text-stone-500">{form.title.length}/100</span>
        </div>
        <input
          className="mt-2 h-12 w-full rounded-[8px] border border-[#e7d6cf] bg-white px-4 text-base outline-none focus:border-[#df8063] focus:ring-4 focus:ring-[#e47758]/10"
          id="title"
          maxLength={100}
          placeholder="제목을 입력하세요"
          value={form.title}
          onChange={onChange('title')}
        />
      </label>

      <label className="block" htmlFor="content">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-[#5f4037]">내용</span>
          <span className="text-xs text-stone-500">{form.content.length}/2000</span>
        </div>
        <textarea
          className="mt-2 min-h-72 w-full resize-y rounded-[8px] border border-[#e7d6cf] bg-white px-4 py-3 text-base leading-7 outline-none focus:border-[#df8063] focus:ring-4 focus:ring-[#e47758]/10"
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
          className="rounded-[8px] border border-[#e7d6cf] bg-white px-5 py-3 text-sm font-semibold text-[#76584e] hover:border-[#d98b70]"
          type="button"
          onClick={onCancel}
        >
          취소
        </button>
        <button
          className="rounded-[8px] bg-[#e47758] px-5 py-3 text-sm font-bold text-white hover:bg-[#cf6447] disabled:cursor-not-allowed disabled:bg-[#d8c7c0]"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
