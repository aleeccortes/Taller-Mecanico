package com.Taller.Mecanico.service.impl;

import com.Taller.Mecanico.dto.ServicioDTO;
import com.Taller.Mecanico.model.Servicio;
import com.Taller.Mecanico.repository.ServicioRepository;
import com.Taller.Mecanico.service.ServicioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicioServiceImpl implements ServicioService {

    private final ServicioRepository servicioRepository;

    @Override
    public List<ServicioDTO> obtenerTodosLosServicios() {
        return servicioRepository.findAll().stream()
                .map(this::convertirAEntidadDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ServicioDTO> obtenerServiciosActivos() {
        return servicioRepository.findByActivoTrue().stream()
                .map(this::convertirAEntidadDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ServicioDTO obtenerServicioPorId(Long id) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con id: " + id));
        return convertirAEntidadDTO(servicio);
    }

    @Override
    public ServicioDTO crearServicio(ServicioDTO dto) {
        Servicio servicio = Servicio.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precio(dto.getPrecio())
                .tiempoEstimadoMinutos(dto.getTiempoEstimadoMinutos())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();
        Servicio guardado = servicioRepository.save(servicio);
        return convertirAEntidadDTO(guardado);
    }

    @Override
    public ServicioDTO actualizarServicio(Long id, ServicioDTO dto) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con id: " + id));
        
        servicio.setNombre(dto.getNombre());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setPrecio(dto.getPrecio());
        servicio.setTiempoEstimadoMinutos(dto.getTiempoEstimadoMinutos());
        if (dto.getActivo() != null) {
            servicio.setActivo(dto.getActivo());
        }

        Servicio actualizado = servicioRepository.save(servicio);
        return convertirAEntidadDTO(actualizado);
    }

    @Override
    public void eliminarServicio(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new RuntimeException("Servicio no encontrado con id: " + id);
        }
        servicioRepository.deleteById(id);
    }

    private ServicioDTO convertirAEntidadDTO(Servicio servicio) {
        return ServicioDTO.builder()
                .id(servicio.getId())
                .nombre(servicio.getNombre())
                .descripcion(servicio.getDescripcion())
                .precio(servicio.getPrecio())
                .tiempoEstimadoMinutos(servicio.getTiempoEstimadoMinutos())
                .activo(servicio.getActivo())
                .build();
    }
}
