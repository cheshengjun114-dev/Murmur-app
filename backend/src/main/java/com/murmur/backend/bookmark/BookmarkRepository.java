package com.murmur.backend.bookmark;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    boolean existsByPostIdAndUserId(Long postId, Long userId);

    long countByPostId(Long postId);

    Optional<Bookmark> findByPostIdAndUserId(Long postId, Long userId);

    @Query("""
            select count(b)
            from Bookmark b
            where b.user.id = :userId
              and b.post.deletedAt is null
            """)
    long countActiveBookmarksByUserId(@Param("userId") Long userId);

    @EntityGraph(attributePaths = {"post", "post.category"})
    @Query("""
            select b
            from Bookmark b
            where b.user.id = :userId
              and b.post.deletedAt is null
            order by b.createdAt desc
            """)
    Page<Bookmark> findActiveBookmarksByUserId(@Param("userId") Long userId, Pageable pageable);
}
