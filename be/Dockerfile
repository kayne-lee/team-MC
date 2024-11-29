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

# Expose port 8080 for the application
EXPOSE 8080

# Command to run the JAR file
CMD ["java", "-jar", "app.jar"]
