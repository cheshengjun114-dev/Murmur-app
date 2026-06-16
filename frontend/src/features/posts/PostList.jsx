import { PostCard } from './PostCard.jsx';

export function PostList({
  posts,
  isLoading,
  errorMessage,
  emptyTitle = '아직 게시글이 없습니다.',
  emptyDescription = '첫 번째 익명 이야기를 남겨보세요.',
  showRank = false,
  showPopularScore = false,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-32 animate-pulse rounded-[8px] border border-stone-200 bg-white" key={index} />
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return <p className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>;
  }

  if (!posts?.length) {
    return (
      <div className="rounded-[8px] border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
        <p className="text-base font-semibold text-stone-800">{emptyTitle}</p>
        <p className="mt-2 text-sm text-stone-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          rank={showRank ? index + 1 : undefined}
          showPopularScore={showPopularScore}
        />
      ))}
    </div>
  );
}
