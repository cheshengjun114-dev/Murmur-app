import { Link } from 'react-router-dom';
import { getCategorySlug } from '../categories/categoryUtils.js';

export function CategoryTabs({ categories, activeCategoryId }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        className={`rounded-[8px] px-4 py-2 text-sm font-semibold ${
          activeCategoryId ? 'border border-stone-300 bg-white text-stone-700' : 'bg-[#17443f] text-white'
        }`}
        to="/"
      >
        전체
      </Link>
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId;

        return (
          <Link
            className={`rounded-[8px] px-4 py-2 text-sm font-semibold ${
              isActive ? 'bg-[#17443f] text-white' : 'border border-stone-300 bg-white text-stone-700'
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
