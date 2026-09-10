package com.example.kavachdms.dto.custodyEvent;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateCustodyEventRequest {

    @NotNull
    private Long evidenceId;

    private Long fromHolder;

    private Long toHolder;

    @NotNull
    private Long transferredBy;

    private String fromLocation;

    @NotBlank
    private String toLocation;

    @NotBlank
    private String eventType;

    public Long getEvidenceId() {
        return evidenceId;
    }

    public void setEvidenceId(Long evidenceId) {
        this.evidenceId = evidenceId;
    }

    public Long getFromHolder() {
        return fromHolder;
    }

    public void setFromHolder(Long fromHolder) {
        this.fromHolder = fromHolder;
    }

    public Long getToHolder() {
        return toHolder;
    }

    public void setToHolder(Long toHolder) {
        this.toHolder = toHolder;
    }

    public Long getTransferredBy() {
        return transferredBy;
    }

    public void setTransferredBy(Long transferredBy) {
        this.transferredBy = transferredBy;
    }

    public String getFromLocation() {
        return fromLocation;
    }

    public void setFromLocation(String fromLocation) {
        this.fromLocation = fromLocation;
    }

    public String getToLocation() {
        return toLocation;
    }

    public void setToLocation(String toLocation) {
        this.toLocation = toLocation;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }
}