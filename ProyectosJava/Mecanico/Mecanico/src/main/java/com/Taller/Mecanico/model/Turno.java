package com.Taller.Mecanico.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "turnos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String clienteNombre;

    @Column(nullable = false)
    private String clienteTelefono;

    private String clienteEmail;

    @Column(nullable = false)
    private String vehiculoModelo;

    @Column(nullable = false)
    private String vehiculoPatente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "servicio_id", nullable = false)
    private Servicio servicio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mecanico_id")
    private Mecanico mecanico;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoTurno estado = EstadoTurno.PENDIENTE;

    @Column(length = 1000)
    private String notas;
}
