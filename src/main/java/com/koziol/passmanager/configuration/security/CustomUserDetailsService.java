package com.koziol.passmanager.configuration.security;

import com.koziol.passmanager.database.models.User;
import com.koziol.passmanager.database.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;


@Component
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User persistedUser = userRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("No user found with email " + email));

        return new CustomUserDetails(
                persistedUser.getEmail(),
                persistedUser.getPassword(),
                new String(persistedUser.getEncryptedPrivateKey()),
                new String(persistedUser.getPublicKey()));
    }
}
