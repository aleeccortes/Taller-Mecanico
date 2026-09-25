package com.Taller.Mecanico.service;

import com.Taller.Mecanico.dto.FacturaDTO;
import com.Taller.Mecanico.dto.ResumenFinancieroDTO;

import java.util.List;

public interface FacturaService {
    List<FacturaDTO> obtenerTodasLasFacturas();
    List<FacturaDTO> obtenerFacturasPorMes(int anio, int mes);
    FacturaDTO obtenerFacturaPorId(Long id);
    FacturaDTO crearFactura(FacturaDTO dto);
    FacturaDTO actualizarFactura(Long id, FacturaDTO dto);
    void eliminarFactura(Long id);
    ResumenFinancieroDTO obtenerResumenFinanciero();
    ResumenFinancieroDTO obtenerResumenFinancieroMensual(int anio, int mes);
}
