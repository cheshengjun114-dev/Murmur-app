import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { createComment, deleteComment, getComments, updateComment } from './commentApi.js';
import { CommentForm } from './CommentForm.jsx';
import { CommentItem } from './CommentItem.jsx';

export function CommentSection({ postId }) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [formError, setFormError] = useState('');

  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
  });

  function invalidateCommentData() {
    queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    queryClient.invalidateQueries({ queryKey: ['post', postId] });
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }

  const createMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      setContent('');
      setFormError('');
      invalidateCommentData();
    },
    onError: (error) => {
      setFormError(error.response?.data?.message ?? '댓글 작성에 실패했습니다.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: invalidateCommentData,
    onError: (error) => {
      setFormError(error.response?.data?.message ?? '댓글 수정에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: invalidateCommentData,
    onError: (error) => {
      setFormError(error.response?.data?.message ?? '댓글 삭제에 실패했습니다.');
    },
  });

  function submitComment(event) {
    event.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setFormError('댓글 내용을 입력해주세요.');
      return;
    }

    createMutation.mutate({ postId, content: trimmedContent });
  }

  function createReply(parentCommentId, replyContent, onSuccess) {
    createMutation.mutate(
      { postId, parentCommentId, content: replyContent },
      {
        onSuccess: () => {
          setFormError('');
          invalidateCommentData();
          onSuccess?.();
        },
        onError: (error) => {
          setFormError(error.response?.data?.message ?? '답글 작성에 실패했습니다.');
        },
      },
    );
  }

  function updateExistingComment(commentId, nextContent, onSuccess) {
    updateMutation.mutate(
      { commentId, content: nextContent },
      {
        onSuccess: () => {
          invalidateCommentData();
          onSuccess?.();
        },
      },
    );
  }

  function deleteExistingComment(commentId) {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      deleteMutation.mutate(commentId);
    }
  }

  const comments = commentsQuery.data ?? [];
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <section className="mt-10 border-t border-stone-200 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-950">댓글</h2>
        <span className="text-sm text-stone-500">{comments.length}개</span>
      </div>

      <div className="mt-4">
        {isAuthenticated ? (
          <CommentForm
            value={content}
            placeholder="댓글을 입력하세요"
            submitLabel="댓글 작성"
            isSubmitting={createMutation.isPending}
            onChange={(value) => {
              setFormError('');
              setContent(value);
            }}
            onSubmit={submitComment}
          />
        ) : (
          <div className="rounded-[8px] border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-600">
            <Link className="font-semibold text-[#17443f] underline-offset-4 hover:underline" to="/login">
              로그인
            </Link>
            후 댓글을 작성할 수 있습니다.
          </div>
        )}

        {formError && (
          <p className="mt-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {commentsQuery.isLoading && (
          <>
            <div className="h-24 animate-pulse rounded-[8px] border border-stone-200 bg-white" />
            <div className="h-24 animate-pulse rounded-[8px] border border-stone-200 bg-white" />
          </>
        )}

        {commentsQuery.isError && (
          <p className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            댓글을 불러오지 못했습니다.
          </p>
        )}

        {!commentsQuery.isLoading && comments.length === 0 && (
          <p className="rounded-[8px] border border-dashed border-stone-300 bg-white px-5 py-8 text-center text-sm text-stone-500">
            아직 댓글이 없습니다.
          </p>
        )}

        {comments.map((comment) => (
          <CommentItem
            comment={comment}
            isAuthenticated={isAuthenticated}
            isSubmitting={isSubmitting}
            key={comment.id}
            onCreateReply={createReply}
            onUpdate={updateExistingComment}
            onDelete={deleteExistingComment}
          />
        ))}
      </div>
    </section>
  );
}
