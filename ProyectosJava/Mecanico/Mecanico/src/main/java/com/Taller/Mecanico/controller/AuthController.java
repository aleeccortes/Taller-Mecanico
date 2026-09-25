package com.Taller.Mecanico.controller;

import com.Taller.Mecanico.dto.LoginRequestDTO;
import com.Taller.Mecanico.dto.LoginResponseDTO;
import com.Taller.Mecanico.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> iniciarSesion(@Valid @RequestBody LoginRequestDTO loginDTO) {
        LoginResponseDTO respuesta = authService.iniciarSesion(loginDTO);
        return ResponseEntity.ok(respuesta);
    }
}
