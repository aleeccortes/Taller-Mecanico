package com.Taller.Mecanico.controller;

import com.Taller.Mecanico.dto.FacturaDTO;
import com.Taller.Mecanico.dto.ResumenFinancieroDTO;
import com.Taller.Mecanico.service.FacturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/facturas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FacturaController {

    private final FacturaService facturaService;

    @GetMapping
    public ResponseEntity<List<FacturaDTO>> obtenerFacturas(@RequestParam(required = false) Integer anio,
                                                             @RequestParam(required = false) Integer mes) {
        if (anio != null && mes != null) {
            return ResponseEntity.ok(facturaService.obtenerFacturasPorMes(anio, mes));
        }
        return ResponseEntity.ok(facturaService.obtenerTodasLasFacturas());
    }

    @GetMapping("/resumen")
    public ResponseEntity<ResumenFinancieroDTO> obtenerResumenFinanciero(@RequestParam(required = false) Integer anio,
                                                                          @RequestParam(required = false) Integer mes) {
        if (anio != null && mes != null) {
            return ResponseEntity.ok(facturaService.obtenerResumenFinancieroMensual(anio, mes));
        }
        return ResponseEntity.ok(facturaService.obtenerResumenFinanciero());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacturaDTO> obtenerFacturaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(facturaService.obtenerFacturaPorId(id));
    }

    @PostMapping
    public ResponseEntity<FacturaDTO> crearFactura(@Valid @RequestBody FacturaDTO facturaDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facturaService.crearFactura(facturaDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacturaDTO> actualizarFactura(@PathVariable Long id, @Valid @RequestBody FacturaDTO facturaDTO) {
        return ResponseEntity.ok(facturaService.actualizarFactura(id, facturaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarFactura(@PathVariable Long id) {
        facturaService.eliminarFactura(id);
        return ResponseEntity.noContent().build();
    }
}
