package com.Taller.Mecanico.controller;

import com.Taller.Mecanico.dto.ConsultaIADTO;
import com.Taller.Mecanico.dto.RespuestaIADTO;
import com.Taller.Mecanico.service.AgenteIAService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ia")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AgenteIAController {

    private final AgenteIAService agenteIAService;

    @PostMapping("/consultar")
    public ResponseEntity<RespuestaIADTO> consultarAgenteIA(@Valid @RequestBody ConsultaIADTO consultaDTO) {
        RespuestaIADTO respuesta = agenteIAService.consultarAgenteIA(consultaDTO);
        return ResponseEntity.ok(respuesta);
    }
}
