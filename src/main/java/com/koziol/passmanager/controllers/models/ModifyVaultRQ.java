package com.koziol.passmanager.controllers.models;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class ModifyVaultRQ {
    private Map<String, String> vaultDataByVaultName;
}
