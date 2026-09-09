package com.example.kavachdms.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "case_members",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_case_member",
            columnNames = {"case_id", "user_id"}
        )
    }
)
public class CaseMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long caseMemberId;

    @ManyToOne
    @JoinColumn(
        name = "case_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_case_member_case")
    )
    private Case caseEntity;

    @ManyToOne
    @JoinColumn(
        name = "user_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_case_member_user")
    )
    private User user;

    @ManyToOne
    @JoinColumn(
        name = "role_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_case_member_role")
    )
    private Role role;

    private String accessLevel;

    private String status;

    public CaseMember() {
    }

    public Long getCaseMemberId() {
        return caseMemberId;
    }

    public void setCaseMemberId(Long caseMemberId) {
        this.caseMemberId = caseMemberId;
    }

    public Case getCaseEntity() {
        return caseEntity;
    }

    public void setCaseEntity(Case caseEntity) {
        this.caseEntity = caseEntity;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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