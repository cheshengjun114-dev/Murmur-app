import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../components/PageShell.jsx';
import { getCategories } from '../features/categories/categoryApi.js';
import { createPost, getPost, updatePost } from '../features/posts/postApi.js';
import { PostForm } from '../features/posts/PostForm.jsx';

const INITIAL_FORM = {
  categoryId: '',
  title: '',
  content: '',
};

export function PostEditorPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(postId);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: isEditMode,
  });

  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);

  useEffect(() => {
    if (!postQuery.data || categories.length === 0) {
      return;
    }

    const selectedCategory = categories.find((category) => category.name === postQuery.data.categoryName);

    setForm({
      categoryId: selectedCategory?.id ? String(selectedCategory.id) : '',
      title: postQuery.data.title,
      content: postQuery.data.content,
    });
    setIsDirty(false);
  }, [categories, postQuery.data]);

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate(`/posts/${response.postId}`);
    },
    onError: (error) => {
      setFormError(error.response?.data?.message ?? '게시글 작성에 실패했습니다.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      navigate(`/posts/${postId}`);
    },
    onError: (error) => {
      setFormError(error.response?.data?.message ?? '게시글 수정에 실패했습니다.');
    },
  });

  function updateField(fieldName) {
    return (event) => {
      setFormError('');
      setIsDirty(true);
      setForm((prevForm) => ({ ...prevForm, [fieldName]: event.target.value }));
    };
  }

  function validateForm() {
    if (!form.categoryId) {
      return '카테고리를 선택해주세요.';
    }

    if (!form.title.trim()) {
      return '제목을 입력해주세요.';
    }

    if (!form.content.trim()) {
      return '내용을 입력해주세요.';
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

    const request = {
      categoryId: Number(form.categoryId),
      title: form.title.trim(),
      content: form.content.trim(),
    };

    if (isEditMode) {
      updateMutation.mutate({ postId, request });
      return;
    }

    createMutation.mutate(request);
  }

  function handleCancel() {
    if (isDirty && !window.confirm('작성을 취소하시겠습니까?')) {
      return;
    }

    navigate(isEditMode ? `/posts/${postId}` : '/');
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <PageShell>
      <section className="py-10">
        <div>
          <p className="text-sm font-bold text-[#c15d35]">{isEditMode ? '게시글 수정' : '게시글 작성'}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950">
            {isEditMode ? '익명 글을 수정합니다' : '새 익명 글을 작성합니다'}
          </h1>
        </div>

        {(categoriesQuery.isLoading || postQuery.isLoading) && isEditMode ? (
          <div className="mt-8 h-96 animate-pulse rounded-[8px] border border-stone-200 bg-white" />
        ) : (
          <PostForm
            categories={categories}
            form={form}
            formError={formError}
            isSubmitting={isSubmitting}
            submitLabel={isEditMode ? '수정하기' : '작성하기'}
            onChange={updateField}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </section>
    </PageShell>
  );
}
