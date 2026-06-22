import { Link } from 'react-router-dom';
import { formatDateTime } from './dateUtils.js';

export function PostCard({ post, rank, showPopularScore = false }) {
  const isPopular = Boolean(rank);

  return (
    <Link
      className={`block border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md ${
        isPopular ? 'border-l-[3px] border-l-violet-600' : 'rounded-[8px]'
      }`}
      to={`/posts/${post.id}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {rank && <span className="text-sm font-extrabold text-violet-600">#{rank}</span>}
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{post.categoryName}</span>
          <span className="text-xs text-slate-400">{formatDateTime(post.createdAt)}</span>
        </div>
        {showPopularScore && (
          <span className="rounded-[8px] bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600">
            점수 {post.popularScore}
          </span>
        )}
      </div>
      <h2 className="mt-3 text-lg font-bold leading-7 text-slate-900">{post.title}</h2>
      <dl className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-400">
        <div className="flex items-center gap-1">
          <dt aria-label="조회수">조회</dt>
          <dd>{post.viewCount}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt aria-label="댓글 수">댓글</dt>
          <dd>{post.commentCount}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt aria-label="반응 수">공감</dt>
          <dd>{post.reactionCount}</dd>
        </div>
      </dl>
    </Link>
  );
}
