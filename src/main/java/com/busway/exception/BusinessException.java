package com.busway.exception;

public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }

    public static BusinessException duplicateRouteNumber(String number) {
        return new BusinessException("Route number already exists: " + number);
    }

    public static BusinessException duplicateStopCode(String code) {
        return new BusinessException("Stop code already exists: " + code);
    }

    public static BusinessException invalidSchedule() {
        return new BusinessException("Arrival time must be after departure time");
    }
}