package com.murmur.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @NotBlank(message = "이메일은 필수입니다.")
        String email,

        @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
        @NotBlank(message = "비밀번호는 필수입니다.")
        String password,

        @Size(min = 2, max = 20, message = "닉네임은 2자 이상 20자 이하로 입력해야 합니다.")
        @NotBlank(message = "닉네임은 필수입니다.")
        String nickname
) {
}
