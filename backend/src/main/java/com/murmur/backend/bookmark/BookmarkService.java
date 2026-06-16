package com.murmur.backend.bookmark;

import com.murmur.backend.bookmark.dto.BookmarkToggleResponse;
import com.murmur.backend.comment.CommentRepository;
import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.post.Post;
import com.murmur.backend.post.PostRepository;
import com.murmur.backend.post.dto.PostListResponse;
import com.murmur.backend.reaction.ReactionRepository;
import com.murmur.backend.user.User;
import com.murmur.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;

    @Transactional
    public BookmarkToggleResponse toggleBookmark(Long postId, Long userId) {
        Post post = getPost(postId);
        User user = getUser(userId);

        bookmarkRepository.findByPostIdAndUserId(postId, userId)
                .ifPresentOrElse(
                        bookmarkRepository::delete,
                        () -> bookmarkRepository.save(Bookmark.create(user, post))
                );

        boolean bookmarked = bookmarkRepository.existsByPostIdAndUserId(postId, userId);

        return new BookmarkToggleResponse(
                post.getId(),
                bookmarked,
                bookmarkRepository.countByPostId(postId)
        );
    }

    @Transactional(readOnly = true)
    public Page<PostListResponse> getMyBookmarks(Long userId, Pageable pageable) {
        getUser(userId);

        return bookmarkRepository.findActiveBookmarksByUserId(userId, pageable)
                .map(bookmark -> {
                    Post post = bookmark.getPost();
                    return PostListResponse.from(
                            post,
                            commentRepository.countByPostIdAndDeletedAtIsNull(post.getId()),
                            reactionRepository.countByPostId(post.getId())
                    );
                });
    }

    private Post getPost(Long postId) {
        return postRepository.findActiveById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }
}
