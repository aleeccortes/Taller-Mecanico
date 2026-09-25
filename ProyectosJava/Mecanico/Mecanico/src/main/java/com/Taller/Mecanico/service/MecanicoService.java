package com.Taller.Mecanico.service;

import com.Taller.Mecanico.dto.MecanicoDTO;

import java.util.List;

public interface MecanicoService {
    List<MecanicoDTO> obtenerTodosLosMecanicos();
    List<MecanicoDTO> obtenerMecanicosActivos();
    MecanicoDTO obtenerMecanicoPorId(Long id);
    MecanicoDTO crearMecanico(MecanicoDTO dto);
    MecanicoDTO actualizarMecanico(Long id, MecanicoDTO dto);
    void eliminarMecanico(Long id);
}
