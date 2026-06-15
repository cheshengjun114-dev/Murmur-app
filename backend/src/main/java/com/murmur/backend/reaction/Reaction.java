package com.murmur.backend.reaction;

import com.murmur.backend.common.entity.BaseTimeEntity;
import com.murmur.backend.post.Post;
import com.murmur.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
        name = "reactions",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_reaction_post_user_type",
                        columnNames = {"post_id", "user_id", "reaction_type"}
                )
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reaction extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "reaction_type", nullable = false, length = 20)
    private ReactionType reactionType;

    private Reaction(Post post, User user, ReactionType reactionType) {
        this.post = post;
        this.user = user;
        this.reactionType = reactionType;
    }

    public static Reaction create(Post post, User user, ReactionType reactionType) {
        return new Reaction(post, user, reactionType);
    }
}
