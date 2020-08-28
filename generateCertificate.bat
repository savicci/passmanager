@echo off

echo "Started generating process for spring boot app"

echo "Generates server.p12. Press enter until you get message: Is ... correct? then type 'yes' and enter"
keytool -genkeypair -alias tomcat -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore src/main/resources/server.p12 -validity 3650 -storepass 1fd09jsaf1of-3jdrf

echo "Generates server.crt. Pass the password 1fd09jsaf1of-3jdrf"
keytool -export -keystore src/main/resources/server.p12 -alias tomcat -file src/main/resources/server.crt

echo "Finished generating for spring boot app"

cd client
if not exist ssl mkdir ssl

echo "Started generating process for angular app"

echo "Generates server.p12 Press enter until you get message: Is ... correct? then type 'yes' and enter"
keytool -genkeypair -alias tomcat -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore ssl/server.p12 -validity 3650 -storepass 1fd09jsaf1of-3jdrf

echo "Generates server.crt. Pass the password 1fd09jsaf1of-3jdrf"
keytool -export -keystore ssl/server.p12 -alias tomcat -file ssl/server.crt

echo "Generates server.key. Pass the password 1fd09jsaf1of-3jdrf"
openssl pkcs12 -in ssl/server.p12 -nodes -out ssl/server.key -nocerts

echo "Finished generating for angular app"

cd ..