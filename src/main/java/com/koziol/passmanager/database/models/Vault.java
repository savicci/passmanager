package com.koziol.passmanager.database.models;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.type.BlobType;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDate;
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
    private long createdBy;
    private long modifiedBy;
    private String vaultName;
    private byte[] vaultData;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

    @OneToMany(mappedBy = "vault", fetch = FetchType.LAZY)
    List<VaultUser> vaultUsers;
}
