import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell.jsx';
import { getCategories } from '../features/categories/categoryApi.js';
import { CategoryTabs } from '../features/posts/CategoryTabs.jsx';
import { getPosts } from '../features/posts/postApi.js';
import { PostList } from '../features/posts/PostList.jsx';

export function HomePage() {
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const postsQuery = useQuery({
    queryKey: ['posts', { categoryId: null, page: 0 }],
    queryFn: () => getPosts({ page: 0, size: 10 }),
  });

  return (
    <PageShell>
      <div className="py-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold text-[#c15d35]">최신글</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950">오늘 올라온 익명 이야기</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
              회사, 연애, 고민, 일상 이야기를 부담 없이 둘러보세요.
            </p>
          </div>
          <Link className="rounded-[8px] bg-[#17443f] px-5 py-3 text-sm font-semibold text-white" to="/posts/new">
            글쓰기
          </Link>
        </div>

        <div className="mt-8">
          <CategoryTabs categories={categoriesQuery.data ?? []} activeCategoryId={null} />
        </div>

        <section className="mt-6">
          <PostList
            posts={postsQuery.data?.content ?? []}
            isLoading={postsQuery.isLoading}
            errorMessage={postsQuery.isError ? '게시글 목록을 불러오지 못했습니다.' : ''}
          />
        </section>
      </div>
    </PageShell>
  );
}
