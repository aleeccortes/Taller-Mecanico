package com.Taller.Mecanico.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudTurnoPublicoDTO {

    @NotBlank(message = "El nombre del cliente es obligatorio")
    private String clienteNombre;

    @NotBlank(message = "El teléfono de contacto es obligatorio")
    private String clienteTelefono;

    private String clienteEmail;

    @NotBlank(message = "El modelo del vehículo es obligatorio")
    private String vehiculoModelo;

    @NotBlank(message = "La patente del vehículo es obligatoria")
    private String vehiculoPatente;

    @NotNull(message = "Debe seleccionar un servicio")
    private Long servicioId;

    @NotNull(message = "La fecha y hora del turno son obligatorias")
    private LocalDateTime fechaHora;

    private String notas;
}
