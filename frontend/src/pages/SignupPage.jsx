import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell.jsx';
import { FormField } from '../components/FormField.jsx';
import { signup } from '../features/auth/authApi.js';

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });
  const [formError, setFormError] = useState('');

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate('/login', {
        replace: true,
        state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' },
      });
    },
    onError: (error) => {
      setFormError(error.response?.data?.message ?? '회원가입에 실패했습니다.');
    },
  });

  function updateField(fieldName) {
    return (event) => {
      setFormError('');
      setForm((prevForm) => ({ ...prevForm, [fieldName]: event.target.value }));
    };
  }

  function validateForm() {
    if (!form.email || !form.password || !form.passwordConfirm || !form.nickname) {
      return '모든 항목을 입력해주세요.';
    }

    if (form.password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }

    if (form.password !== form.passwordConfirm) {
      return '비밀번호 확인이 일치하지 않습니다.';
    }

    if (form.nickname.length < 2 || form.nickname.length > 20) {
      return '닉네임은 2자 이상 20자 이하로 입력해주세요.';
    }

    return '';
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    signupMutation.mutate({
      email: form.email,
      password: form.password,
      nickname: form.nickname,
    });
  }

  return (
    <AuthShell
      title="회원가입"
      subtitle="공개 화면에서는 익명으로 보이지만, 수정과 삭제 권한 확인을 위해 계정이 필요합니다."
      footerText="이미 계정이 있나요?"
      footerLinkText="로그인"
      footerTo="/login"
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
          id="nickname"
          label="닉네임"
          value={form.nickname}
          onChange={updateField('nickname')}
          placeholder="2자 이상 20자 이하"
          autoComplete="nickname"
        />
        <FormField
          id="password"
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={updateField('password')}
          placeholder="8자 이상"
          autoComplete="new-password"
        />
        <FormField
          id="passwordConfirm"
          label="비밀번호 확인"
          type="password"
          value={form.passwordConfirm}
          onChange={updateField('passwordConfirm')}
          placeholder="비밀번호 다시 입력"
          autoComplete="new-password"
        />

        {formError && (
          <p className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
        )}

        <button
          className="h-12 w-full rounded-[8px] bg-[#17443f] px-4 text-base font-semibold text-white transition hover:bg-[#10342f] disabled:cursor-not-allowed disabled:bg-stone-300"
          type="submit"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </AuthShell>
  );
}
