package com.koziol.passmanager.database.models;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Vault {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long vaultId;
    private String vaultName;
    private byte[] vaultData;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

    @OneToMany(mappedBy = "vault")
    List<VaultUser> vaultUsers;

    @ManyToOne
    @JoinColumn(name = "CREATED_BY")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "MODIFIED_BY")
    private User modifiedBy;
}
