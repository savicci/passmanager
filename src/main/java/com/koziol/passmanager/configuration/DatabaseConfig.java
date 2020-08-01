package com.koziol.passmanager.configuration;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {
    @Bean
    @Profile("dev")
    public DataSource getDataSourceDEV() {
        return DataSourceBuilder.create()
                .driverClassName("org.h2.Driver")
                .url("jdbc:h2:mem:passmanager;MODE=MYSQL")
                .username("sa")
                .password("")
                .build();
    }

    @Bean
    @Profile("prod")
    public DataSource getDataSourcePROD(){
        return DataSourceBuilder.create()
                .driverClassName("org.h2.Driver")
                .url("jdbc:h2:file:~/db/passmanager;MODE=MySQL;DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE")
                .username("admin")
                .password("fj091j90vnoim21-vjhas")
                .build();
    }

}
