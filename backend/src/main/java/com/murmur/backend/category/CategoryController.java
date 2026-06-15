package com.murmur.backend.category;

import com.murmur.backend.category.dto.CategoryResponse;
import com.murmur.backend.common.response.ApiResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getCategories() {
        List<CategoryResponse> categories = categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();

        return ApiResponse.ok(categories);
    }
}
