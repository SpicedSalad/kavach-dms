package com.example.kavachdms.dto.caseMember;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public class AddCaseMemberRequest {

    @NotNull
    private Long caseId;

    @NotNull
    private Long userId;

    @NotNull
    private Long roleId;

    @NotBlank
    private String accessLevel;

    @NotBlank
    private String status;

    public AddCaseMemberRequest() {
    }

    public Long getCaseId() {
        return caseId;
    }

    public void setCaseId(Long caseId) {
        this.caseId = caseId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(String accessLevel) {
        this.accessLevel = accessLevel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}