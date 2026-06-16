package com.murmur.backend.post;

import static org.assertj.core.api.Assertions.assertThat;

import com.murmur.backend.category.Category;
import com.murmur.backend.category.CategoryRepository;
import com.murmur.backend.comment.CommentService;
import com.murmur.backend.comment.dto.CommentCreateRequest;
import com.murmur.backend.post.dto.PostCreateRequest;
import com.murmur.backend.post.dto.PostCreateResponse;
import com.murmur.backend.post.dto.PostListResponse;
import com.murmur.backend.reaction.ReactionService;
import com.murmur.backend.reaction.ReactionType;
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
class PostServiceTest {

    @Autowired
    private PostService postService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private ReactionService reactionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void popularPostsAreSortedByViewCommentAndReactionScore() {
        Category category = categoryRepository.findAll().get(0);
        User author = saveUser("popular-author@test.com", "작성자");
        User commenter = saveUser("popular-commenter@test.com", "댓글러");
        User reactor = saveUser("popular-reactor@test.com", "반응러");

        PostCreateResponse viewedPost = postService.createPost(
                author.getId(),
                new PostCreateRequest(category.getId(), "조회수만 높은 글", "조회수만 있는 글입니다.")
        );
        PostCreateResponse activePost = postService.createPost(
                author.getId(),
                new PostCreateRequest(category.getId(), "참여가 많은 글", "댓글과 반응이 있는 글입니다.")
        );

        postService.getPost(viewedPost.postId(), null);
        postService.getPost(viewedPost.postId(), null);
        postService.getPost(viewedPost.postId(), null);

        commentService.createComment(
                activePost.postId(),
                commenter.getId(),
                new CommentCreateRequest(null, "첫 번째 댓글")
        );
        commentService.createComment(
                activePost.postId(),
                author.getId(),
                new CommentCreateRequest(null, "글쓴이 댓글")
        );
        reactionService.toggleReaction(activePost.postId(), reactor.getId(), ReactionType.EMPATHY);

        Page<PostListResponse> popularPosts = postService.getPopularPosts(null, PageRequest.of(0, 5));

        assertThat(popularPosts.getContent())
                .extracting(PostListResponse::title)
                .containsSubsequence("참여가 많은 글", "조회수만 높은 글");
        assertThat(popularPosts.getContent().get(0).popularScore()).isGreaterThan(3L);
    }

    private User saveUser(String email, String nickname) {
        return userRepository.save(User.createUser(email, "encoded-password", nickname));
    }
}
