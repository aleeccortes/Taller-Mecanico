package com.Taller.Mecanico.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RespuestaIADTO {
    private String diagnostico;
    private String recomendacion;
    private String estimadoPrecio;
    private List<String> posiblesCausas;
}
