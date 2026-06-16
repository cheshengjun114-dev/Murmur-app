import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { PageShell } from '../components/PageShell.jsx';
import { getCategories } from '../features/categories/categoryApi.js';
import { findCategoryBySlug } from '../features/categories/categoryUtils.js';
import { CategoryTabs } from '../features/posts/CategoryTabs.jsx';
import { getPopularPosts, getPosts } from '../features/posts/postApi.js';
import { PostList } from '../features/posts/PostList.jsx';

export function CategoryPage() {
  const { category: categorySlug } = useParams();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categories = categoriesQuery.data ?? [];
  const selectedCategory = findCategoryBySlug(categories, categorySlug);

  const postsQuery = useQuery({
    queryKey: ['posts', { categoryId: selectedCategory?.id ?? null, page: 0 }],
    queryFn: () => getPosts({ categoryId: selectedCategory.id, page: 0, size: 10 }),
    enabled: Boolean(selectedCategory?.id),
  });

  const popularPostsQuery = useQuery({
    queryKey: ['popular-posts', { categoryId: selectedCategory?.id ?? null, page: 0 }],
    queryFn: () => getPopularPosts({ categoryId: selectedCategory.id, page: 0, size: 5 }),
    enabled: Boolean(selectedCategory?.id),
  });

  return (
    <PageShell>
      <div className="py-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold text-[#c15d35]">카테고리</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950">
              {selectedCategory ? `${selectedCategory.name} 이야기` : '카테고리를 찾는 중'}
            </h1>
          </div>
          <Link className="rounded-[8px] bg-[#17443f] px-5 py-3 text-sm font-semibold text-white" to="/posts/new">
            글쓰기
          </Link>
        </div>

        <div className="mt-8">
          <CategoryTabs categories={categories} activeCategoryId={selectedCategory?.id} />
        </div>

        <section className="mt-8">
          <div className="mb-4">
            <p className="text-sm font-bold text-[#c15d35]">인기글</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">
              {selectedCategory ? `${selectedCategory.name} 인기 이야기` : '인기 이야기'}
            </h2>
          </div>
          <PostList
            posts={popularPostsQuery.data?.content ?? []}
            isLoading={categoriesQuery.isLoading || popularPostsQuery.isLoading}
            errorMessage={popularPostsQuery.isError ? '카테고리 인기글을 불러오지 못했습니다.' : ''}
            emptyTitle="아직 카테고리 인기글이 없습니다."
            emptyDescription="조회, 댓글, 반응이 쌓이면 이곳에 표시됩니다."
            showRank
            showPopularScore
          />
        </section>

        <section className="mt-6">
          <div className="mb-4">
            <p className="text-sm font-bold text-[#c15d35]">최신글</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">
              {selectedCategory ? `${selectedCategory.name} 최신 이야기` : '최신 이야기'}
            </h2>
          </div>
          <PostList
            posts={postsQuery.data?.content ?? []}
            isLoading={categoriesQuery.isLoading || postsQuery.isLoading}
            errorMessage={
              categoriesQuery.isError || postsQuery.isError || (!categoriesQuery.isLoading && !selectedCategory)
                ? '카테고리 게시글을 불러오지 못했습니다.'
                : ''
            }
          />
        </section>
      </div>
    </PageShell>
  );
}
