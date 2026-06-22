import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell.jsx';
import { getCategories } from '../features/categories/categoryApi.js';
import { CategoryTabs } from '../features/posts/CategoryTabs.jsx';
import { getPopularPosts, getPosts } from '../features/posts/postApi.js';
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

  const popularPostsQuery = useQuery({
    queryKey: ['popular-posts', { categoryId: null, page: 0 }],
    queryFn: () => getPopularPosts({ page: 0, size: 5 }),
  });

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-3xl py-7 sm:py-10">
        <section className="rounded-[8px] border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
            <div>
              <p className="text-xs font-extrabold text-violet-600">익명 커뮤니티</p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-slate-950">
                오늘 올라온
                <br />
                익명 이야기
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              회사, 연애, 고민, 일상 이야기를 부담 없이 둘러보세요.
              </p>
            </div>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-[8px] bg-violet-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700"
              to="/posts/new"
            >
              글쓰기
            </Link>
          </div>
        </section>

        <div className="mt-5">
          <CategoryTabs categories={categoriesQuery.data ?? []} activeCategoryId={null} />
        </div>

        <section className="mt-7">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="shrink-0 text-sm font-extrabold text-violet-600">인기글</h2>
            <div className="h-px w-full bg-slate-200" />
          </div>
          <PostList
            posts={popularPostsQuery.data?.content ?? []}
            isLoading={popularPostsQuery.isLoading}
            errorMessage={popularPostsQuery.isError ? '인기글을 불러오지 못했습니다.' : ''}
            emptyTitle="아직 인기글이 없습니다."
            emptyDescription="조회, 댓글, 반응이 쌓이면 이곳에 표시됩니다."
            showRank
            showPopularScore
          />
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="shrink-0 text-sm font-extrabold text-violet-600">최신글</h2>
            <div className="h-px w-full bg-slate-200" />
          </div>
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
