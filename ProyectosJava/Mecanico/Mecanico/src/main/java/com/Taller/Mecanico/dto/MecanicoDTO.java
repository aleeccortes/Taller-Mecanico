package com.Taller.Mecanico.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MecanicoDTO {
    private Long id;

    @NotBlank(message = "El nombre del mecánico es obligatorio")
    private String nombre;

    private String especialidad;
    private String telefono;
    private String email;
    private Boolean activo;
}
