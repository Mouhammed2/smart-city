package com.busway.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException forRoute(Long id) {
        return new ResourceNotFoundException("Route not found with id: " + id);
    }

    public static ResourceNotFoundException forStop(Long id) {
        return new ResourceNotFoundException("Stop not found with id: " + id);
    }

    public static ResourceNotFoundException forBus(Long id) {
        return new ResourceNotFoundException("Bus not found with id: " + id);
    }

    public static ResourceNotFoundException forUser(String username) {
        return new ResourceNotFoundException("User not found with username: " + username);
    }
}