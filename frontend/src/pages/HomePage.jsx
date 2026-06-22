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
        <section className="rounded-[8px] border border-[#efd8ce] bg-[#fffaf7] px-6 py-8 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
            <div>
              <p className="text-xs font-extrabold text-[#e47758]">익명 커뮤니티</p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#43251d]">
                혼자 담아두기엔
                <br />
                너무 무거운 이야기
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#9a6c5c]">
                말 못 했던 것들을
                <br />
                여기서 꺼내보세요.
              </p>
            </div>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#dfc7bd] bg-white px-5 text-sm font-bold text-[#4d332b] transition hover:border-[#df8063] hover:text-[#c45f43]"
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
            <h2 className="shrink-0 text-sm font-extrabold text-[#e47758]">인기글</h2>
            <div className="h-px w-full bg-[#efd8ce]" />
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
            <h2 className="shrink-0 text-sm font-extrabold text-[#e47758]">최신글</h2>
            <div className="h-px w-full bg-[#efd8ce]" />
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
