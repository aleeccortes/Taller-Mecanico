package com.Taller.Mecanico.controller;

import com.Taller.Mecanico.dto.CambioClaveDTO;
import com.Taller.Mecanico.dto.LoginRequestDTO;
import com.Taller.Mecanico.dto.LoginResponseDTO;
import com.Taller.Mecanico.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponseDTO> iniciarSesion(@Valid @RequestBody LoginRequestDTO loginDTO) {
        LoginResponseDTO respuesta = authService.iniciarSesion(loginDTO);
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/admin/auth/cambiar-clave")
    public ResponseEntity<Map<String, String>> cambiarContrasena(@Valid @RequestBody CambioClaveDTO dto,
                                                                 Authentication authentication) {
        String username = authentication.getName();
        authService.cambiarContrasena(username, dto.getClaveActual(), dto.getClaveNueva());
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada con éxito"));
    }
}
