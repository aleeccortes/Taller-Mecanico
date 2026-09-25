package com.Taller.Mecanico.service;

import com.Taller.Mecanico.dto.LoginRequestDTO;
import com.Taller.Mecanico.dto.LoginResponseDTO;

public interface AuthService {
    LoginResponseDTO iniciarSesion(LoginRequestDTO dto);
    void registrarAdminInicial(String username, String password);
}
