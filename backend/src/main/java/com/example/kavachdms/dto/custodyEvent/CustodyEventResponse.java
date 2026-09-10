package com.example.kavachdms.dto.custodyEvent;

import com.example.kavachdms.entity.CustodyEvent;

import java.time.LocalDateTime;

public class CustodyEventResponse {

    private Long custodyEventId;
    private Long evidenceId;
    private Long fromHolder;
    private Long toHolder;
    private Long transferredBy;
    private String fromLocation;
    private String toLocation;
    private String eventType;
    private LocalDateTime timestamp;

    public static CustodyEventResponse fromEntity(CustodyEvent event) {
        CustodyEventResponse response = new CustodyEventResponse();

        response.custodyEventId = event.getCustodyEventId();
        response.evidenceId = event.getEvidence().getEvidenceId();

        response.fromHolder = event.getFromHolder() != null
                ? event.getFromHolder().getUserId()
                : null;

        response.toHolder = event.getToHolder() != null
                ? event.getToHolder().getUserId()
                : null;

        response.transferredBy = event.getTransferredBy().getUserId();

        response.fromLocation = event.getFromLocation();
        response.toLocation = event.getToLocation();
        response.eventType = event.getEventType();
        response.timestamp = event.getTimestamp();

        return response;
    }

    public Long getCustodyEventId() {
        return custodyEventId;
    }

    public Long getEvidenceId() {
        return evidenceId;
    }

    public Long getFromHolder() {
        return fromHolder;
    }

    public Long getToHolder() {
        return toHolder;
    }

    public Long getTransferredBy() {
        return transferredBy;
    }

    public String getFromLocation() {
        return fromLocation;
    }

    public String getToLocation() {
        return toLocation;
    }

    public String getEventType() {
        return eventType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}