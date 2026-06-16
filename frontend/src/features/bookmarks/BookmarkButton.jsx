import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookmark } from './bookmarkApi.js';

export function BookmarkButton({ postId, bookmarked }) {
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: () => toggleBookmark(postId),
    onSuccess: (response) => {
      queryClient.setQueryData(['post', String(postId)], (post) => {
        if (!post) {
          return post;
        }

        return {
          ...post,
          bookmarked: response.bookmarked,
        };
      });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  return (
    <button
      className={`rounded-[8px] border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
        bookmarked
          ? 'border-[#17443f] bg-[#17443f] text-white'
          : 'border-stone-300 bg-white text-stone-700 hover:border-stone-500'
      }`}
      type="button"
      disabled={bookmarkMutation.isPending}
      onClick={() => bookmarkMutation.mutate()}
    >
      {bookmarked ? '저장됨' : '저장'}
    </button>
  );
}
