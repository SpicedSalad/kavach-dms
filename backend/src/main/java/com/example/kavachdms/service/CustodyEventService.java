package com.example.kavachdms.service;

import com.example.kavachdms.dto.custodyEvent.CreateCustodyEventRequest;
import com.example.kavachdms.dto.custodyEvent.CustodyEventResponse;
import com.example.kavachdms.entity.CustodyEvent;
import com.example.kavachdms.entity.PhysicalEvidence;
import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.CustodyEventRepository;
import com.example.kavachdms.repository.PhysicalEvidenceRepository;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustodyEventService {

    private final CustodyEventRepository custodyEventRepository;
    private final PhysicalEvidenceRepository physicalEvidenceRepository;
    private final UserRepository userRepository;

    public CustodyEventService(
            CustodyEventRepository custodyEventRepository,
            PhysicalEvidenceRepository physicalEvidenceRepository,
            UserRepository userRepository) {

        this.custodyEventRepository = custodyEventRepository;
        this.physicalEvidenceRepository = physicalEvidenceRepository;
        this.userRepository = userRepository;
    }

    public CustodyEventResponse createCustodyEvent(CreateCustodyEventRequest request) {

        PhysicalEvidence evidence = physicalEvidenceRepository
                .findById(request.getEvidenceId())
                .orElseThrow(() -> new RuntimeException("Evidence not found"));

        User transferredBy = userRepository
                .findById(request.getTransferredBy())
                .orElseThrow(() -> new RuntimeException("Transferred-by user not found"));

        User fromHolder = null;

        if (request.getFromHolder() != null) {
            fromHolder = userRepository
                    .findById(request.getFromHolder())
                    .orElseThrow(() -> new RuntimeException("From-holder user not found"));
        }

        User toHolder = null;

        if (request.getToHolder() != null) {
            toHolder = userRepository
                    .findById(request.getToHolder())
                    .orElseThrow(() -> new RuntimeException("To-holder user not found"));
        }

        CustodyEvent event = new CustodyEvent();

        event.setEvidence(evidence);
        event.setFromHolder(fromHolder);
        event.setToHolder(toHolder);
        event.setTransferredBy(transferredBy);
        event.setFromLocation(request.getFromLocation());
        event.setToLocation(request.getToLocation());
        event.setEventType(request.getEventType());

        CustodyEvent savedEvent = custodyEventRepository.save(event);

        return CustodyEventResponse.fromEntity(savedEvent);
    }

    public List<CustodyEventResponse> getAllCustodyEvents() {
        return custodyEventRepository.findAll()
                .stream()
                .map(CustodyEventResponse::fromEntity)
                .toList();
    }

    public CustodyEventResponse getCustodyEventById(Long id) {
        CustodyEvent event = custodyEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Custody event not found"));

        return CustodyEventResponse.fromEntity(event);
    }
}