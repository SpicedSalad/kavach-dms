package com.example.kavachdms.service;

import com.example.kavachdms.dto.roles.CreateRoleRequest;
import com.example.kavachdms.dto.roles.RoleResponse;
import com.example.kavachdms.entity.Role;
import com.example.kavachdms.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public RoleResponse createRole(CreateRoleRequest request) {

        Role role = new Role();

        role.setRoleName(request.getRoleName());
        role.setDescription(request.getDescription());

        Role savedRole = roleRepository.save(role);

        return RoleResponse.fromEntity(savedRole);
    }

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(RoleResponse::fromEntity)
                .toList();
    }

    public RoleResponse getRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        return RoleResponse.fromEntity(role);
    }
}