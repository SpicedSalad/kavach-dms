package com.example.kavachdms.dto.roles;

import com.example.kavachdms.entity.Role;

public class RoleResponse {

    private Long roleId;
    private String roleName;
    private String description;

    public RoleResponse() {
    }

    public static RoleResponse fromEntity(Role role) {
        RoleResponse response = new RoleResponse();

        response.roleId = role.getRoleId();
        response.roleName = role.getRoleName();
        response.description = role.getDescription();

        return response;
    }

    public Long getRoleId() {
        return roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public String getDescription() {
        return description;
    }
}