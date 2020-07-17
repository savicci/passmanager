package com.koziol.passmanager.controllers;

import com.koziol.passmanager.controllers.models.*;
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
import org.springframework.web.bind.annotation.*;

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

        Vault insertedVault = insertVault(request, user);
        insertVaultUser(request, user, insertedVault);

        return ResponseEntity.ok("vault created");
    }

    @PostMapping("/update")
    public ResponseEntity<?> modifyExistingVault(@RequestBody ModifyVaultRQ request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getPrincipal().toString()).orElseThrow(IllegalAccessError::new);

        Map<Long, VaultUser> vaultUserByVaultName = user.getVaultUserList()
                .stream()
                .collect(Collectors.toMap(vaultUser -> vaultUser.getVault().getVaultId(), Function.identity()));

        for (Map.Entry<Long, String> entry : request.getVaultDataByVaultId().entrySet()) {
            VaultUser vaultUser = vaultUserByVaultName.get(entry.getKey());
            if (vaultUser != null && !vaultUser.getVaultRole().getRoleName().equals("VIEWER")) {
                Vault vaultToModify = vaultUser.getVault();
                vaultToModify.setVaultData(entry.getValue().getBytes());
                vaultToModify.setModifiedBy(user);
                vaultToModify.setModifiedDate(LocalDateTime.now());
                vaultRepository.save(vaultUser.getVault());
            } else {
                return new ResponseEntity<>("You don't have permission to execute this operation", HttpStatus.FORBIDDEN);
            }
        }
        return ResponseEntity.ok("vaults updated");
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteVault(@RequestBody DeleteVaultRQ vaultName, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getPrincipal().toString()).orElseThrow(IllegalAccessError::new);
        Optional<VaultUser> vaultUserToDelete = user.getVaultUserList().stream()
                .filter(vaultUser -> vaultUser.getVault().getVaultId() == vaultName.getVaultId())
                .findFirst();

        if (vaultUserToDelete.isEmpty()) {
            return new ResponseEntity<>("Could not find vault with given name", HttpStatus.NOT_FOUND);
        }

        Vault vaultToDelete = vaultUserToDelete.get().getVault();

        vaultUserRepository.deleteInBatch(vaultToDelete.getVaultUsers());
        vaultRepository.delete(vaultToDelete);
        return ResponseEntity.ok("Deleted vault and associated users");
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUserVaults(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getPrincipal().toString()).orElseThrow(IllegalAccessError::new);

        Map<Long, VaultRS> vaults = user.getVaultUserList().stream()
                .collect(Collectors.toMap(vaultUser -> vaultUser.getVault().getVaultId(), this::createVaultRS));

        GetVaultRS response = new GetVaultRS(vaults);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getVaultById(@RequestParam(name = "vaultId") long vaultId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getPrincipal().toString()).orElseThrow(IllegalAccessError::new);

        Optional<VaultUser> vaultUserOptional = user.getVaultUserList().stream()
                .filter(vaultUser -> vaultUser.getVault().getVaultId() == vaultId)
                .findFirst();

        if (vaultUserOptional.isEmpty()) {
            return new ResponseEntity<>("Vault not found by id", HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(createVaultRS(vaultUserOptional.get()));
    }

    private VaultRS createVaultRS(VaultUser vaultUser) {
        VaultRS vault = new VaultRS();
        vault.setVaultName(vaultUser.getVault().getVaultName());
        vault.setVaultData(new String(vaultUser.getVault().getVaultData()));
        vault.setEncryptedVaultKey(new String(vaultUser.getVaultKey()));
        vault.setRole(vaultUser.getVaultRole().getRoleName());
        vault.setCreatedBy(vaultUser.getVault().getCreatedBy().getEmail());
        vault.setModifiedBy(vaultUser.getVault().getModifiedBy() == null ? null : vaultUser.getVault().getModifiedBy().getEmail());
        vault.setCreatedDate(vaultUser.getVault().getCreatedDate());
        vault.setModifiedDate(vaultUser.getVault().getModifiedDate());
        return vault;
    }

    private void insertVaultUser(CreateVaultRQ request, User user, Vault insertedVault) {
        VaultUser vaultUser = new VaultUser();
        vaultUser.setVault(insertedVault);
        vaultUser.setVaultKey(request.getEncryptedVaultKey().getBytes());
        vaultUser.setVaultRole(vaultRoleRepository.findByRoleName("CREATOR").get());
        vaultUser.setCreatedBy(user);
        vaultUser.setCreatedDate(LocalDateTime.now());
        vaultUser.setUser(user);
        vaultUserRepository.save(vaultUser);
    }

    private Vault insertVault(CreateVaultRQ request, User user) {
        Vault vault = new Vault();
        vault.setVaultData(request.getVaultData().getBytes());
        vault.setVaultName(request.getVaultName());
        vault.setCreatedBy(user);
        vault.setCreatedDate(LocalDateTime.now());
        return vaultRepository.save(vault);
    }

}
