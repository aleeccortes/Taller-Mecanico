package com.Taller.Mecanico.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mecanicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mecanico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String especialidad;

    private String telefono;

    private String email;

    @Builder.Default
    private Boolean activo = true;
}
