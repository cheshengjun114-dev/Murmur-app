import { Link } from 'react-router-dom';
import { formatDateTime } from './dateUtils.js';

export function PostCard({ post }) {
  return (
    <Link
      className="block rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm transition hover:border-[#17443f] hover:shadow-md"
      to={`/posts/${post.id}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-[8px] bg-[#eef5ef] px-3 py-1 text-xs font-bold text-[#17443f]">{post.categoryName}</span>
        <span className="text-xs text-stone-500">{formatDateTime(post.createdAt)}</span>
      </div>
      <h2 className="mt-3 text-xl font-semibold leading-7 text-stone-950">{post.title}</h2>
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
    </Link>
  );
}
