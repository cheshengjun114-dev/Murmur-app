package com.murmur.backend.user;

import com.murmur.backend.bookmark.BookmarkRepository;
import com.murmur.backend.comment.CommentRepository;
import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.post.Post;
import com.murmur.backend.post.PostRepository;
import com.murmur.backend.post.dto.PostListResponse;
import com.murmur.backend.reaction.ReactionRepository;
import com.murmur.backend.user.dto.MyProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final BookmarkRepository bookmarkRepository;

    @Transactional(readOnly = true)
    public MyProfileResponse getMyProfile(Long userId) {
        User user = getUser(userId);

        return MyProfileResponse.from(
                user,
                postRepository.countActivePostsByUserId(userId),
                commentRepository.countActiveCommentsByUserId(userId),
                bookmarkRepository.countActiveBookmarksByUserId(userId)
        );
    }

    @Transactional(readOnly = true)
    public Page<PostListResponse> getMyPosts(Long userId, Pageable pageable) {
        getUser(userId);

        return postRepository.findActivePostsByUserId(userId, pageable)
                .map(this::toPostListResponse);
    }

    private PostListResponse toPostListResponse(Post post) {
        return PostListResponse.from(
                post,
                commentRepository.countByPostIdAndDeletedAtIsNull(post.getId()),
                reactionRepository.countByPostId(post.getId())
        );
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }
}
