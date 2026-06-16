package com.murmur.backend.anonymous;

import com.murmur.backend.common.entity.BaseTimeEntity;
import com.murmur.backend.post.Post;
import com.murmur.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(
        name = "anonymous_mappings",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_anonymous_mapping_post_user",
                        columnNames = {"post_id", "user_id"}
                )
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnonymousMapping extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int anonymousNumber;

    private AnonymousMapping(Post post, User user, int anonymousNumber) {
        this.post = post;
        this.user = user;
        this.anonymousNumber = anonymousNumber;
    }

    public static AnonymousMapping create(Post post, User user, int anonymousNumber) {
        return new AnonymousMapping(post, user, anonymousNumber);
    }
}
