package com.Taller.Mecanico.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String token;
    private String username;
    private String rol;
    private String mensaje;
}
