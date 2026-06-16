package com.murmur.backend.bookmark;

import static org.assertj.core.api.Assertions.assertThat;

import com.murmur.backend.bookmark.dto.BookmarkToggleResponse;
import com.murmur.backend.category.Category;
import com.murmur.backend.category.CategoryRepository;
import com.murmur.backend.post.PostService;
import com.murmur.backend.post.dto.PostCreateRequest;
import com.murmur.backend.post.dto.PostCreateResponse;
import com.murmur.backend.post.dto.PostDetailResponse;
import com.murmur.backend.post.dto.PostListResponse;
import com.murmur.backend.user.User;
import com.murmur.backend.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BookmarkServiceTest {

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private PostService postService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void toggleBookmarkSavesAndRemovesPostForUser() {
        Category category = categoryRepository.findAll().get(0);
        User author = saveUser("bookmark-author@test.com", "작성자");
        User reader = saveUser("bookmark-reader@test.com", "독자");
        PostCreateResponse post = postService.createPost(
                author.getId(),
                new PostCreateRequest(category.getId(), "저장하고 싶은 글", "나중에 다시 볼 글입니다.")
        );

        PostDetailResponse beforeBookmark = postService.getPost(post.postId(), reader.getId());

        BookmarkToggleResponse saved = bookmarkService.toggleBookmark(post.postId(), reader.getId());
        PostDetailResponse afterBookmark = postService.getPost(post.postId(), reader.getId());
        Page<PostListResponse> bookmarks = bookmarkService.getMyBookmarks(reader.getId(), PageRequest.of(0, 10));

        BookmarkToggleResponse removed = bookmarkService.toggleBookmark(post.postId(), reader.getId());
        Page<PostListResponse> emptyBookmarks = bookmarkService.getMyBookmarks(reader.getId(), PageRequest.of(0, 10));

        assertThat(beforeBookmark.bookmarked()).isFalse();
        assertThat(saved.bookmarked()).isTrue();
        assertThat(saved.bookmarkCount()).isEqualTo(1L);
        assertThat(afterBookmark.bookmarked()).isTrue();
        assertThat(bookmarks.getContent())
                .extracting(PostListResponse::title)
                .contains("저장하고 싶은 글");
        assertThat(removed.bookmarked()).isFalse();
        assertThat(removed.bookmarkCount()).isZero();
        assertThat(emptyBookmarks.getContent()).isEmpty();
    }

    private User saveUser(String email, String nickname) {
        return userRepository.save(User.createUser(email, "encoded-password", nickname));
    }
}
