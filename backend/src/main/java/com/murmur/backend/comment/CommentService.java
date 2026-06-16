package com.murmur.backend.comment;

import com.murmur.backend.anonymous.AnonymousService;
import com.murmur.backend.comment.dto.CommentCreateRequest;
import com.murmur.backend.comment.dto.CommentCreateResponse;
import com.murmur.backend.comment.dto.CommentResponse;
import com.murmur.backend.comment.dto.CommentUpdateRequest;
import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.post.Post;
import com.murmur.backend.post.PostRepository;
import com.murmur.backend.user.User;
import com.murmur.backend.user.UserRepository;
import com.murmur.backend.user.UserRole;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final AnonymousService anonymousService;

    @Transactional
    public CommentCreateResponse createComment(Long postId, Long userId, CommentCreateRequest request) {
        Post post = getPost(postId);
        User user = getUser(userId);
        Comment parentComment = getParentComment(postId, request.parentCommentId());
        anonymousService.getOrCreate(post, user);

        Comment comment = Comment.create(post, user, parentComment, request.content());
        Comment savedComment = commentRepository.save(comment);

        return new CommentCreateResponse(savedComment.getId());
    }

    @Transactional
    public List<CommentResponse> getComments(Long postId, Long currentUserId) {
        Post post = getPost(postId);
        List<Comment> comments = commentRepository.findActiveCommentsByPostId(postId);
        anonymousService.getOrCreate(post, post.getUser());
        Map<Long, String> anonymousNames = comments.stream()
                .map(Comment::getUser)
                .distinct()
                .collect(Collectors.toMap(
                        User::getId,
                        user -> anonymousService.getOrCreateLabel(post, user),
                        (left, right) -> left
                ));
        anonymousNames.put(post.getUser().getId(), anonymousService.getOrCreateLabel(post, post.getUser()));

        return comments.stream()
                .filter(comment -> !comment.isReply())
                .map(comment -> toResponse(comment, comments, anonymousNames, currentUserId))
                .toList();
    }

    @Transactional
    public void updateComment(Long commentId, Long userId, CommentUpdateRequest request) {
        Comment comment = getComment(commentId);

        if (!comment.isOwner(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        comment.update(request.content());
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = getComment(commentId);
        User currentUser = getUser(userId);

        if (!comment.isOwner(userId) && currentUser.getRole() != UserRole.ADMIN) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        comment.softDelete();
    }

    private CommentResponse toResponse(
            Comment comment,
            List<Comment> allComments,
            Map<Long, String> anonymousNames,
            Long currentUserId
    ) {
        List<CommentResponse> replies = allComments.stream()
                .filter(reply -> reply.getParentComment() != null)
                .filter(reply -> reply.getParentComment().getId().equals(comment.getId()))
                .map(reply -> toResponse(reply, allComments, anonymousNames, currentUserId))
                .toList();

        Long authorId = comment.getUser().getId();
        boolean mine = currentUserId != null && authorId.equals(currentUserId);

        return CommentResponse.from(comment, anonymousNames.get(authorId), mine, replies);
    }

    private Comment getParentComment(Long postId, Long parentCommentId) {
        if (parentCommentId == null) {
            return null;
        }

        Comment parentComment = getComment(parentCommentId);

        if (!parentComment.getPost().getId().equals(postId) || parentComment.isReply()) {
            throw new BusinessException(ErrorCode.INVALID_COMMENT_PARENT);
        }

        return parentComment;
    }

    private Post getPost(Long postId) {
        return postRepository.findActiveById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    private Comment getComment(Long commentId) {
        return commentRepository.findActiveById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
    }
}
