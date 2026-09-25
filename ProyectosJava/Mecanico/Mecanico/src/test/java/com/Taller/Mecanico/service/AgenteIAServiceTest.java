package com.Taller.Mecanico.service;

import com.Taller.Mecanico.dto.ConsultaIADTO;
import com.Taller.Mecanico.dto.RespuestaIADTO;
import com.Taller.Mecanico.service.impl.AgenteIAServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class AgenteIAServiceTest {

    private final AgenteIAServiceImpl agenteIAService = new AgenteIAServiceImpl();

    @Test
    @DisplayName("JUnit 5: Debería generar un pre-diagnóstico de frenos para la IA del taller")
    void testConsultarAgenteIAFrenos() {
        ConsultaIADTO consulta = new ConsultaIADTO("Tengo un ruido metalico al frenar", "Ford Focus");

        RespuestaIADTO respuesta = agenteIAService.consultarAgenteIA(consulta);

        assertNotNull(respuesta);
        assertTrue(respuesta.getDiagnostico().toLowerCase().contains("frenos"));
        assertNotNull(respuesta.getEstimadoPrecio());
        assertFalse(respuesta.getPosiblesCausas().isEmpty());
    }
}
