package com.Taller.Mecanico.service;

import com.Taller.Mecanico.dto.SolicitudTurnoPublicoDTO;
import com.Taller.Mecanico.dto.TurnoDTO;
import com.Taller.Mecanico.model.EstadoTurno;

import java.util.List;

public interface TurnoService {
    List<TurnoDTO> obtenerTodosLosTurnos();
    TurnoDTO obtenerTurnoPorId(Long id);
    List<TurnoDTO> obtenerTurnosPorEstado(EstadoTurno estado);
    TurnoDTO solicitarTurnoPublico(SolicitudTurnoPublicoDTO dto);
    TurnoDTO crearTurno(TurnoDTO dto);
    TurnoDTO actualizarTurno(Long id, TurnoDTO dto);
    TurnoDTO cambiarEstadoTurno(Long id, EstadoTurno nuevoEstado);
    void eliminarTurno(Long id);
    List<TurnoDTO> buscarTurnos(String busqueda);
}
