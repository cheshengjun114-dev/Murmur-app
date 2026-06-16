package com.murmur.backend.post;

import com.murmur.backend.anonymous.AnonymousService;
import com.murmur.backend.category.Category;
import com.murmur.backend.category.CategoryRepository;
import com.murmur.backend.comment.CommentRepository;
import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.post.dto.PostCreateRequest;
import com.murmur.backend.post.dto.PostCreateResponse;
import com.murmur.backend.post.dto.PostDetailResponse;
import com.murmur.backend.post.dto.PostListResponse;
import com.murmur.backend.post.dto.PostUpdateRequest;
import com.murmur.backend.reaction.ReactionRepository;
import com.murmur.backend.user.User;
import com.murmur.backend.user.UserRepository;
import com.murmur.backend.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final AnonymousService anonymousService;

    @Transactional
    public PostCreateResponse createPost(Long userId, PostCreateRequest request) {
        User user = getUser(userId);
        Category category = getCategory(request.categoryId());

        Post post = Post.create(user, category, request.title(), request.content());
        Post savedPost = postRepository.save(post);
        anonymousService.getOrCreate(savedPost, user);

        return new PostCreateResponse(savedPost.getId());
    }

    @Transactional(readOnly = true)
    public Page<PostListResponse> getPosts(Long categoryId, Pageable pageable) {
        return postRepository.findPosts(categoryId, pageable)
                .map(post -> PostListResponse.from(
                        post,
                        commentRepository.countByPostIdAndDeletedAtIsNull(post.getId()),
                        reactionRepository.countByPostId(post.getId())
                ));
    }

    @Transactional
    public PostDetailResponse getPost(Long postId, Long currentUserId) {
        Post post = getActivePost(postId);
        post.increaseViewCount();

        return PostDetailResponse.from(
                post,
                currentUserId,
                commentRepository.countByPostIdAndDeletedAtIsNull(post.getId()),
                reactionRepository.countByPostId(post.getId())
        );
    }

    @Transactional
    public void updatePost(Long postId, Long userId, PostUpdateRequest request) {
        Post post = getActivePost(postId);

        if (!post.isOwner(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        Category category = getCategory(request.categoryId());
        post.update(category, request.title(), request.content());
    }

    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = getActivePost(postId);
        User currentUser = getUser(userId);

        if (!post.isOwner(userId) && currentUser.getRole() != UserRole.ADMIN) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        post.softDelete();
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    private Post getActivePost(Long postId) {
        return postRepository.findActiveById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    }
}
