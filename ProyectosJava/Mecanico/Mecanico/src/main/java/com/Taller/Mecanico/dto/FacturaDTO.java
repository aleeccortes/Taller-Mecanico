package com.Taller.Mecanico.dto;

import com.Taller.Mecanico.model.TipoFactura;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacturaDTO {
    private Long id;
    private Long turnoId;

    @NotNull(message = "El tipo de registro (INGRESO/GASTO) es obligatorio")
    private TipoFactura tipo;

    @NotBlank(message = "El concepto es obligatorio")
    private String concepto;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    private BigDecimal monto;

    private LocalDateTime fecha;
    private String metodoPago;
    private String detalles;
}
