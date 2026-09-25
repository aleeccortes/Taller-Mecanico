package com.Taller.Mecanico.service.impl;

import com.Taller.Mecanico.dto.FacturaDTO;
import com.Taller.Mecanico.dto.ResumenFinancieroDTO;
import com.Taller.Mecanico.model.Factura;
import com.Taller.Mecanico.model.TipoFactura;
import com.Taller.Mecanico.model.Turno;
import com.Taller.Mecanico.repository.FacturaRepository;
import com.Taller.Mecanico.repository.TurnoRepository;
import com.Taller.Mecanico.service.FacturaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacturaServiceImpl implements FacturaService {

    private final FacturaRepository facturaRepository;
    private final TurnoRepository turnoRepository;

    @Override
    public List<FacturaDTO> obtenerTodasLasFacturas() {
        return facturaRepository.findAll().stream()
                .map(this::convertirAEntidadDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FacturaDTO> obtenerFacturasPorMes(int anio, int mes) {
        return facturaRepository.findByAnioYMes(anio, mes).stream()
                .map(this::convertirAEntidadDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FacturaDTO obtenerFacturaPorId(Long id) {
        Factura factura = facturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada con id: " + id));
        return convertirAEntidadDTO(factura);
    }

    @Override
    public FacturaDTO crearFactura(FacturaDTO dto) {
        Turno turno = null;
        if (dto.getTurnoId() != null) {
            turno = turnoRepository.findById(dto.getTurnoId()).orElse(null);
        }

        Factura factura = Factura.builder()
                .turno(turno)
                .tipo(dto.getTipo())
                .concepto(dto.getConcepto())
                .monto(dto.getMonto())
                .fecha(dto.getFecha() != null ? dto.getFecha() : LocalDateTime.now())
                .metodoPago(dto.getMetodoPago())
                .detalles(dto.getDetalles())
                .build();

        Factura guardada = facturaRepository.save(factura);
        return convertirAEntidadDTO(guardada);
    }

    @Override
    public FacturaDTO actualizarFactura(Long id, FacturaDTO dto) {
        Factura factura = facturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada con id: " + id));

        Turno turno = null;
        if (dto.getTurnoId() != null) {
            turno = turnoRepository.findById(dto.getTurnoId()).orElse(null);
        }

        factura.setTurno(turno);
        factura.setTipo(dto.getTipo());
        factura.setConcepto(dto.getConcepto());
        factura.setMonto(dto.getMonto());
        if (dto.getFecha() != null) {
            factura.setFecha(dto.getFecha());
        }
        factura.setMetodoPago(dto.getMetodoPago());
        factura.setDetalles(dto.getDetalles());

        Factura actualizada = facturaRepository.save(factura);
        return convertirAEntidadDTO(actualizada);
    }

    @Override
    public void eliminarFactura(Long id) {
        if (!facturaRepository.existsById(id)) {
            throw new RuntimeException("Factura no encontrada con id: " + id);
        }
        facturaRepository.deleteById(id);
    }

    @Override
    public ResumenFinancieroDTO obtenerResumenFinanciero() {
        BigDecimal totalIngresos = facturaRepository.sumarMontoPorTipo(TipoFactura.INGRESO);
        BigDecimal totalGastos = facturaRepository.sumarMontoPorTipo(TipoFactura.GASTO);

        if (totalIngresos == null) totalIngresos = BigDecimal.ZERO;
        if (totalGastos == null) totalGastos = BigDecimal.ZERO;

        BigDecimal balanceNeto = totalIngresos.subtract(totalGastos);

        long cantidadIngresos = facturaRepository.findByTipo(TipoFactura.INGRESO).size();
        long cantidadGastos = facturaRepository.findByTipo(TipoFactura.GASTO).size();

        return ResumenFinancieroDTO.builder()
                .totalIngresos(totalIngresos)
                .totalGastos(totalGastos)
                .balanceNeto(balanceNeto)
                .cantidadFacturasIngreso(cantidadIngresos)
                .cantidadFacturasGasto(cantidadGastos)
                .build();
    }

    @Override
    public ResumenFinancieroDTO obtenerResumenFinancieroMensual(int anio, int mes) {
        BigDecimal totalIngresos = facturaRepository.sumarMontoPorTipoYMes(TipoFactura.INGRESO, anio, mes);
        BigDecimal totalGastos = facturaRepository.sumarMontoPorTipoYMes(TipoFactura.GASTO, anio, mes);

        if (totalIngresos == null) totalIngresos = BigDecimal.ZERO;
        if (totalGastos == null) totalGastos = BigDecimal.ZERO;

        BigDecimal balanceNeto = totalIngresos.subtract(totalGastos);

        List<Factura> facturasMes = facturaRepository.findByAnioYMes(anio, mes);
        long cantidadIngresos = facturasMes.stream().filter(f -> f.getTipo() == TipoFactura.INGRESO).count();
        long cantidadGastos = facturasMes.stream().filter(f -> f.getTipo() == TipoFactura.GASTO).count();

        return ResumenFinancieroDTO.builder()
                .totalIngresos(totalIngresos)
                .totalGastos(totalGastos)
                .balanceNeto(balanceNeto)
                .cantidadFacturasIngreso(cantidadIngresos)
                .cantidadFacturasGasto(cantidadGastos)
                .build();
    }

    private FacturaDTO convertirAEntidadDTO(Factura factura) {
        return FacturaDTO.builder()
                .id(factura.getId())
                .turnoId(factura.getTurno() != null ? factura.getTurno().getId() : null)
                .tipo(factura.getTipo())
                .concepto(factura.getConcepto())
                .monto(factura.getMonto())
                .fecha(factura.getFecha())
                .metodoPago(factura.getMetodoPago())
                .detalles(factura.getDetalles())
                .build();
    }
}
