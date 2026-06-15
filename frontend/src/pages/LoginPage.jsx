import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell.jsx';
import { FormField } from '../components/FormField.jsx';
import { login } from '../features/auth/authApi.js';
import { useAuth } from '../features/auth/AuthContext.jsx';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithTokens } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const successMessage = location.state?.message;

  const from = location.state?.from?.pathname ?? '/';

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (tokenResponse) => {
      loginWithTokens(tokenResponse);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      setFormError(error.response?.data?.message ?? '이메일 또는 비밀번호가 틀렸습니다.');
    },
  });

  function updateField(fieldName) {
    return (event) => {
      setFormError('');
      setForm((prevForm) => ({ ...prevForm, [fieldName]: event.target.value }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.email || !form.password) {
      setFormError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    loginMutation.mutate(form);
  }

  return (
    <AuthShell
      title="로그인"
      subtitle="익명으로 글을 쓰려면 계정 확인이 필요합니다."
      footerText="아직 계정이 없나요?"
      footerLinkText="회원가입"
      footerTo="/signup"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField
          id="email"
          label="이메일"
          type="email"
          value={form.email}
          onChange={updateField('email')}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <FormField
          id="password"
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={updateField('password')}
          placeholder="비밀번호 입력"
          autoComplete="current-password"
        />

        {successMessage && (
          <p className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {successMessage}
          </p>
        )}

        {formError && (
          <p className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
        )}

        <button
          className="h-12 w-full rounded-[8px] bg-[#17443f] px-4 text-base font-semibold text-white transition hover:bg-[#10342f] disabled:cursor-not-allowed disabled:bg-stone-300"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </button>

        <Link className="block text-center text-sm font-medium text-stone-500 hover:text-stone-900" to="/">
          홈으로 돌아가기
        </Link>
      </form>
    </AuthShell>
  );
}
