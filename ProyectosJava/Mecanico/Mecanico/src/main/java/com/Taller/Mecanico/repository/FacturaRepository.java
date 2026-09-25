package com.Taller.Mecanico.repository;

import com.Taller.Mecanico.model.Factura;
import com.Taller.Mecanico.model.TipoFactura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    List<Factura> findByTipo(TipoFactura tipo);

    @Query("SELECT SUM(f.monto) FROM Factura f WHERE f.tipo = :tipo")
    BigDecimal sumarMontoPorTipo(@Param("tipo") TipoFactura tipo);

    @Query("SELECT f FROM Factura f WHERE YEAR(f.fecha) = :anio AND MONTH(f.fecha) = :mes ORDER BY f.fecha DESC")
    List<Factura> findByAnioYMes(@Param("anio") int anio, @Param("mes") int mes);

    @Query("SELECT SUM(f.monto) FROM Factura f WHERE f.tipo = :tipo AND YEAR(f.fecha) = :anio AND MONTH(f.fecha) = :mes")
    BigDecimal sumarMontoPorTipoYMes(@Param("tipo") TipoFactura tipo, @Param("anio") int anio, @Param("mes") int mes);
}
