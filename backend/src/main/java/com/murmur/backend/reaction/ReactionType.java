package com.murmur.backend.reaction;

public enum ReactionType {
    EMPATHY("공감해요"),
    FUNNY("ㅋㅋㅋ"),
    CHEER("힘내요");

    private final String label;

    ReactionType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
