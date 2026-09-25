package com.Taller.Mecanico.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultaIADTO {
    @NotBlank(message = "La consulta no puede estar vacía")
    private String consulta;
    private String modeloVehiculo;
}
