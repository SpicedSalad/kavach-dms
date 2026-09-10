package com.example.kavachdms.dto.roles;

import jakarta.validation.constraints.NotBlank;

public class CreateRoleRequest {

    @NotBlank
    private String roleName;

    private String description;

    public CreateRoleRequest() {
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}