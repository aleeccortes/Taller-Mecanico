package com.Taller.Mecanico.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumenFinancieroDTO {
    private BigDecimal totalIngresos;
    private BigDecimal totalGastos;
    private BigDecimal balanceNeto;
    private long cantidadFacturasIngreso;
    private long cantidadFacturasGasto;
}
