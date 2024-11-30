# Use an official Maven image with OpenJDK 17
FROM maven:3.8.1-openjdk-17-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy your project files into the container
COPY . .

# Run the Maven build command inside the container
RUN mvn clean package -DskipTests

# Use OpenJDK base image for the final runtime environment
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the packaged JAR from the build stage
COPY --from=build /app/target/be-0.0.1-SNAPSHOT.jar app.jar

# Copy the keystore file into the container (make sure keystore.p12 is in the same directory as Dockerfile)
COPY keystore.p12 /app/keystore.p12

# Expose port 8443 for the SSL application
EXPOSE 8443

# Command to run the JAR file (Java application with SSL enabled)
CMD ["java", "-Dserver.ssl.key-store=/app/keystore.p12", "-Dserver.ssl.key-store-password=9621", "-Dserver.ssl.key-store-type=PKCS12", "-jar", "app.jar"]
