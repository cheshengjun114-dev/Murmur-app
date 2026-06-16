import { useState } from 'react';
import { formatDateTime } from '../posts/dateUtils.js';
import { CommentForm } from './CommentForm.jsx';

export function CommentItem({
  comment,
  isReply = false,
  isAuthenticated,
  isSubmitting,
  onCreateReply,
  onUpdate,
  onDelete,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);

  function submitReply(event) {
    event.preventDefault();
    const content = replyContent.trim();

    if (!content) {
      return;
    }

    onCreateReply(comment.id, content, () => {
      setReplyContent('');
      setIsReplying(false);
    });
  }

  function submitEdit(event) {
    event.preventDefault();
    const content = editContent.trim();

    if (!content) {
      return;
    }

    onUpdate(comment.id, content, () => {
      setIsEditing(false);
    });
  }

  return (
    <div className={`${isReply ? 'ml-5 border-l border-stone-200 pl-4' : ''}`}>
      <article className="rounded-[8px] border border-stone-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <strong className="text-sm font-semibold text-stone-900">{comment.authorAnonymousName}</strong>
            <span className="text-xs text-stone-500">{formatDateTime(comment.createdAt)}</span>
          </div>
          {comment.mine && !comment.blinded && (
            <div className="flex gap-2">
              <button
                className="text-xs font-semibold text-stone-500 hover:text-stone-900"
                type="button"
                onClick={() => {
                  setEditContent(comment.content);
                  setIsEditing(true);
                }}
              >
                수정
              </button>
              <button
                className="text-xs font-semibold text-red-600 hover:text-red-800"
                type="button"
                onClick={() => onDelete(comment.id)}
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-3">
            <CommentForm
              value={editContent}
              placeholder="댓글 수정"
              submitLabel="수정"
              isSubmitting={isSubmitting}
              onChange={setEditContent}
              onSubmit={submitEdit}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">{comment.content}</p>
        )}

        {!isReply && isAuthenticated && !comment.blinded && (
          <button
            className="mt-3 text-xs font-semibold text-[#17443f] hover:underline"
            type="button"
            onClick={() => setIsReplying((value) => !value)}
          >
            답글
          </button>
        )}
      </article>

      {isReplying && (
        <div className="mt-3">
          <CommentForm
            value={replyContent}
            placeholder="답글을 입력하세요"
            submitLabel="답글 작성"
            isSubmitting={isSubmitting}
            onChange={setReplyContent}
            onSubmit={submitReply}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              comment={reply}
              isAuthenticated={isAuthenticated}
              isReply
              isSubmitting={isSubmitting}
              key={reply.id}
              onCreateReply={onCreateReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
