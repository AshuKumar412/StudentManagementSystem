package com.studentmanagement.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private SecretKey cachedSignInKey;

    @PostConstruct
    public void init() {
        this.cachedSignInKey = resolveSignInKey(secretKey);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey())
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() {
        if (cachedSignInKey == null) {
            cachedSignInKey = resolveSignInKey(secretKey);
        }
        return cachedSignInKey;
    }

    /**
     * Resolves and validates the HMAC-SHA signing key.
     * Supports Base64/Base64URL, Hex, and raw UTF-8 strings.
     * Enforces the RFC 7518 requirement of >= 256 bits (32 bytes).
     */
    private SecretKey resolveSignInKey(String rawSecret) {
        if (rawSecret == null || rawSecret.trim().isEmpty()) {
            throw new IllegalStateException("JWT_SECRET environment variable is missing or empty. Please set a secure key (>= 256 bits) in environment settings.");
        }

        String trimmed = rawSecret.trim();
        byte[] keyBytes = null;

        // 1. Check if trimmed string is a valid Hex string of >= 64 hex characters (32 bytes = 256 bits)
        if (trimmed.length() >= 64 && trimmed.matches("^[0-9a-fA-F]+$") && trimmed.length() % 2 == 0) {
            try {
                keyBytes = hexStringToByteArray(trimmed);
            } catch (Exception ignored) {}
        }

        // 2. Try Base64 or Base64URL decoding
        if (keyBytes == null || keyBytes.length < 32) {
            try {
                byte[] decoded = Decoders.BASE64.decode(trimmed);
                if (decoded != null && decoded.length >= 32) {
                    keyBytes = decoded;
                }
            } catch (Exception ignored) {}
        }

        if (keyBytes == null || keyBytes.length < 32) {
            try {
                byte[] decoded = Decoders.BASE64URL.decode(trimmed);
                if (decoded != null && decoded.length >= 32) {
                    keyBytes = decoded;
                }
            } catch (Exception ignored) {}
        }

        // 3. Fallback to raw UTF-8 bytes if length is at least 32 characters
        if (keyBytes == null || keyBytes.length < 32) {
            byte[] rawBytes = trimmed.getBytes(StandardCharsets.UTF_8);
            if (rawBytes.length >= 32) {
                keyBytes = rawBytes;
            }
        }

        // 4. Strict validation: ensure at least 32 bytes (256 bits)
        if (keyBytes == null || keyBytes.length < 32) {
            int actualBits = keyBytes != null ? keyBytes.length * 8 : (trimmed.getBytes(StandardCharsets.UTF_8).length * 8);
            throw new IllegalStateException(
                "Configured JWT_SECRET provides " + actualBits + " bits. " +
                "The HMAC-SHA algorithm requires at least 256 bits (32 bytes). " +
                "Please configure a secure random JWT_SECRET in your environment settings."
            );
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    private static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                                 + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }
}
