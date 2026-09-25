package com.Taller.Mecanico.repository;

import com.Taller.Mecanico.model.Factura;
import com.Taller.Mecanico.model.TipoFactura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    List<Factura> findByTipo(TipoFactura tipo);

    @Query("SELECT SUM(f.monto) FROM Factura f WHERE f.tipo = :tipo")
    BigDecimal sumarMontoPorTipo(TipoFactura tipo);
}
