package org.hammerle.repository;

import org.hammerle.domain.Lieferant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Lieferant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LieferantRepository extends JpaRepository<Lieferant, Long> {

}
