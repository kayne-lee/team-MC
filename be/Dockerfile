# Use an official Maven image with OpenJDK 17
FROM maven:3.8.1-openjdk-17-slim AS build

# Set the working directory inside the container
WORKDIR /

# Copy your project files into the container
COPY . .

# Run the Maven build command inside the container
RUN mvn clean package -DskipTests

# Use OpenJDK base image for the final runtime environment
FROM openjdk:17-jdk-slim


# Copy the packaged JAR from the build stage
COPY --from=build /target/be-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8443 for the SSL application
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
