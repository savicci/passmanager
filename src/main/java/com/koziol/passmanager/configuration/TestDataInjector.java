package com.koziol.passmanager.configuration;

import com.koziol.passmanager.database.models.User;
import com.koziol.passmanager.database.models.VaultRole;
import com.koziol.passmanager.database.repositories.UserRepository;
import com.koziol.passmanager.database.repositories.VaultRepository;
import com.koziol.passmanager.database.repositories.VaultRoleRepository;
import com.koziol.passmanager.database.repositories.VaultUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class TestDataInjector {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VaultRoleRepository vaultRoleRepository;
    private final VaultRepository vaultRepository;
    private final VaultUserRepository vaultUserRepository;

    private final String privateKey = "-----BEGIN PRIVATE KEY-----↵10epDeeJTX7rxprpCgr80CkesI6n+jWdrzrVLrH9JcgPSQ4tCR+nV/KWwgx5Dhyqc8S89/1FFZ12N77isKFs/fx4LFIrZ7OLGgiexU7/D/FTy67K3jaM1IEPHyvwElb2hNIru6S54J8HBGWr90zAGL7Bva142SX8VRYsWEOORhh1DSAAaolTAOmAIZsc+erzwuhg1yglQwjnSEjHxLFOoiW5g2Ce6tVfHCG3bZ9uKTzeOLPrh4zwMsfFDJO/FdueL1amAjN0r/EjwHzFa0OGQdg/oQisPK+RYutZb2tXIpf4Z7R/n5JPFzd6l71XwYisfWaclcwdmV0cQ5gVp12MhtvYyp0r/bezLEDWlo+fv8sqpiWhBLZok+JP3oXrE3R1pBNKSFqG9/+KkU/EUaBhOeXAcAV4+Kzg931PWdyHHkafoozDm+rycs14ECew6ovCvxwRdQe+KqbG69rDoJZI6LYLUn9tVPjTib1vHdO9QeLtDC0cJTpMVyFiGy1EX10H8+Xr7cMp4VKi9RS8PNdEe8R41yYXr5TEaseqIvhJ9qFPB/+iao4Y6qAiBe43xwnIJ8fV+ioEOjPYNmmsTvbjOh8233ZwbHw3SlrpPYHZLXllD+IAwcCV5o+jiyPSExmU3j6wZ78KRzYqXjY2ojpTdiww+tZ+HCjZkGy8NjZYeazt7sz9IhZD0TX6bj1c6VdQYDBY38lr1onKpiXMSKAouVoFc20EU7XJqPG2ywuNTEl7gXKgYYDF1ZqdvBegjEHj/KywPCujqtY0XJcFn+mju4fOE0gIH8fE2ZQ1OM8pNw5mmzXMCbxYA35+PSYlm9lOhe5hnMeCDsvy2n4TRmLd3swTlHgVSdZzjOB53s7aKM4Kqyrkb4iffpVeJH55mkNT2AbC9GppnLxQdJ6x6YoPUlctbn23NkqP0j7QQINq75ecBewkDZHmMcpxCJ23RPVYuPeJ3DZL4QgSspt4y9ziFCiyrDeKr2SQgmh8T1fZmBVfLptUEWTpQhdip0BI4qazVna39t2GJBjHVWNZbEKAnKlTwS3E8LEeMqECOmFW8MfteVotd8hfWAdUFv/2HtSia0X+kubhqlD1vsRwsooEaXhdz3wArW8wZVkc9MUhqhSzVCpnQVkKLIdn+fIAPwyXB1xfoY8r3FRElFQuTeTX9qrsa5iDD1vFkVlDCJNjGB7tWzQI+vW/+q/VP2ILERJRq0S1UDLqVLZ2sFWtOQN+qMnCxpCdeydM7HZvOh+/FPK4l3KCHiv6NKnKWBvGx0Pi3h6p2GdRg60lUVaJK/4H5uWnY8Hjg9Lm9FnqxxsqiuxyWgI4izyfKVWeCslMomxExnWDeZwPo67DQWkrsJ/kQgzRm5SKZEc81VnjGjGpoRe/IQaH3u6KnU+zFtQbW+Xh7ySS7PUloDW7nQVHwMNA1QqSa/8HYxIhDLyGwFDMxi0DGHRs57FD0pq/zrr8Nq4tY4a53Nt9Np7SvGtA/Do2pjisuqKbe1ETjyil90N4K8x83MullpdhrJRg3dSZnDrSTyT6oX0icYQaMVNYVfBiKoknV0qM/gXfk5QETIrt3kO4Mg/7oOrPLJfql3Dh++k13YvxiUOnYYJjpJT+OWkOGgyhVNCkGS8zjOGvMl+QB9a2e/RTugXLqcT0NoZn↵-----END PRIVATE KEY-----";
    private final String publicKey = "-----BEGIN PUBLIC KEY-----↵MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmJhk28ASK4qhoc9lMVdLDAHF3oQeOQiuIweKRGgP6mN/2slV3cC6bA1FWhcnempIhcSCBfsIlyBiOC2gGJD7dgaYbRm1IC3l/tGpChSBfKCYE5fimXfjp7QNQGHETTJ5bGXu4vVD4ao9JigF1ng6IuQTYjf91wi0QFGm7ChVIzgXWfhhltjbo379549Lte0ru/KJk83q0rikFHYkDCbRf/trLqsu9I+tN8mldMpO8Y3s/mNJaU/cJNdiDEM0JsHcF5L5P3DNjpzsoSHyqG84HNN+1+E5EjgO0y6prxeQ+TpcWgMGFA/SX/xtZ9BGOb2UZlQXGRg3rhKHSKObI0q/PQIDAQAB↵-----END PUBLIC KEY-----";

    public TestDataInjector(PasswordEncoder passwordEncoder, UserRepository userRepository, VaultRoleRepository vaultRoleRepository, VaultRepository vaultRepository, VaultUserRepository vaultUserRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.vaultRoleRepository = vaultRoleRepository;
        this.vaultRepository = vaultRepository;
        this.vaultUserRepository = vaultUserRepository;
    }

    @Bean
    @Profile("dev")
    CommandLineRunner injectData() {
        return args -> {
            // user
            User user = new User("user@email.com", passwordEncoder.encode("password"), privateKey.getBytes(), publicKey.getBytes());
            userRepository.save(user);

            VaultRole creator = vaultRoleRepository.save(new VaultRole("CREATOR"));
            vaultRoleRepository.save(new VaultRole("ADMIN"));
            vaultRoleRepository.save(new VaultRole("EDITOR"));
            vaultRoleRepository.save(new VaultRole("VIEWER"));

        };
    }
}
