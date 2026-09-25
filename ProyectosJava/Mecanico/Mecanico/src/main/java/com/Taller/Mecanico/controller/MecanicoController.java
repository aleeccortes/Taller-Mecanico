package com.Taller.Mecanico.controller;

import com.Taller.Mecanico.dto.MecanicoDTO;
import com.Taller.Mecanico.service.MecanicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/mecanicos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MecanicoController {

    private final MecanicoService mecanicoService;

    @GetMapping
    public ResponseEntity<List<MecanicoDTO>> obtenerTodosLosMecanicos() {
        return ResponseEntity.ok(mecanicoService.obtenerTodosLosMecanicos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MecanicoDTO> obtenerMecanicoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(mecanicoService.obtenerMecanicoPorId(id));
    }

    @PostMapping
    public ResponseEntity<MecanicoDTO> crearMecanico(@Valid @RequestBody MecanicoDTO mecanicoDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mecanicoService.crearMecanico(mecanicoDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MecanicoDTO> actualizarMecanico(@PathVariable Long id, @Valid @RequestBody MecanicoDTO mecanicoDTO) {
        return ResponseEntity.ok(mecanicoService.actualizarMecanico(id, mecanicoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMecanico(@PathVariable Long id) {
        mecanicoService.eliminarMecanico(id);
        return ResponseEntity.noContent().build();
    }
}
