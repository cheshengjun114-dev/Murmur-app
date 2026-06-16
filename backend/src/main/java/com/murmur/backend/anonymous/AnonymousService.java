package com.murmur.backend.anonymous;

import com.murmur.backend.post.Post;
import com.murmur.backend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnonymousService {

    private final AnonymousMappingRepository anonymousMappingRepository;

    public String getOrCreateLabel(Post post, User user) {
        AnonymousMapping mapping = getOrCreate(post, user);

        if (post.isOwner(user.getId())) {
            return "익명" + mapping.getAnonymousNumber() + "(글쓴이)";
        }

        return "익명" + mapping.getAnonymousNumber();
    }

    public AnonymousMapping getOrCreate(Post post, User user) {
        return anonymousMappingRepository.findByPostIdAndUserId(post.getId(), user.getId())
                .orElseGet(() -> createMapping(post, user));
    }

    private AnonymousMapping createMapping(Post post, User user) {
        int anonymousNumber;

        if (post.isOwner(user.getId())) {
            anonymousNumber = 1;
        } else {
            ensureAuthorMapping(post);
            anonymousNumber = anonymousMappingRepository.findMaxAnonymousNumberByPostId(post.getId()) + 1;
        }

        AnonymousMapping mapping = AnonymousMapping.create(post, user, anonymousNumber);
        return anonymousMappingRepository.save(mapping);
    }

    private void ensureAuthorMapping(Post post) {
        anonymousMappingRepository.findByPostIdAndUserId(post.getId(), post.getUser().getId())
                .orElseGet(() -> anonymousMappingRepository.save(AnonymousMapping.create(post, post.getUser(), 1)));
    }
}
