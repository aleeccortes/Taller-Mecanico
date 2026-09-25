package com.Taller.Mecanico.dto;

import com.Taller.Mecanico.model.EstadoTurno;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurnoDTO {
    private Long id;
    private String clienteNombre;
    private String clienteTelefono;
    private String clienteEmail;
    private String vehiculoModelo;
    private String vehiculoPatente;
    private Long servicioId;
    private String servicioNombre;
    private Long mecanicoId;
    private String mecanicoNombre;
    private LocalDateTime fechaHora;
    private EstadoTurno estado;
    private String notas;
    private Boolean recordatorioEmailEnviado;
    private Boolean recordatorioWhatsappEnviado;
}
