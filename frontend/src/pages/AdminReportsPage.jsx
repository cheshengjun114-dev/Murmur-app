import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageShell } from '../components/PageShell.jsx';
import { AdminReportCard } from '../features/admin/AdminReportCard.jsx';
import { getReportedPosts } from '../features/admin/adminReportApi.js';

export function AdminReportsPage() {
  const [blindedOnly, setBlindedOnly] = useState(false);

  const reportsQuery = useQuery({
    queryKey: ['admin-reported-posts', { blindedOnly, page: 0 }],
    queryFn: () => getReportedPosts({ blindedOnly, page: 0, size: 10 }),
  });

  const posts = reportsQuery.data?.content ?? [];

  return (
    <PageShell>
      <section className="py-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold text-[#c15d35]">관리자</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-stone-950">신고 게시글 관리</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              신고 누적 글을 확인하고 숨김, 해제, 삭제 처리를 진행합니다.
            </p>
          </div>

          <div className="flex rounded-[8px] border border-stone-300 bg-white p-1">
            <button
              className={`rounded-[8px] px-4 py-2 text-sm font-semibold ${
                !blindedOnly ? 'bg-[#17443f] text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
              type="button"
              onClick={() => setBlindedOnly(false)}
            >
              전체 신고
            </button>
            <button
              className={`rounded-[8px] px-4 py-2 text-sm font-semibold ${
                blindedOnly ? 'bg-[#17443f] text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
              type="button"
              onClick={() => setBlindedOnly(true)}
            >
              숨김 글
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryBox label="신고 글" value={reportsQuery.data?.totalElements ?? 0} />
          <SummaryBox label="현재 필터" value={blindedOnly ? '숨김 글' : '전체 신고'} />
          <SummaryBox label="페이지" value={`${(reportsQuery.data?.number ?? 0) + 1} / ${reportsQuery.data?.totalPages || 1}`} />
        </div>

        <div className="mt-6 space-y-4">
          {reportsQuery.isLoading && (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="h-48 animate-pulse rounded-[8px] border border-stone-200 bg-white" key={index} />
              ))}
            </>
          )}

          {reportsQuery.isError && (
            <p className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              신고 목록을 불러오지 못했습니다. 관리자 계정인지 확인하세요.
            </p>
          )}

          {!reportsQuery.isLoading && !reportsQuery.isError && posts.length === 0 && (
            <div className="rounded-[8px] border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
              <p className="text-base font-semibold text-stone-800">표시할 신고 게시글이 없습니다.</p>
              <p className="mt-2 text-sm text-stone-500">신고가 접수되면 이 화면에 표시됩니다.</p>
            </div>
          )}

          {posts.map((post) => (
            <AdminReportCard key={post.postId} post={post} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function SummaryBox({ label, value }) {
  return (
    <div className="rounded-[8px] border border-stone-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold text-stone-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-stone-950">{value}</p>
    </div>
  );
}
