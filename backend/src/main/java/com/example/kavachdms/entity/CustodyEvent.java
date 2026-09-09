package com.example.kavachdms.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "custody_events")
public class CustodyEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long custodyEventId;

    @ManyToOne
    @JoinColumn(
        name = "evidence_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_custody_evidence")
    )
    private PhysicalEvidence evidence;

    @ManyToOne
    @JoinColumn(
        name = "from_holder",
        foreignKey = @ForeignKey(name = "fk_custody_from_holder")
    )
    private User fromHolder;

    @ManyToOne
    @JoinColumn(
        name = "to_holder",
        foreignKey = @ForeignKey(name = "fk_custody_to_holder")
    )
    private User toHolder;

    @ManyToOne
    @JoinColumn(
        name = "transferred_by",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_custody_transferred_by")
    )
    private User transferredBy;

    private String fromLocation;

    private String toLocation;

    @Column(nullable = false)
    private String eventType;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public CustodyEvent() {
    }

    public Long getCustodyEventId() {
        return custodyEventId;
    }

    public void setCustodyEventId(Long custodyEventId) {
        this.custodyEventId = custodyEventId;
    }

    public PhysicalEvidence getEvidence() {
        return evidence;
    }

    public void setEvidence(PhysicalEvidence evidence) {
        this.evidence = evidence;
    }

    public User getFromHolder() {
        return fromHolder;
    }

    public void setFromHolder(User fromHolder) {
        this.fromHolder = fromHolder;
    }

    public User getToHolder() {
        return toHolder;
    }

    public void setToHolder(User toHolder) {
        this.toHolder = toHolder;
    }

    public User getTransferredBy() {
        return transferredBy;
    }

    public void setTransferredBy(User transferredBy) {
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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}