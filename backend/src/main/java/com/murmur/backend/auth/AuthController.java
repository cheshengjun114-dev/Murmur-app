package com.murmur.backend.auth;

import com.murmur.backend.common.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.ok("auth ok");
    }
}
