package com.Taller.Mecanico.controller;

import com.Taller.Mecanico.dto.SolicitudTurnoPublicoDTO;
import com.Taller.Mecanico.dto.ServicioDTO;
import com.Taller.Mecanico.dto.TurnoDTO;
import com.Taller.Mecanico.service.ServicioService;
import com.Taller.Mecanico.service.TurnoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publico")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PublicController {

    private final ServicioService servicioService;
    private final TurnoService turnoService;

    @GetMapping("/servicios")
    public ResponseEntity<List<ServicioDTO>> listarServiciosPublicos() {
        return ResponseEntity.ok(servicioService.obtenerServiciosActivos());
    }

    @PostMapping("/turnos")
    public ResponseEntity<TurnoDTO> solicitarTurnoPublico(@Valid @RequestBody SolicitudTurnoPublicoDTO solicitudDTO) {
        TurnoDTO turnoCreado = turnoService.solicitarTurnoPublico(solicitudDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(turnoCreado);
    }
}
