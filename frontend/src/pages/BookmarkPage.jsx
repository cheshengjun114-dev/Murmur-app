import { useQuery } from '@tanstack/react-query';
import { PageShell } from '../components/PageShell.jsx';
import { getMyBookmarks } from '../features/bookmarks/bookmarkApi.js';
import { PostList } from '../features/posts/PostList.jsx';

export function BookmarkPage() {
  const bookmarksQuery = useQuery({
    queryKey: ['bookmarks', { page: 0 }],
    queryFn: () => getMyBookmarks({ page: 0, size: 10 }),
  });

  return (
    <PageShell>
      <section className="py-10">
        <div>
          <p className="text-sm font-bold text-[#c15d35]">북마크</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-stone-950">저장한 이야기</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            나중에 다시 읽고 싶은 익명 이야기를 모아둡니다.
          </p>
        </div>

        <section className="mt-6">
          <PostList
            posts={bookmarksQuery.data?.content ?? []}
            isLoading={bookmarksQuery.isLoading}
            errorMessage={bookmarksQuery.isError ? '북마크 목록을 불러오지 못했습니다.' : ''}
            emptyTitle="저장한 게시글이 없습니다."
            emptyDescription="게시글 상세 화면에서 저장 버튼을 눌러 북마크에 추가하세요."
          />
        </section>
      </section>
    </PageShell>
  );
}
