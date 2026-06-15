const CATEGORY_SLUGS = {
  회사: 'company',
  연애: 'love',
  고민: 'worry',
  일상: 'daily',
  썰: 'story',
  기타: 'etc',
};

export function getCategorySlug(categoryName) {
  return CATEGORY_SLUGS[categoryName] ?? String(categoryName).toLowerCase();
}

export function findCategoryBySlug(categories, slug) {
  return categories.find((category) => getCategorySlug(category.name) === slug);
}
