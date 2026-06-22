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
          ? 'border-[#e47758] bg-[#e47758] text-white'
          : 'border-[#e7d6cf] bg-white text-[#76584e] hover:border-[#df8063]'
      }`}
      type="button"
      disabled={bookmarkMutation.isPending}
      onClick={() => bookmarkMutation.mutate()}
    >
      {bookmarked ? '저장됨' : '저장'}
    </button>
  );
}
