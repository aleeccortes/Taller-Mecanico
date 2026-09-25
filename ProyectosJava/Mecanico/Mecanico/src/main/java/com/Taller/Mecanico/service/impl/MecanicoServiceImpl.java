package com.Taller.Mecanico.service.impl;

import com.Taller.Mecanico.dto.MecanicoDTO;
import com.Taller.Mecanico.model.Mecanico;
import com.Taller.Mecanico.repository.MecanicoRepository;
import com.Taller.Mecanico.service.MecanicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MecanicoServiceImpl implements MecanicoService {

    private final MecanicoRepository mecanicoRepository;

    @Override
    public List<MecanicoDTO> obtenerTodosLosMecanicos() {
        return mecanicoRepository.findAll().stream()
                .map(this::convertirAEntidadDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MecanicoDTO> obtenerMecanicosActivos() {
        return mecanicoRepository.findByActivoTrue().stream()
                .map(this::convertirAEntidadDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MecanicoDTO obtenerMecanicoPorId(Long id) {
        Mecanico mecanico = mecanicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mecánico no encontrado con id: " + id));
        return convertirAEntidadDTO(mecanico);
    }

    @Override
    public MecanicoDTO crearMecanico(MecanicoDTO dto) {
        Mecanico mecanico = Mecanico.builder()
                .nombre(dto.getNombre())
                .especialidad(dto.getEspecialidad())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();
        Mecanico guardado = mecanicoRepository.save(mecanico);
        return convertirAEntidadDTO(guardado);
    }

    @Override
    public MecanicoDTO actualizarMecanico(Long id, MecanicoDTO dto) {
        Mecanico mecanico = mecanicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mecánico no encontrado con id: " + id));

        mecanico.setNombre(dto.getNombre());
        mecanico.setEspecialidad(dto.getEspecialidad());
        mecanico.setTelefono(dto.getTelefono());
        mecanico.setEmail(dto.getEmail());
        if (dto.getActivo() != null) {
            mecanico.setActivo(dto.getActivo());
        }

        Mecanico actualizado = mecanicoRepository.save(mecanico);
        return convertirAEntidadDTO(actualizado);
    }

    @Override
    public void eliminarMecanico(Long id) {
        if (!mecanicoRepository.existsById(id)) {
            throw new RuntimeException("Mecánico no encontrado con id: " + id);
        }
        mecanicoRepository.deleteById(id);
    }

    private MecanicoDTO convertirAEntidadDTO(Mecanico mecanico) {
        return MecanicoDTO.builder()
                .id(mecanico.getId())
                .nombre(mecanico.getNombre())
                .especialidad(mecanico.getEspecialidad())
                .telefono(mecanico.getTelefono())
                .email(mecanico.getEmail())
                .activo(mecanico.getActivo())
                .build();
    }
}
