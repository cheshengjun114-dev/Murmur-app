import { Link } from 'react-router-dom';
import { getCategorySlug } from '../categories/categoryUtils.js';

export function CategoryTabs({ categories, activeCategoryId }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
          activeCategoryId
            ? 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700'
            : 'bg-violet-600 text-white shadow-sm'
        }`}
        to="/"
      >
        전체
      </Link>
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId;

        return (
          <Link
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-violet-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700'
            }`}
            key={category.id}
            to={`/categories/${getCategorySlug(category.name)}`}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
