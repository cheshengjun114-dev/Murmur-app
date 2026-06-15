package com.murmur.backend.reaction;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {

    Optional<Reaction> findByPostIdAndUserIdAndReactionType(Long postId, Long userId, ReactionType reactionType);

    long countByPostId(Long postId);

    long countByPostIdAndReactionType(Long postId, ReactionType reactionType);

    List<Reaction> findByPostIdAndUserId(Long postId, Long userId);
}
