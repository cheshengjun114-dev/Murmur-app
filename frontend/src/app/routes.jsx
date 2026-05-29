import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { SignupPage } from '../pages/SignupPage.jsx';
import { PostDetailPage } from '../pages/PostDetailPage.jsx';
import { PostEditorPage } from '../pages/PostEditorPage.jsx';
import { CategoryPage } from '../pages/CategoryPage.jsx';
import { MyPage } from '../pages/MyPage.jsx';
import { BookmarkPage } from '../pages/BookmarkPage.jsx';
import { AdminReportsPage } from '../pages/AdminReportsPage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/posts/new" element={<PostEditorPage />} />
      <Route path="/posts/:postId" element={<PostDetailPage />} />
      <Route path="/posts/:postId/edit" element={<PostEditorPage />} />
      <Route path="/categories/:category" element={<CategoryPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/bookmarks" element={<BookmarkPage />} />
      <Route path="/admin/reports" element={<AdminReportsPage />} />
    </Routes>
  );
}
