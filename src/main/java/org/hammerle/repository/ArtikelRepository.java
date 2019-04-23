package org.hammerle.repository;

import org.hammerle.domain.Artikel;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Artikel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ArtikelRepository extends JpaRepository<Artikel, Long> {

}
