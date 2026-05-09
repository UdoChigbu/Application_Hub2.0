FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
WORKDIR /app/backend
RUN ls -la && sh ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
CMD ["java", "-jar", "app.jar"]
