package com.Taller.Mecanico.service;

import com.Taller.Mecanico.dto.ServicioDTO;

import java.util.List;

public interface ServicioService {
    List<ServicioDTO> obtenerTodosLosServicios();
    List<ServicioDTO> obtenerServiciosActivos();
    ServicioDTO obtenerServicioPorId(Long id);
    ServicioDTO crearServicio(ServicioDTO dto);
    ServicioDTO actualizarServicio(Long id, ServicioDTO dto);
    void eliminarServicio(Long id);
}
