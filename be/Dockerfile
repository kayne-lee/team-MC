# Use official OpenJDK 17 image from Docker Hub
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the jar file from the target directory (after Maven build) to the container
COPY target/be-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 (default port for Spring Boot)
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
