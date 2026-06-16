import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell.jsx';
import { formatDateTime } from '../features/posts/dateUtils.js';
import { PostList } from '../features/posts/PostList.jsx';
import { getMyPosts, getMyProfile } from '../features/users/myApi.js';

export function MyPage() {
  const profileQuery = useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
  });

  const myPostsQuery = useQuery({
    queryKey: ['my-posts', { page: 0 }],
    queryFn: () => getMyPosts({ page: 0, size: 10 }),
  });

  const profile = profileQuery.data;

  return (
    <PageShell>
      <section className="py-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold text-[#c15d35]">마이페이지</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-stone-950">내 활동 관리</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              익명으로 보이지만, 내 글은 계정 기준으로 안전하게 관리됩니다.
            </p>
          </div>
          <Link className="rounded-[8px] bg-[#17443f] px-5 py-3 text-sm font-semibold text-white" to="/posts/new">
            글쓰기
          </Link>
        </div>

        {profileQuery.isLoading && (
          <div className="mt-6 h-36 animate-pulse rounded-[8px] border border-stone-200 bg-white" />
        )}

        {profileQuery.isError && (
          <p className="mt-6 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            내 정보를 불러오지 못했습니다.
          </p>
        )}

        {profile && (
          <>
            <section className="mt-6 rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-stone-950">{profile.nickname}</p>
                  <p className="mt-1 text-sm text-stone-500">{profile.email}</p>
                  <p className="mt-3 text-xs font-semibold text-stone-500">
                    가입일 {formatDateTime(profile.createdAt)} · 권한 {profile.role}
                  </p>
                </div>
                <Link
                  className="rounded-[8px] border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:border-stone-500"
                  to="/bookmarks"
                >
                  북마크 보기
                </Link>
              </div>
            </section>

            <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ActivityMetric label="작성 글" value={profile.postCount} />
              <ActivityMetric label="작성 댓글" value={profile.commentCount} />
              <ActivityMetric label="북마크" value={profile.bookmarkCount} />
            </section>
          </>
        )}

        <section className="mt-8">
          <div className="mb-4">
            <p className="text-sm font-bold text-[#c15d35]">내가 쓴 글</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">수정과 삭제가 가능한 글</h2>
          </div>
          <PostList
            posts={myPostsQuery.data?.content ?? []}
            isLoading={myPostsQuery.isLoading}
            errorMessage={myPostsQuery.isError ? '내가 쓴 글을 불러오지 못했습니다.' : ''}
            emptyTitle="아직 작성한 글이 없습니다."
            emptyDescription="첫 번째 익명 이야기를 남겨보세요."
          />
        </section>
      </section>
    </PageShell>
  );
}

function ActivityMetric({ label, value }) {
  return (
    <div className="rounded-[8px] border border-stone-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-stone-950">{value}</p>
    </div>
  );
}
