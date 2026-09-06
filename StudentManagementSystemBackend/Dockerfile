# ==========================================
# Multi-stage Dockerfile for Spring Boot 3.5.4 & Java 25
# Optimized for Render Cloud Application Platform
# ==========================================

# Stage 1: Build stage using official Eclipse Temurin JDK 25
FROM eclipse-temurin:25-jdk-noble AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml first to leverage Docker layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Ensure maven wrapper has executable permissions
RUN chmod +x mvnw

# Download dependencies offline to cache dependencies layer
RUN ./mvnw dependency:go-offline -B

# Copy project source code
COPY src/ ./src/

# Build executable JAR skipping tests
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime stage using lightweight Eclipse Temurin JRE 25
FROM eclipse-temurin:25-jre-noble AS runner

WORKDIR /app

# Create a non-privileged system user for running the application securely
RUN addgroup --system spring && adduser --system --ingroup spring spring

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads && chown -R spring:spring /app

# Copy built artifact from builder stage
COPY --from=builder --chown=spring:spring /app/target/student-management-system-1.0.0.jar app.jar

# Switch to non-root user
USER spring:spring

# Expose default HTTP port (Render dynamically sets and maps PORT)
EXPOSE 8080

# Environment defaults
ENV PORT=8080 \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD curl -f http://localhost:${PORT}/actuator/health || exit 1

# Launch application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
