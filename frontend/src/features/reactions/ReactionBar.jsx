import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { getReactionSummary, toggleReaction } from './reactionApi.js';

export function ReactionBar({ postId }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const reactionQuery = useQuery({
    queryKey: ['reactionSummary', postId],
    queryFn: () => getReactionSummary(postId),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleReaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reactionSummary', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  function handleReaction(reactionType) {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    toggleMutation.mutate({ postId, reactionType });
  }

  const reactions = reactionQuery.data?.reactions ?? [];

  return (
    <section className="mt-10 border-t border-stone-200 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-950">반응</h2>
        <span className="text-sm text-stone-500">총 {reactionQuery.data?.totalCount ?? 0}개</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {reactions.map((reaction) => (
          <button
            className={`rounded-[8px] border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              reaction.reactedByMe
                ? 'border-[#17443f] bg-[#17443f] text-white'
                : 'border-stone-300 bg-white text-stone-700 hover:border-[#17443f]'
            }`}
            key={reaction.reactionType}
            type="button"
            disabled={toggleMutation.isPending}
            onClick={() => handleReaction(reaction.reactionType)}
          >
            {reaction.label} {reaction.count}
          </button>
        ))}
      </div>

      {reactionQuery.isError && (
        <p className="mt-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          반응을 불러오지 못했습니다.
        </p>
      )}
    </section>
  );
}
