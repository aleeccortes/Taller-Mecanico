package com.Taller.Mecanico.service;

import com.Taller.Mecanico.dto.ConsultaIADTO;
import com.Taller.Mecanico.dto.RespuestaIADTO;

public interface AgenteIAService {
    RespuestaIADTO consultarAgenteIA(ConsultaIADTO dto);
}
