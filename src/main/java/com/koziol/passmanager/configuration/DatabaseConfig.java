package com.koziol.passmanager.configuration;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {
//    # database configuration
//    spring.datasource.driver-class-name=org.h2.Driver
//    spring.datasource.url=jdbc:h2:mem:passmanager;MODE=MYSQL
//    spring.datasource.username=sa
//    spring.datasource.password=

    @Bean
    @Profile("dev")
    public DataSource getDataSourceDEV() {
        return DataSourceBuilder.create()
                .driverClassName("org.h2.Driver")
                .url("dbc:h2:mem:passmanager;MODE=MYSQL")
                .username("sa")
                .password("")
                .build();
    }

    @Bean
    @Profile("prod")
    public DataSource getDataSourcePROD(){
        return DataSourceBuilder.create()
                .driverClassName("com.mysql.cj.jdbc.Driver")
                .url("jdbc:mysql://localhost:3306/passmanager")
                .username("passapp")
                .password("14550vcn23kjg90sz03gs566j")
                .build();
    }

}
