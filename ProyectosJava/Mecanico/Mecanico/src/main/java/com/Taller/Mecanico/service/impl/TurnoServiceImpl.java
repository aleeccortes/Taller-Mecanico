package com.Taller.Mecanico.service.impl;

import com.Taller.Mecanico.dto.SolicitudTurnoPublicoDTO;
import com.Taller.Mecanico.dto.TurnoDTO;
import com.Taller.Mecanico.model.EstadoTurno;
import com.Taller.Mecanico.model.Mecanico;
import com.Taller.Mecanico.model.Servicio;
import com.Taller.Mecanico.model.Turno;
import com.Taller.Mecanico.repository.MecanicoRepository;
import com.Taller.Mecanico.repository.ServicioRepository;
import com.Taller.Mecanico.repository.TurnoRepository;
import com.Taller.Mecanico.service.NotificacionService;
import com.Taller.Mecanico.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TurnoServiceImpl implements TurnoService {

    private final TurnoRepository turnoRepository;
    private final ServicioRepository servicioRepository;
    private final MecanicoRepository mecanicoRepository;
    private final NotificacionService notificacionService;

    @Override
    public List<TurnoDTO> obtenerTodosLosTurnos() {
        return turnoRepository.findAll().stream()
                .map(this::convertirAEntidadDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TurnoDTO obtenerTurnoPorId(Long id) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado con id: " + id));
        return convertirAEntidadDTO(turno);
    }

    @Override
    public List<TurnoDTO> obtenerTurnosPorEstado(EstadoTurno estado) {
        return turnoRepository.findByEstado(estado).stream()
                .map(this::convertirAEntidadDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TurnoDTO solicitarTurnoPublico(SolicitudTurnoPublicoDTO dto) {
        Servicio servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new RuntimeException("Servicio seleccionado no encontrado"));

        Turno turno = Turno.builder()
                .clienteNombre(dto.getClienteNombre())
                .clienteTelefono(dto.getClienteTelefono())
                .clienteEmail(dto.getClienteEmail())
                .vehiculoModelo(dto.getVehiculoModelo())
                .vehiculoPatente(dto.getVehiculoPatente())
                .servicio(servicio)
                .fechaHora(dto.getFechaHora())
                .estado(EstadoTurno.PENDIENTE)
                .notas(dto.getNotas())
                .recordatorioEmailEnviado(false)
                .recordatorioWhatsappEnviado(false)
                .build();

        Turno guardado = turnoRepository.save(turno);
        return convertirAEntidadDTO(guardado);
    }

    @Override
    public TurnoDTO crearTurno(TurnoDTO dto) {
        Servicio servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con id: " + dto.getServicioId()));

        Mecanico mecanico = null;
        if (dto.getMecanicoId() != null) {
            mecanico = mecanicoRepository.findById(dto.getMecanicoId())
                    .orElse(null);
        }

        Turno turno = Turno.builder()
                .clienteNombre(dto.getClienteNombre())
                .clienteTelefono(dto.getClienteTelefono())
                .clienteEmail(dto.getClienteEmail())
                .vehiculoModelo(dto.getVehiculoModelo())
                .vehiculoPatente(dto.getVehiculoPatente())
                .servicio(servicio)
                .mecanico(mecanico)
                .fechaHora(dto.getFechaHora())
                .estado(dto.getEstado() != null ? dto.getEstado() : EstadoTurno.PENDIENTE)
                .notas(dto.getNotas())
                .recordatorioEmailEnviado(false)
                .recordatorioWhatsappEnviado(false)
                .build();

        Turno guardado = turnoRepository.save(turno);
        return convertirAEntidadDTO(guardado);
    }

    @Override
    public TurnoDTO actualizarTurno(Long id, TurnoDTO dto) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado con id: " + id));

        Servicio servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con id: " + dto.getServicioId()));

        Mecanico mecanico = null;
        if (dto.getMecanicoId() != null) {
            mecanico = mecanicoRepository.findById(dto.getMecanicoId())
                    .orElse(null);
        }

        turno.setClienteNombre(dto.getClienteNombre());
        turno.setClienteTelefono(dto.getClienteTelefono());
        turno.setClienteEmail(dto.getClienteEmail());
        turno.setVehiculoModelo(dto.getVehiculoModelo());
        turno.setVehiculoPatente(dto.getVehiculoPatente());
        turno.setServicio(servicio);
        turno.setMecanico(mecanico);
        turno.setFechaHora(dto.getFechaHora());
        if (dto.getEstado() != null) {
            turno.setEstado(dto.getEstado());
        }
        turno.setNotas(dto.getNotas());

        Turno actualizado = turnoRepository.save(turno);
        return convertirAEntidadDTO(actualizado);
    }

    @Override
    public TurnoDTO cambiarEstadoTurno(Long id, EstadoTurno nuevoEstado) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado con id: " + id));
        turno.setEstado(nuevoEstado);
        Turno actualizado = turnoRepository.save(turno);
        return convertirAEntidadDTO(actualizado);
    }

    @Override
    public void eliminarTurno(Long id) {
        if (!turnoRepository.existsById(id)) {
            throw new RuntimeException("Turno no encontrado con id: " + id);
        }
        turnoRepository.deleteById(id);
    }

    @Override
    public List<TurnoDTO> buscarTurnos(String busqueda) {
        return turnoRepository.findByClienteNombreContainingIgnoreCaseOrVehiculoPatenteContainingIgnoreCase(busqueda, busqueda)
                .stream()
                .map(this::convertirAEntidadDTO)
                .collect(Collectors.toList());
    }

    private TurnoDTO convertirAEntidadDTO(Turno turno) {
        return TurnoDTO.builder()
                .id(turno.getId())
                .clienteNombre(turno.getClienteNombre())
                .clienteTelefono(turno.getClienteTelefono())
                .clienteEmail(turno.getClienteEmail())
                .vehiculoModelo(turno.getVehiculoModelo())
                .vehiculoPatente(turno.getVehiculoPatente())
                .servicioId(turno.getServicio() != null ? turno.getServicio().getId() : null)
                .servicioNombre(turno.getServicio() != null ? turno.getServicio().getNombre() : null)
                .mecanicoId(turno.getMecanico() != null ? turno.getMecanico().getId() : null)
                .mecanicoNombre(turno.getMecanico() != null ? turno.getMecanico().getNombre() : null)
                .fechaHora(turno.getFechaHora())
                .estado(turno.getEstado())
                .notas(turno.getNotas())
                .recordatorioEmailEnviado(turno.getRecordatorioEmailEnviado())
                .recordatorioWhatsappEnviado(turno.getRecordatorioWhatsappEnviado())
                .build();
    }
}
