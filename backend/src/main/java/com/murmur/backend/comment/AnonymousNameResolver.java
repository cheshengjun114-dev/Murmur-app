package com.murmur.backend.comment;

import com.murmur.backend.post.Post;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class AnonymousNameResolver {

    public Map<Long, String> resolve(Post post, List<Comment> comments) {
        Map<Long, String> anonymousNames = new HashMap<>();
        Long postOwnerId = post.getUser().getId();
        anonymousNames.put(postOwnerId, "익명1(글쓴이)");

        int nextAnonymousNumber = 2;

        for (Comment comment : comments) {
            Long userId = comment.getUser().getId();

            if (!anonymousNames.containsKey(userId)) {
                anonymousNames.put(userId, "익명" + nextAnonymousNumber);
                nextAnonymousNumber++;
            }
        }

        return anonymousNames;
    }
}
