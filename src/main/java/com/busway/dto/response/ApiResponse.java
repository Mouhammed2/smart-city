package com.busway.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Only include non-null fields in JSON
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private String path;
    private Integer statusCode;

    // Constructor for simple responses
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    // ========== STATIC FACTORY METHODS ==========

    /**
     * Success response with data
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Operation successful", data);
    }

    /**
     * Success response with custom message and data
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    /**
     * Success response with message only (no data)
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }

    /**
     * Error response with message
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    /**
     * Error response with message and status code
     */
    public static <T> ApiResponse<T> error(String message, Integer statusCode) {
        ApiResponse<T> response = new ApiResponse<>(false, message, null);
        response.setStatusCode(statusCode);
        return response;
    }

    /**
     * Error response with detailed information
     */
    public static <T> ApiResponse<T> error(String message, String path, Integer statusCode) {
        ApiResponse<T> response = new ApiResponse<>(false, message, null);
        response.setPath(path);
        response.setStatusCode(statusCode);
        return response;
    }

    // ========== BUILDER METHOD ==========

    public static <T> ApiResponseBuilder<T> builder() {
        return new ApiResponseBuilder<>();
    }

    // Custom builder class
    public static class ApiResponseBuilder<T> {
        private boolean success;
        private String message;
        private T data;
        private LocalDateTime timestamp = LocalDateTime.now();
        private String path;
        private Integer statusCode;

        public ApiResponseBuilder<T> success(boolean success) {
            this.success = success;
            return this;
        }

        public ApiResponseBuilder<T> message(String message) {
            this.message = message;
            return this;
        }

        public ApiResponseBuilder<T> data(T data) {
            this.data = data;
            return this;
        }

        public ApiResponseBuilder<T> path(String path) {
            this.path = path;
            return this;
        }

        public ApiResponseBuilder<T> statusCode(Integer statusCode) {
            this.statusCode = statusCode;
            return this;
        }

        public ApiResponse<T> build() {
            ApiResponse<T> response = new ApiResponse<>();
            response.setSuccess(this.success);
            response.setMessage(this.message);
            response.setData(this.data);
            response.setTimestamp(this.timestamp);
            response.setPath(this.path);
            response.setStatusCode(this.statusCode);
            return response;
        }
    }
}