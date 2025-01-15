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
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
