package com.murmur.backend.reaction;

import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.post.Post;
import com.murmur.backend.post.PostRepository;
import com.murmur.backend.reaction.dto.ReactionCountResponse;
import com.murmur.backend.reaction.dto.ReactionSummaryResponse;
import com.murmur.backend.user.User;
import com.murmur.backend.user.UserRepository;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReactionSummaryResponse toggleReaction(Long postId, Long userId, ReactionType reactionType) {
        Post post = getPost(postId);
        User user = getUser(userId);

        reactionRepository.findByPostIdAndUserIdAndReactionType(postId, userId, reactionType)
                .ifPresentOrElse(
                        reactionRepository::delete,
                        () -> reactionRepository.save(Reaction.create(post, user, reactionType))
                );

        return getReactionSummary(postId, userId);
    }

    @Transactional(readOnly = true)
    public ReactionSummaryResponse getReactionSummary(Long postId, Long currentUserId) {
        getPost(postId);
        Set<ReactionType> myReactionTypes = getMyReactionTypes(postId, currentUserId);

        List<ReactionCountResponse> reactions = EnumSet.allOf(ReactionType.class)
                .stream()
                .map(reactionType -> new ReactionCountResponse(
                        reactionType,
                        reactionType.getLabel(),
                        reactionRepository.countByPostIdAndReactionType(postId, reactionType),
                        myReactionTypes.contains(reactionType)
                ))
                .toList();

        return new ReactionSummaryResponse(reactionRepository.countByPostId(postId), reactions);
    }

    private Set<ReactionType> getMyReactionTypes(Long postId, Long currentUserId) {
        if (currentUserId == null) {
            return Set.of();
        }

        return reactionRepository.findByPostIdAndUserId(postId, currentUserId)
                .stream()
                .map(Reaction::getReactionType)
                .collect(Collectors.toSet());
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
