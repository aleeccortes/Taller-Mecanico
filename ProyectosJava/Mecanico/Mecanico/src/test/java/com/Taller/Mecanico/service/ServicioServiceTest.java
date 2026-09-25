package com.Taller.Mecanico.service;

import com.Taller.Mecanico.dto.ServicioDTO;
import com.Taller.Mecanico.model.Servicio;
import com.Taller.Mecanico.repository.ServicioRepository;
import com.Taller.Mecanico.service.impl.ServicioServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ServicioServiceTest {

    @Mock
    private ServicioRepository servicioRepository;

    @InjectMocks
    private ServicioServiceImpl servicioService;

    private Servicio servicioPrueba;

    @BeforeEach
    void setUp() {
        servicioPrueba = Servicio.builder()
                .id(1L)
                .nombre("Cambio de Aceite")
                .descripcion("Servicio completo de cambio de aceite y filtro")
                .precio(new BigDecimal("35000.00"))
                .tiempoEstimadoMinutos(45)
                .activo(true)
                .build();
    }

    @Test
    @DisplayName("JUnit 5: Debería obtener todos los servicios activos correctamente")
    void testObtenerServiciosActivos() {
        when(servicioRepository.findByActivoTrue()).thenReturn(List.of(servicioPrueba));

        List<ServicioDTO> resultado = servicioService.obtenerServiciosActivos();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Cambio de Aceite", resultado.get(0).getNombre());
        verify(servicioRepository, times(1)).findByActivoTrue();
    }

    @Test
    @DisplayName("JUnit 5: Debería obtener un servicio por ID existente")
    void testObtenerServicioPorId() {
        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicioPrueba));

        ServicioDTO resultado = servicioService.obtenerServicioPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Cambio de Aceite", resultado.getNombre());
    }

    @Test
    @DisplayName("JUnit 5: Debería lanzar excepción si el servicio por ID no existe")
    void testObtenerServicioPorIdNoEncontrado() {
        when(servicioRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> servicioService.obtenerServicioPorId(99L));
    }

    @Test
    @DisplayName("JUnit 5: Debería crear un nuevo servicio exitosamente")
    void testCrearServicio() {
        ServicioDTO inputDTO = ServicioDTO.builder()
                .nombre("Alineación y Balanceo")
                .descripcion("Alineación 3D")
                .precio(new BigDecimal("28000.00"))
                .tiempoEstimadoMinutos(60)
                .build();

        when(servicioRepository.save(any(Servicio.class))).thenAnswer(invocation -> {
            Servicio s = invocation.getArgument(0);
            s.setId(2L);
            return s;
        });

        ServicioDTO creado = servicioService.crearServicio(inputDTO);

        assertNotNull(creado);
        assertEquals(2L, creado.getId());
        assertEquals("Alineación y Balanceo", creado.getNombre());
        verify(servicioRepository, times(1)).save(any(Servicio.class));
    }
}
