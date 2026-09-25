package com.Taller.Mecanico.repository;

import com.Taller.Mecanico.model.EstadoTurno;
import com.Taller.Mecanico.model.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByEstado(EstadoTurno estado);
    List<Turno> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Turno> findByClienteNombreContainingIgnoreCaseOrVehiculoPatenteContainingIgnoreCase(String clienteNombre, String patente);
}
