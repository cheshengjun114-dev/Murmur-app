import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../components/PageShell.jsx';
import { deletePost, getPost } from '../features/posts/postApi.js';
import { formatDateTime } from '../features/posts/dateUtils.js';

export function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/');
    },
  });

  function handleDelete() {
    if (window.confirm('게시글을 삭제하시겠습니까?')) {
      deleteMutation.mutate(postId);
    }
  }

  const post = postQuery.data;

  return (
    <PageShell>
      <section className="py-10">
        {postQuery.isLoading && <div className="h-80 animate-pulse rounded-[8px] border border-stone-200 bg-white" />}

        {postQuery.isError && (
          <p className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            게시글을 불러오지 못했습니다.
          </p>
        )}

        {post && (
          <article className="rounded-[8px] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-[8px] bg-[#eef5ef] px-3 py-1 text-xs font-bold text-[#17443f]">
                  {post.categoryName}
                </span>
                <span className="text-sm text-stone-500">익명1(글쓴이)</span>
                <span className="text-sm text-stone-500">{formatDateTime(post.createdAt)}</span>
              </div>
              {post.authorAnonymous && (
                <div className="flex gap-2">
                  <Link
                    className="rounded-[8px] border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
                    to={`/posts/${post.id}/edit`}
                  >
                    수정
                  </Link>
                  <button
                    className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            <h1 className="mt-5 text-3xl font-semibold leading-tight text-stone-950">{post.title}</h1>
            <dl className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500">
              <div className="flex gap-1">
                <dt>조회</dt>
                <dd>{post.viewCount}</dd>
              </div>
              <div className="flex gap-1">
                <dt>댓글</dt>
                <dd>{post.commentCount}</dd>
              </div>
              <div className="flex gap-1">
                <dt>반응</dt>
                <dd>{post.reactionCount}</dd>
              </div>
            </dl>

            {post.blinded ? (
              <p className="mt-8 rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-5 text-sm font-semibold text-amber-800">
                {post.content}
              </p>
            ) : (
              <p className="mt-8 whitespace-pre-wrap text-base leading-8 text-stone-800">{post.content}</p>
            )}

            <section className="mt-10 border-t border-stone-200 pt-6">
              <h2 className="text-lg font-semibold text-stone-950">댓글과 반응</h2>
              <p className="mt-2 text-sm text-stone-500">댓글과 반응 기능은 6~7일차에 연결합니다.</p>
            </section>
          </article>
        )}
      </section>
    </PageShell>
  );
}
