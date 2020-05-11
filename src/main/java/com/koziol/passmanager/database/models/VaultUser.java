package com.koziol.passmanager.database.models;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class VaultUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long vaultUserId;
    private byte[] vaultKey;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

    @ManyToOne
    @JoinColumn(name = "VAULT_ID")
    private Vault vault;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "CREATED_BY")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "MODIFIED_BY")
    private User modifiedBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "VAULT_ROLE_ID")
    private VaultRole vaultRole;
}

