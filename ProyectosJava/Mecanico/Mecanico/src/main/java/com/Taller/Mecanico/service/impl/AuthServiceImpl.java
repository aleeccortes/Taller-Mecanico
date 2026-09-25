package com.Taller.Mecanico.service.impl;

import com.Taller.Mecanico.dto.LoginRequestDTO;
import com.Taller.Mecanico.dto.LoginResponseDTO;
import com.Taller.Mecanico.model.RolUsuario;
import com.Taller.Mecanico.model.Usuario;
import com.Taller.Mecanico.repository.UsuarioRepository;
import com.Taller.Mecanico.security.JwtUtil;
import com.Taller.Mecanico.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponseDTO iniciarSesion(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario o contraseña incorrectos"));

        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Usuario o contraseña incorrectos");
        }

        String token = jwtUtil.generarToken(usuario.getUsername(), usuario.getRol().name());

        return LoginResponseDTO.builder()
                .token(token)
                .username(usuario.getUsername())
                .rol(usuario.getRol().name())
                .mensaje("Inicio de sesión exitoso")
                .build();
    }

    @Override
    public void registrarAdminInicial(String username, String password) {
        if (!usuarioRepository.existsByUsername(username)) {
            Usuario admin = Usuario.builder()
                    .username(username)
                    .password(passwordEncoder.encode(password))
                    .rol(RolUsuario.ROLE_ADMIN)
                    .build();
            usuarioRepository.save(admin);
        }
    }

    @Override
    public void cambiarContrasena(String username, String claveActual, String claveNueva) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(claveActual, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        if (claveNueva == null || claveNueva.trim().length() < 4) {
            throw new RuntimeException("La nueva contraseña debe tener al menos 4 caracteres");
        }

        usuario.setPassword(passwordEncoder.encode(claveNueva));
        usuarioRepository.save(usuario);
    }
}
