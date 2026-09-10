package com.example.kavachdms.controller;

import com.example.kavachdms.dto.roles.CreateRoleRequest;
import com.example.kavachdms.dto.roles.RoleResponse;
import com.example.kavachdms.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    public RoleResponse createRole(
            @Valid @RequestBody CreateRoleRequest request) {

        return roleService.createRole(request);
    }

    @GetMapping
    public List<RoleResponse> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{roleId}")
    public RoleResponse getRole(@PathVariable Long roleId) {
        return roleService.getRole(roleId);
    }
}