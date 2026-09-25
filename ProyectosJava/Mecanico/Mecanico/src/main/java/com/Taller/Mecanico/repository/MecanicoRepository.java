package com.Taller.Mecanico.repository;

import com.Taller.Mecanico.model.Mecanico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MecanicoRepository extends JpaRepository<Mecanico, Long> {
    List<Mecanico> findByActivoTrue();
}
