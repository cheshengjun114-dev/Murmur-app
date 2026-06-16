package com.murmur.backend.anonymous;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AnonymousMappingRepository extends JpaRepository<AnonymousMapping, Long> {

    Optional<AnonymousMapping> findByPostIdAndUserId(Long postId, Long userId);

    @Query("""
            select coalesce(max(am.anonymousNumber), 0)
            from AnonymousMapping am
            where am.post.id = :postId
            """)
    int findMaxAnonymousNumberByPostId(@Param("postId") Long postId);
}
