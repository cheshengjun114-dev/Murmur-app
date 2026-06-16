package com.murmur.backend.user;

import static org.assertj.core.api.Assertions.assertThat;

import com.murmur.backend.bookmark.BookmarkService;
import com.murmur.backend.category.Category;
import com.murmur.backend.category.CategoryRepository;
import com.murmur.backend.comment.CommentService;
import com.murmur.backend.comment.dto.CommentCreateRequest;
import com.murmur.backend.post.PostService;
import com.murmur.backend.post.dto.PostCreateRequest;
import com.murmur.backend.post.dto.PostCreateResponse;
import com.murmur.backend.post.dto.PostListResponse;
import com.murmur.backend.user.dto.MyProfileResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void myPageProfileShowsMyActivityCountsAndPosts() {
        Category category = categoryRepository.findAll().get(0);
        User me = saveUser("mypage-me@test.com", "나");
        User other = saveUser("mypage-other@test.com", "다른사람");

        PostCreateResponse myFirstPost = postService.createPost(
                me.getId(),
                new PostCreateRequest(category.getId(), "내 첫 번째 글", "내가 작성한 글입니다.")
        );
        postService.createPost(
                me.getId(),
                new PostCreateRequest(category.getId(), "내 두 번째 글", "내가 작성한 또 다른 글입니다.")
        );
        PostCreateResponse otherPost = postService.createPost(
                other.getId(),
                new PostCreateRequest(category.getId(), "다른 사람 글", "다른 사람이 작성한 글입니다.")
        );

        commentService.createComment(
                otherPost.postId(),
                me.getId(),
                new CommentCreateRequest(null, "내가 남긴 댓글")
        );
        bookmarkService.toggleBookmark(otherPost.postId(), me.getId());

        MyProfileResponse profile = userService.getMyProfile(me.getId());
        Page<PostListResponse> myPosts = userService.getMyPosts(me.getId(), PageRequest.of(0, 10));

        assertThat(profile.email()).isEqualTo("mypage-me@test.com");
        assertThat(profile.postCount()).isEqualTo(2L);
        assertThat(profile.commentCount()).isEqualTo(1L);
        assertThat(profile.bookmarkCount()).isEqualTo(1L);
        assertThat(myPosts.getContent())
                .extracting(PostListResponse::title)
                .contains("내 첫 번째 글", "내 두 번째 글")
                .doesNotContain("다른 사람 글");
        assertThat(myPosts.getContent())
                .extracting(PostListResponse::id)
                .contains(myFirstPost.postId());
    }

    private User saveUser(String email, String nickname) {
        return userRepository.save(User.createUser(email, "encoded-password", nickname));
    }
}
