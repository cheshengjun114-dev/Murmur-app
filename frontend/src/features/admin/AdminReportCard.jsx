import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  blindReportedPost,
  deleteReportedPost,
  getReportDetails,
  unblindReportedPost,
} from './adminReportApi.js';
import { formatDateTime } from '../posts/dateUtils.js';

export function AdminReportCard({ post }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const queryClient = useQueryClient();

  const detailsQuery = useQuery({
    queryKey: ['admin-report-details', post.postId],
    queryFn: () => getReportDetails(post.postId),
    enabled: detailsOpen,
  });

  const blindMutation = useMutation({
    mutationFn: () => blindReportedPost(post.postId),
    onSuccess: invalidateReports,
  });

  const unblindMutation = useMutation({
    mutationFn: () => unblindReportedPost(post.postId),
    onSuccess: invalidateReports,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteReportedPost(post.postId),
    onSuccess: invalidateReports,
  });

  function invalidateReports() {
    queryClient.invalidateQueries({ queryKey: ['admin-reported-posts'] });
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    queryClient.invalidateQueries({ queryKey: ['post', String(post.postId)] });
  }

  function handleDelete() {
    if (window.confirm('신고된 게시글을 삭제 처리하시겠습니까?')) {
      deleteMutation.mutate();
    }
  }

  const isMutating = blindMutation.isPending || unblindMutation.isPending || deleteMutation.isPending;

  return (
    <article className="rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-[8px] bg-[#eef5ef] px-2.5 py-1 text-[#17443f]">{post.categoryName}</span>
            <span className={post.blinded ? 'text-red-700' : 'text-stone-500'}>
              {post.blinded ? '숨김 처리됨' : '노출 중'}
            </span>
            <span className="text-stone-500">신고 {post.reportCount}건</span>
          </div>

          <Link className="mt-3 block text-xl font-semibold text-stone-950 hover:text-[#17443f]" to={`/posts/${post.postId}`}>
            {post.title}
          </Link>

          <p className="mt-3 max-h-12 overflow-hidden whitespace-pre-wrap text-sm leading-6 text-stone-600">{post.content}</p>

          <dl className="mt-4 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-stone-900">작성자 내부 정보</dt>
              <dd className="mt-1">
                ID {post.authorId} · {post.authorEmail} · {post.authorNickname}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-stone-900">최근 신고</dt>
              <dd className="mt-1">{formatDateTime(post.lastReportedAt)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-[8px] border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={() => setDetailsOpen((current) => !current)}
          >
            {detailsOpen ? '사유 접기' : '사유 보기'}
          </button>
          {post.blinded ? (
            <button
              className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={isMutating}
              onClick={() => unblindMutation.mutate()}
            >
              숨김 해제
            </button>
          ) : (
            <button
              className="rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={isMutating}
              onClick={() => blindMutation.mutate()}
            >
              숨김
            </button>
          )}
          <button
            className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            disabled={isMutating}
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </div>

      {detailsOpen && (
        <div className="mt-5 border-t border-stone-100 pt-4">
          {detailsQuery.isLoading && <p className="text-sm text-stone-500">신고 사유를 불러오는 중입니다.</p>}

          {detailsQuery.isError && (
            <p className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              신고 사유를 불러오지 못했습니다.
            </p>
          )}

          {detailsQuery.data?.length > 0 && (
            <ul className="divide-y divide-stone-200">
              {detailsQuery.data.map((report) => (
                <li className="py-3" key={report.reportId}>
                  <div className="flex flex-wrap justify-between gap-2 text-xs font-semibold text-stone-500">
                    <span>
                      신고자 ID {report.reporterId} · {report.reporterEmail} · {report.reporterNickname}
                    </span>
                    <span>{formatDateTime(report.reportedAt)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-800">{report.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
