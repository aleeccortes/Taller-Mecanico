package com.Taller.Mecanico.service;

import com.Taller.Mecanico.dto.FacturaDTO;
import com.Taller.Mecanico.dto.ResumenFinancieroDTO;
import com.Taller.Mecanico.model.Factura;
import com.Taller.Mecanico.model.TipoFactura;
import com.Taller.Mecanico.repository.FacturaRepository;
import com.Taller.Mecanico.repository.TurnoRepository;
import com.Taller.Mecanico.service.impl.FacturaServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FacturaServiceTest {

    @Mock
    private FacturaRepository facturaRepository;

    @Mock
    private TurnoRepository turnoRepository;

    @InjectMocks
    private FacturaServiceImpl facturaService;

    @Test
    @DisplayName("JUnit 5: Debería calcular correctamente el balance financiero del taller (Ingresos vs Gastos)")
    void testObtenerResumenFinanciero() {
        when(facturaRepository.sumarMontoPorTipo(TipoFactura.INGRESO)).thenReturn(new BigDecimal("150000.00"));
        when(facturaRepository.sumarMontoPorTipo(TipoFactura.GASTO)).thenReturn(new BigDecimal("50000.00"));
        when(facturaRepository.findByTipo(TipoFactura.INGRESO)).thenReturn(List.of(new Factura(), new Factura()));
        when(facturaRepository.findByTipo(TipoFactura.GASTO)).thenReturn(List.of(new Factura()));

        ResumenFinancieroDTO resumen = facturaService.obtenerResumenFinanciero();

        assertNotNull(resumen);
        assertEquals(new BigDecimal("150000.00"), resumen.getTotalIngresos());
        assertEquals(new BigDecimal("50000.00"), resumen.getTotalGastos());
        assertEquals(new BigDecimal("100000.00"), resumen.getBalanceNeto());
        assertEquals(2, resumen.getCantidadFacturasIngreso());
        assertEquals(1, resumen.getCantidadFacturasGasto());
    }
}
