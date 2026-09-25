package com.Taller.Mecanico.service.impl;

import com.Taller.Mecanico.dto.ConsultaIADTO;
import com.Taller.Mecanico.dto.RespuestaIADTO;
import com.Taller.Mecanico.service.AgenteIAService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AgenteIAServiceImpl implements AgenteIAService {

    @Override
    public RespuestaIADTO consultarAgenteIA(ConsultaIADTO dto) {
        String consulta = dto.getConsulta() != null ? dto.getConsulta().toLowerCase() : "";
        String modelo = dto.getModeloVehiculo() != null ? dto.getModeloVehiculo() : "Vehículo";

        List<String> posiblesCausas = new ArrayList<>();
        String diagnostico;
        String recomendacion;
        String estimadoPrecio;

        if (consulta.contains("fren") || consulta.contains("ruido al frenar") || consulta.contains("chillar")) {
            diagnostico = "Posible desgaste severo en pastillas o discos de freno rayados en " + modelo + ".";
            posiblesCausas.add("Pastillas de freno cristalizadas o desgastadas.");
            posiblesCausas.add("Discos de freno deformados o gastados.");
            posiblesCausas.add("Falta de líquido de freno o aire en el circuito hídrico.");
            recomendacion = "Revisión inmediata del sistema de frenos por seguridad antes de realizar viajes largos.";
            estimadoPrecio = "$25.000 - $65.000 ARS (Repuestos y mano de obra)";
        } else if (consulta.contains("humo") || consulta.contains("escape") || consulta.contains("motor")) {
            diagnostico = "Problema en la combustión, inyección de combustible o fuga de aceite/refrigerante.";
            posiblesCausas.add("Humo negro: Exceso de combustible o filtro de aire tapado.");
            posiblesCausas.add("Humo azul: Consumo de aceite de motor por aros o retenes gastados.");
            posiblesCausas.add("Humo blanco: Junta de tapa de cilindro dañada o paso de refrigerante.");
            recomendacion = "Escaner computarizado de motor y prueba de compresión de cilindros.";
            estimadoPrecio = "$35.000 - $120.000 ARS (Según diagnóstico específico)";
        } else if (consulta.contains("bateria") || consulta.contains("arranc") || consulta.contains("luces")) {
            diagnostico = "Falla en el sistema eléctrico de arranque o carga de la batería.";
            posiblesCausas.add("Batería agotada o con celdas en cortocircuito.");
            posiblesCausas.add("Alternador defectuoso que no carga la batería.");
            posiblesCausas.add("Motor de arranque desgastado o carbones gastados.");
            recomendacion = "Medición de voltaje con voltímetro y prueba de carga de alternador.";
            estimadoPrecio = "$18.000 - $45.000 ARS";
        } else if (consulta.contains("vibr") || consulta.contains("direccion") || consulta.contains("volante")) {
            diagnostico = "Desalineación de dirección o desbalanceo en ruedas en " + modelo + ".";
            posiblesCausas.add("Neumáticos mal balanceados o deformados.");
            posiblesCausas.add("Cremallera de dirección o bujes de suspensión gastados.");
            posiblesCausas.add("Llantas dobladas.");
            recomendacion = "Alineación 3D, balanceo de ruedas y revisión del tren delantero.";
            estimadoPrecio = "$20.000 - $50.000 ARS";
        } else {
            diagnostico = "Consulta general recibida para " + modelo + ". Se recomienda inspección visual y escaneo.";
            posiblesCausas.add("Mantenimiento preventivo vencido.");
            posiblesCausas.add("Desgaste natural de piezas de fricción.");
            posiblesCausas.add("Filtros o bujías sucias.");
            recomendacion = "Agendar un turno en nuestro taller para revisión integral multipunto.";
            estimadoPrecio = "$15.000 - $40.000 ARS";
        }

        return RespuestaIADTO.builder()
                .diagnostico(diagnostico)
                .posiblesCausas(posiblesCausas)
                .recomendacion(recomendacion)
                .estimadoPrecio(estimadoPrecio)
                .build();
    }
}
