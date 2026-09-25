package com.Taller.Mecanico.controller;

import com.Taller.Mecanico.dto.ServicioDTO;
import com.Taller.Mecanico.service.ServicioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/servicios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServicioController {

    private final ServicioService servicioService;

    @GetMapping
    public ResponseEntity<List<ServicioDTO>> obtenerTodosLosServicios() {
        return ResponseEntity.ok(servicioService.obtenerTodosLosServicios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicioDTO> obtenerServicioPorId(@PathVariable Long id) {
        return ResponseEntity.ok(servicioService.obtenerServicioPorId(id));
    }

    @PostMapping
    public ResponseEntity<ServicioDTO> crearServicio(@Valid @RequestBody ServicioDTO servicioDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicioService.crearServicio(servicioDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServicioDTO> actualizarServicio(@PathVariable Long id, @Valid @RequestBody ServicioDTO servicioDTO) {
        return ResponseEntity.ok(servicioService.actualizarServicio(id, servicioDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
        return ResponseEntity.noContent().build();
    }
}
