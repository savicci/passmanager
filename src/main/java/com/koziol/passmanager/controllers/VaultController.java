package com.koziol.passmanager.controllers;

import com.koziol.passmanager.controllers.models.CreateVaultRQ;
import com.koziol.passmanager.controllers.models.DeleteVaultRQ;
import com.koziol.passmanager.controllers.models.ModifyVaultRQ;
import com.koziol.passmanager.database.models.User;
import com.koziol.passmanager.database.models.Vault;
import com.koziol.passmanager.database.models.VaultUser;
import com.koziol.passmanager.database.repositories.UserRepository;
import com.koziol.passmanager.database.repositories.VaultRepository;
import com.koziol.passmanager.database.repositories.VaultRoleRepository;
import com.koziol.passmanager.database.repositories.VaultUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/vault")
public class VaultController {
    private final UserRepository userRepository;
    private final VaultRepository vaultRepository;
    private final VaultUserRepository vaultUserRepository;
    private final VaultRoleRepository vaultRoleRepository;

    @Autowired
    public VaultController(UserRepository userRepository, VaultRepository vaultRepository, VaultUserRepository vaultUserRepository, VaultRoleRepository vaultRoleRepository) {
        this.userRepository = userRepository;
        this.vaultRepository = vaultRepository;
        this.vaultUserRepository = vaultUserRepository;
        this.vaultRoleRepository = vaultRoleRepository;
    }


    @PostMapping("/add")
    public ResponseEntity<?> addNewVault(@RequestBody CreateVaultRQ request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getPrincipal().toString()).orElseThrow(IllegalAccessError::new);
        if (user.getVaultUserList().stream()
                .map(VaultUser::getVault)
                .map(Vault::getVaultName)
                .anyMatch(existingVaultName -> request.getVaultName().equals(existingVaultName))) {
            return new ResponseEntity<>("Vault with this name already exists", HttpStatus.FORBIDDEN);
        }

        Vault insertedVault = insertVault(request, user);
        insertVaultUser(request, user, insertedVault);

        return ResponseEntity.ok("vault created");
    }

    @PostMapping("/update")
    public ResponseEntity<?> modifyExistingVault(@RequestBody ModifyVaultRQ request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getPrincipal().toString()).orElseThrow(IllegalAccessError::new);
        Map<String, VaultUser> vaultUserByVaultName = user.getVaultUserList()
                .stream()
                .collect(Collectors.toMap(vaultUser -> vaultUser.getVault().getVaultName(), Function.identity()));

        request.getVaultDataByVaultName().forEach((vaultName, vaultData) -> {
            VaultUser vaultUser = vaultUserByVaultName.get(vaultName);
            if (vaultUser != null && !vaultUser.getVaultRole().getRoleName().equals("VIEWER")) {
                Vault vaultToModify = vaultUser.getVault();
                vaultToModify.setVaultData(vaultData.getBytes());
                vaultToModify.setModifiedBy(user.getUserId());
                vaultToModify.setModifiedDate(LocalDateTime.now());
                vaultRepository.save(vaultUser.getVault());
            }
        });
        return ResponseEntity.ok("vaults updated");
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteVault(@RequestBody DeleteVaultRQ vaultName, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getPrincipal().toString()).orElseThrow(IllegalAccessError::new);
        Optional<VaultUser> vaultUserToDelete = user.getVaultUserList().stream()
                .filter(vaultUser -> vaultUser.getVault().getVaultName().equals(vaultName.getVaultName()))
                .findFirst();

        if (vaultUserToDelete.isEmpty()) {
            return new ResponseEntity<>("Could not find vault with given name", HttpStatus.NOT_FOUND);
        }

        Vault vaultToDelete = vaultUserToDelete.get().getVault();

        vaultUserRepository.deleteInBatch(vaultToDelete.getVaultUsers());
        vaultRepository.delete(vaultToDelete);
        return ResponseEntity.ok("Deleted vault and associated users");
    }

    private void insertVaultUser(CreateVaultRQ request, User user, Vault insertedVault) {
        VaultUser vaultUser = new VaultUser();
        vaultUser.setVaultUserId(user.getUserId());
        vaultUser.setVault(insertedVault);
        vaultUser.setVaultKey(request.getEncryptedVaultKey().getBytes());
        vaultUser.setVaultRole(vaultRoleRepository.findByRoleName("CREATOR"));
        vaultUser.setUser(user);
        vaultUserRepository.save(vaultUser);
    }

    private Vault insertVault(CreateVaultRQ request, User user) {
        Vault vault = new Vault();
        vault.setVaultData(request.getVaultData().getBytes());
        vault.setVaultName(request.getVaultName());
        vault.setCreatedBy(user.getUserId());
        vault.setCreatedDate(LocalDateTime.now());
        return vaultRepository.save(vault);
    }

}
