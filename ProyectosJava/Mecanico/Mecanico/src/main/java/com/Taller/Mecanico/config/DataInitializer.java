package com.Taller.Mecanico.config;

import com.Taller.Mecanico.model.*;
import com.Taller.Mecanico.repository.*;
import com.Taller.Mecanico.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AuthService authService;
    private final ServicioRepository servicioRepository;
    private final MecanicoRepository mecanicoRepository;
    private final TurnoRepository turnoRepository;
    private final FacturaRepository facturaRepository;

    @Override
    public void run(String... args) {
        // 1. Inicializar usuario Administrador
        authService.registrarAdminInicial("admin", "admin123");

        // 2. Cargar servicios si no existen
        if (servicioRepository.count() == 0) {
            Servicio s1 = servicioRepository.save(Servicio.builder()
                    .nombre("Cambio de Aceite y Filtros")
                    .descripcion("Reemplazo de aceite sintético 5W30, filtro de aceite, aire y habitáculo con revisión multipunto.")
                    .precio(new BigDecimal("35000.00"))
                    .tiempoEstimadoMinutos(45)
                    .imagenUrl("https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80")
                    .activo(true)
                    .build());

            Servicio s2 = servicioRepository.save(Servicio.builder()
                    .nombre("Alineación 3D y Balanceo")
                    .descripcion("Alineación computarizada del tren delantero y trasero + balanceo de las 4 ruedas.")
                    .precio(new BigDecimal("28000.00"))
                    .tiempoEstimadoMinutos(60)
                    .imagenUrl("https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80")
                    .activo(true)
                    .build());

            Servicio s3 = servicioRepository.save(Servicio.builder()
                    .nombre("Service de Frenos Integral")
                    .descripcion("Reemplazo de pastillas de freno, rectificación de discos y purga de líquido de freno dot4.")
                    .precio(new BigDecimal("55000.00"))
                    .tiempoEstimadoMinutos(90)
                    .imagenUrl("https://images.unsplash.com/photo-1600792896570-58d048fae08f?auto=format&fit=crop&w=800&q=80")
                    .activo(true)
                    .build());

            Servicio s4 = servicioRepository.save(Servicio.builder()
                    .nombre("Escaneo y Diagnóstico OBD2")
                    .descripcion("Diagnóstico completo de computadora, lectura y borrado de códigos de falla ECU.")
                    .precio(new BigDecimal("20000.00"))
                    .tiempoEstimadoMinutos(30)
                    .imagenUrl("https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80")
                    .activo(true)
                    .build());

            // 3. Cargar mecánicos
            if (mecanicoRepository.count() == 0) {
                Mecanico m1 = mecanicoRepository.save(Mecanico.builder()
                        .nombre("Carlos Rodríguez")
                        .especialidad("Electrónica e Inyección")
                        .telefono("11-4567-8901")
                        .email("carlos.mecanica@taller.com")
                        .activo(true)
                        .build());

                Mecanico m2 = mecanicoRepository.save(Mecanico.builder()
                        .nombre("Roberto Gómez")
                        .especialidad("Frenos y Suspensión")
                        .telefono("11-9876-5432")
                        .email("roberto.frenos@taller.com")
                        .activo(true)
                        .build());

                // 4. Cargar turnos de prueba
                if (turnoRepository.count() == 0) {
                    Turno t1 = turnoRepository.save(Turno.builder()
                            .clienteNombre("Juan Pérez")
                            .clienteTelefono("11-2233-4455")
                            .clienteEmail("juan.perez@email.com")
                            .vehiculoModelo("Volkswagen Gol Trend 2018")
                            .vehiculoPatente("AA123BC")
                            .servicio(s1)
                            .mecanico(m1)
                            .fechaHora(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0))
                            .estado(EstadoTurno.PENDIENTE)
                            .notas("Cliente solicita revisar nivel de refrigerante.")
                            .build());

                    Turno t2 = turnoRepository.save(Turno.builder()
                            .clienteNombre("Martín González")
                            .clienteTelefono("11-6677-8899")
                            .clienteEmail("mgonzalez@email.com")
                            .vehiculoModelo("Ford Focus 2.0 2020")
                            .vehiculoPatente("AD987EF")
                            .servicio(s3)
                            .mecanico(m2)
                            .fechaHora(LocalDateTime.now().minusDays(1).withHour(14).withMinute(30))
                            .estado(EstadoTurno.FINALIZADO)
                            .notas("Service de frenos completo realizado exitosamente.")
                            .build());

                    // 5. Cargar facturación inicial (Ingresos y Gastos)
                    if (facturaRepository.count() == 0) {
                        facturaRepository.save(Factura.builder()
                                .turno(t2)
                                .tipo(TipoFactura.INGRESO)
                                .concepto("Cobro por Service de Frenos Integral - Ford Focus AD987EF")
                                .monto(new BigDecimal("55000.00"))
                                .fecha(LocalDateTime.now().minusDays(1))
                                .metodoPago("Tarjeta de Débito")
                                .detalles("Factura A #0001-00004582")
                                .build());

                        facturaRepository.save(Factura.builder()
                                .tipo(TipoFactura.GASTO)
                                .concepto("Compra de Repuestos e Insumos (Aceite Shell Helix 5W30 + Filtros Bosch)")
                                .monto(new BigDecimal("22500.00"))
                                .fecha(LocalDateTime.now().minusDays(2))
                                .metodoPago("Transferencia BANCARIA")
                                .detalles("Proveedor Distribuidora Automotriz S.A.")
                                .build());
                    }
                }
            }
        }
    }
}
