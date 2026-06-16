import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { reportPost } from './reportApi.js';

export function ReportButton({ postId }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const reportMutation = useMutation({
    mutationFn: reportPost,
    onSuccess: (response) => {
      setReason('');
      setMessage(response.blinded ? '신고가 접수되어 게시글이 블라인드 처리되었습니다.' : '신고가 접수되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      setMessage(error.response?.data?.message ?? '신고 처리에 실패했습니다.');
    },
  });

  function openReportDialog() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setMessage('');
    setIsOpen(true);
  }

  function submitReport(event) {
    event.preventDefault();
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setMessage('신고 사유를 입력해주세요.');
      return;
    }

    reportMutation.mutate({ postId, reason: trimmedReason });
  }

  return (
    <div>
      <button
        className="rounded-[8px] border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:border-red-300 hover:text-red-700"
        type="button"
        onClick={openReportDialog}
      >
        신고
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <form className="w-full max-w-md rounded-[8px] bg-white p-6 shadow-xl" onSubmit={submitReport}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-stone-950">게시글 신고</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">운영자가 검토할 수 있도록 신고 사유를 적어주세요.</p>
              </div>
              <button
                className="rounded-[8px] px-2 py-1 text-sm font-semibold text-stone-500 hover:bg-stone-100"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                닫기
              </button>
            </div>

            <textarea
              className="mt-5 min-h-32 w-full resize-y rounded-[8px] border border-stone-300 px-4 py-3 text-sm leading-6 outline-none focus:border-[#17443f] focus:ring-4 focus:ring-emerald-900/10"
              maxLength={500}
              placeholder="신고 사유를 입력하세요"
              value={reason}
              onChange={(event) => {
                setMessage('');
                setReason(event.target.value);
              }}
            />
            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-stone-500">
              <span>중복 신고와 본인 글 신고는 제한됩니다.</span>
              <span>{reason.length}/500</span>
            </div>

            {message && (
              <p className="mt-3 rounded-[8px] border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">{message}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                className="rounded-[8px] border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                취소
              </button>
              <button
                className="rounded-[8px] bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-300"
                type="submit"
                disabled={reportMutation.isPending}
              >
                {reportMutation.isPending ? '신고 중...' : '신고하기'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
