package com.Taller.Mecanico.config;

import com.Taller.Mecanico.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RecordatorioTask {

    private final NotificacionService notificacionService;

    // Se ejecuta automáticamente todos los días a las 09:00 AM (y cada hora para verificación de turnos)
    @Scheduled(cron = "0 0 9 * * ?")
    @Scheduled(fixedRate = 3600000) // Revisa cada 1 hora los turnos del día siguiente
    public void ejecutarEnvioDeRecordatorios() {
        log.info("Iniciando tarea programada: Verificación de turnos 1 día antes para recordatorios...");
        notificacionService.procesarRecordatoriosProximosTurnos();
    }
}
