package com.example.kavachdms.dto.caseMember;

import com.example.kavachdms.entity.CaseMember;

public class CaseMemberResponse {

    private Long caseMemberId;
    private Long caseId;
    private Long userId;
    private Long roleId;
    private String accessLevel;
    private String status;

    public CaseMemberResponse() {
    }

    public static CaseMemberResponse fromEntity(CaseMember caseMember) {

        CaseMemberResponse response = new CaseMemberResponse();

        response.caseMemberId = caseMember.getCaseMemberId();
        response.caseId = caseMember.getCaseEntity().getCaseId();
        response.userId = caseMember.getUser().getUserId();
        response.roleId = caseMember.getRole().getRoleId();
        response.accessLevel = caseMember.getAccessLevel();
        response.status = caseMember.getStatus();

        return response;
    }

    public Long getCaseMemberId() {
        return caseMemberId;
    }

    public Long getCaseId() {
        return caseId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getRoleId() {
        return roleId;
    }

    public String getAccessLevel() {
        return accessLevel;
    }

    public String getStatus() {
        return status;
    }
}