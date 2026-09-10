package com.example.kavachdms.service;

import com.example.kavachdms.entity.CaseMember;
import com.example.kavachdms.repository.CaseMemberRepository;
import org.springframework.stereotype.Service;

@Service
public class CaseMemberService {

    private final CaseMemberRepository caseMemberRepository;

    public CaseMemberService(CaseMemberRepository caseMemberRepository) {
        this.caseMemberRepository = caseMemberRepository;
    }
}
