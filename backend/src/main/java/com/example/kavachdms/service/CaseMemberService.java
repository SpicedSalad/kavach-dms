package com.example.kavachdms.service;

import com.example.kavachdms.entity.CaseMember;
import com.example.kavachdms.repository.CaseMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseMemberService {

    private final CaseMemberRepository caseMemberRepository;

    public CaseMemberService(CaseMemberRepository caseMemberRepository) {
        this.caseMemberRepository = caseMemberRepository;
    }

    public CaseMember addMember(CaseMember caseMember) {
        return caseMemberRepository.save(caseMember);
    }

    public List<CaseMember> getAllMembers() {
        return caseMemberRepository.findAll();
    }

    public CaseMember getMember(Long id) {
        return caseMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case member not found"));
    }

    public void removeMember(Long id) {
        caseMemberRepository.deleteById(id);
    }
}