package com.Taller.Mecanico.service;

import com.Taller.Mecanico.dto.SolicitudTurnoPublicoDTO;
import com.Taller.Mecanico.dto.TurnoDTO;
import com.Taller.Mecanico.model.EstadoTurno;
import com.Taller.Mecanico.model.Servicio;
import com.Taller.Mecanico.model.Turno;
import com.Taller.Mecanico.repository.MecanicoRepository;
import com.Taller.Mecanico.repository.ServicioRepository;
import com.Taller.Mecanico.repository.TurnoRepository;
import com.Taller.Mecanico.service.impl.TurnoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TurnoServiceTest {

    @Mock
    private TurnoRepository turnoRepository;

    @Mock
    private ServicioRepository servicioRepository;

    @Mock
    private MecanicoRepository mecanicoRepository;

    @InjectMocks
    private TurnoServiceImpl turnoService;

    private Servicio servicioPrueba;
    private Turno turnoPrueba;

    @BeforeEach
    void setUp() {
        servicioPrueba = Servicio.builder()
                .id(1L)
                .nombre("Service de Frenos")
                .precio(new BigDecimal("55000.00"))
                .build();

        turnoPrueba = Turno.builder()
                .id(10L)
                .clienteNombre("Carlos Cliente")
                .clienteTelefono("11-5555-5555")
                .vehiculoModelo("Toyota Corolla")
                .vehiculoPatente("AB123CD")
                .servicio(servicioPrueba)
                .fechaHora(LocalDateTime.now().plusDays(2))
                .estado(EstadoTurno.PENDIENTE)
                .build();
    }

    @Test
    @DisplayName("JUnit 5: Debería solicitar turno público correctamente sin estar autenticado")
    void testSolicitarTurnoPublico() {
        SolicitudTurnoPublicoDTO solicitud = SolicitudTurnoPublicoDTO.builder()
                .clienteNombre("Carlos Cliente")
                .clienteTelefono("11-5555-5555")
                .vehiculoModelo("Toyota Corolla")
                .vehiculoPatente("AB123CD")
                .servicioId(1L)
                .fechaHora(LocalDateTime.now().plusDays(2))
                .notas("Revisar embrague")
                .build();

        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicioPrueba));
        when(turnoRepository.save(any(Turno.class))).thenReturn(turnoPrueba);

        TurnoDTO resultado = turnoService.solicitarTurnoPublico(solicitud);

        assertNotNull(resultado);
        assertEquals("Carlos Cliente", resultado.getClienteNombre());
        assertEquals(EstadoTurno.PENDIENTE, resultado.getEstado());
        verify(turnoRepository, times(1)).save(any(Turno.class));
    }

    @Test
    @DisplayName("JUnit 5: Debería cambiar el estado de un turno por el administrador")
    void testCambiarEstadoTurno() {
        when(turnoRepository.findById(10L)).thenReturn(Optional.of(turnoPrueba));
        when(turnoRepository.save(any(Turno.class))).thenAnswer(i -> i.getArgument(0));

        TurnoDTO actualizado = turnoService.cambiarEstadoTurno(10L, EstadoTurno.FINALIZADO);

        assertNotNull(actualizado);
        assertEquals(EstadoTurno.FINALIZADO, actualizado.getEstado());
    }
}
