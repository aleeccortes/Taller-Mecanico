package com.Taller.Mecanico.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CambioClaveDTO {
    @NotBlank(message = "La contraseña actual es obligatoria")
    private String claveActual;

    @NotBlank(message = "La contraseña nueva es obligatoria")
    private String claveNueva;
}
