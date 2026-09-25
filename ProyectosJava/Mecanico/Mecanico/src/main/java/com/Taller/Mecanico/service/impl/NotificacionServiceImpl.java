package com.Taller.Mecanico.service.impl;

import com.Taller.Mecanico.model.EstadoTurno;
import com.Taller.Mecanico.model.Turno;
import com.Taller.Mecanico.repository.TurnoRepository;
import com.Taller.Mecanico.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificacionServiceImpl implements NotificacionService {

    private final TurnoRepository turnoRepository;
    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @Override
    public void enviarRecordatorioEmail(Turno turno) {
        if (turno.getClienteEmail() == null || turno.getClienteEmail().isBlank()) {
            log.info("Turno ID {}: El cliente {} no posee email configurado.", turno.getId(), turno.getClienteNombre());
            return;
        }

        String asunto = "Recordatorio de Turno - Taller Mecánico";
        String mensaje = String.format(
                "Hola %s,\n\nTe recordamos que mañana tienes programado tu turno en el Taller Mecánico.\n" +
                "Detalles del turno:\n" +
                "- Vehículo: %s (Patente: %s)\n" +
                "- Servicio: %s\n" +
                "- Fecha y Hora: %s hs\n\n" +
                "¡Te esperamos!",
                turno.getClienteNombre(),
                turno.getVehiculoModelo(),
                turno.getVehiculoPatente(),
                turno.getServicio() != null ? turno.getServicio().getNombre() : "Servicio General",
                turno.getFechaHora().format(FORMATO_FECHA)
        );

        log.info("=================================================");
        log.info("ENVIANDO EMAIL RECORDATORIO A: {}", turno.getClienteEmail());
        log.info("ASUNTO: {}", asunto);
        log.info("MENSAJE:\n{}", mensaje);
        log.info("=================================================");

        turno.setRecordatorioEmailEnviado(true);
        turnoRepository.save(turno);
    }

    @Override
    public void enviarRecordatorioWhatsApp(Turno turno) {
        if (turno.getClienteTelefono() == null || turno.getClienteTelefono().isBlank()) {
            log.info("Turno ID {}: El cliente {} no posee número de teléfono.", turno.getId(), turno.getClienteNombre());
            return;
        }

        String textoMensaje = String.format(
                "Hola %s! Te recordamos tu turno en el Taller Mecánico para mañana %s hs con tu vehículo %s (%s). Te esperamos!",
                turno.getClienteNombre(),
                turno.getFechaHora().format(FORMATO_FECHA),
                turno.getVehiculoModelo(),
                turno.getVehiculoPatente()
        );

        String telefonoLimpio = turno.getClienteTelefono().replaceAll("[^0-9]", "");
        String linkWhatsapp = "https://api.whatsapp.com/send?phone=" + telefonoLimpio + "&text=" + URLEncoder.encode(textoMensaje, StandardCharsets.UTF_8);

        log.info("=================================================");
        log.info("ENVIANDO WHATSAPP RECORDATORIO A: {}", turno.getClienteTelefono());
        log.info("TEXTO WHATSAPP: {}", textoMensaje);
        log.info("LINK WHATSAPP DIRECTO: {}", linkWhatsapp);
        log.info("=================================================");

        turno.setRecordatorioWhatsappEnviado(true);
        turnoRepository.save(turno);
    }

    @Override
    public void procesarRecordatoriosProximosTurnos() {
        LocalDateTime inicioProximoDia = LocalDateTime.now().plusDays(1).withHour(0).withMinute(0);
        LocalDateTime finProximoDia = LocalDateTime.now().plusDays(1).withHour(23).withMinute(59);

        List<Turno> turnosManana = turnoRepository.findByFechaHoraBetween(inicioProximoDia, finProximoDia);

        log.info("Procesando tareas programadas de recordatorio. Turnos encontrados para mañana: {}", turnosManana.size());

        for (Turno turno : turnosManana) {
            if (turno.getEstado() == EstadoTurno.CANCELADO || turno.getEstado() == EstadoTurno.FINALIZADO) {
                continue;
            }

            if (Boolean.FALSE.equals(turno.getRecordatorioEmailEnviado())) {
                enviarRecordatorioEmail(turno);
            }

            if (Boolean.FALSE.equals(turno.getRecordatorioWhatsappEnviado())) {
                enviarRecordatorioWhatsApp(turno);
            }
        }
    }
}
