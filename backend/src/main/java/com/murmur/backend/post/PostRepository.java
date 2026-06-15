package com.murmur.backend.post;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {

    @EntityGraph(attributePaths = {"user", "category"})
    @Query("""
            select p
            from Post p
            where p.deletedAt is null
              and (:categoryId is null or p.category.id = :categoryId)
            """)
    Page<Post> findPosts(@Param("categoryId") Long categoryId, Pageable pageable);

    @EntityGraph(attributePaths = {"user", "category"})
    @Query("""
            select p
            from Post p
            where p.id = :postId
              and p.deletedAt is null
            """)
    Optional<Post> findActiveById(@Param("postId") Long postId);
}
