package com.Taller.Mecanico.controller;

import com.Taller.Mecanico.dto.TurnoDTO;
import com.Taller.Mecanico.model.EstadoTurno;
import com.Taller.Mecanico.service.TurnoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/turnos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TurnoController {

    private final TurnoService turnoService;

    @GetMapping
    public ResponseEntity<List<TurnoDTO>> obtenerTodosLosTurnos(@RequestParam(required = false) EstadoTurno estado,
                                                                 @RequestParam(required = false) String buscar) {
        if (buscar != null && !buscar.isBlank()) {
            return ResponseEntity.ok(turnoService.buscarTurnos(buscar));
        }
        if (estado != null) {
            return ResponseEntity.ok(turnoService.obtenerTurnosPorEstado(estado));
        }
        return ResponseEntity.ok(turnoService.obtenerTodosLosTurnos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurnoDTO> obtenerTurnoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(turnoService.obtenerTurnoPorId(id));
    }

    @PostMapping
    public ResponseEntity<TurnoDTO> crearTurno(@Valid @RequestBody TurnoDTO turnoDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(turnoService.crearTurno(turnoDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurnoDTO> actualizarTurno(@PathVariable Long id, @Valid @RequestBody TurnoDTO turnoDTO) {
        return ResponseEntity.ok(turnoService.actualizarTurno(id, turnoDTO));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<TurnoDTO> cambiarEstadoTurno(@PathVariable Long id, @RequestParam EstadoTurno estado) {
        return ResponseEntity.ok(turnoService.cambiarEstadoTurno(id, estado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTurno(@PathVariable Long id) {
        turnoService.eliminarTurno(id);
        return ResponseEntity.noContent().build();
    }
}
