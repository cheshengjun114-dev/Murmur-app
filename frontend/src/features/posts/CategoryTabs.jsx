import { Link } from 'react-router-dom';
import { getCategorySlug } from '../categories/categoryUtils.js';

export function CategoryTabs({ categories, activeCategoryId }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
          activeCategoryId
            ? 'border border-[#efd8ce] bg-[#fffdfb] text-[#8b6558] hover:border-[#e6a28d] hover:text-[#b95f42]'
            : 'bg-[#e47758] text-white shadow-sm'
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
                ? 'bg-[#e47758] text-white shadow-sm'
                : 'border border-[#efd8ce] bg-[#fffdfb] text-[#8b6558] hover:border-[#e6a28d] hover:text-[#b95f42]'
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
