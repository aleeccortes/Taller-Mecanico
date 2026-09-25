package com.Taller.Mecanico.service;

import com.Taller.Mecanico.model.Turno;

public interface NotificacionService {
    void enviarRecordatorioEmail(Turno turno);
    void enviarRecordatorioWhatsApp(Turno turno);
    void procesarRecordatoriosProximosTurnos();
}
