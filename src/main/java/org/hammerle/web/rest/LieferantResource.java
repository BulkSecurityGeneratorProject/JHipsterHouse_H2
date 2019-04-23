package org.hammerle.web.rest;
import org.hammerle.domain.Lieferant;
import org.hammerle.repository.LieferantRepository;
import org.hammerle.web.rest.errors.BadRequestAlertException;
import org.hammerle.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Lieferant.
 */
@RestController
@RequestMapping("/api")
public class LieferantResource {

    private final Logger log = LoggerFactory.getLogger(LieferantResource.class);

    private static final String ENTITY_NAME = "lieferant";

    private final LieferantRepository lieferantRepository;

    public LieferantResource(LieferantRepository lieferantRepository) {
        this.lieferantRepository = lieferantRepository;
    }

    /**
     * POST  /lieferants : Create a new lieferant.
     *
     * @param lieferant the lieferant to create
     * @return the ResponseEntity with status 201 (Created) and with body the new lieferant, or with status 400 (Bad Request) if the lieferant has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/lieferants")
    public ResponseEntity<Lieferant> createLieferant(@RequestBody Lieferant lieferant) throws URISyntaxException {
        log.debug("REST request to save Lieferant : {}", lieferant);
        if (lieferant.getId() != null) {
            throw new BadRequestAlertException("A new lieferant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Lieferant result = lieferantRepository.save(lieferant);
        return ResponseEntity.created(new URI("/api/lieferants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /lieferants : Updates an existing lieferant.
     *
     * @param lieferant the lieferant to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated lieferant,
     * or with status 400 (Bad Request) if the lieferant is not valid,
     * or with status 500 (Internal Server Error) if the lieferant couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/lieferants")
    public ResponseEntity<Lieferant> updateLieferant(@RequestBody Lieferant lieferant) throws URISyntaxException {
        log.debug("REST request to update Lieferant : {}", lieferant);
        if (lieferant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Lieferant result = lieferantRepository.save(lieferant);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, lieferant.getId().toString()))
            .body(result);
    }

    /**
     * GET  /lieferants : get all the lieferants.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of lieferants in body
     */
    @GetMapping("/lieferants")
    public List<Lieferant> getAllLieferants() {
        log.debug("REST request to get all Lieferants");
        return lieferantRepository.findAll();
    }

    /**
     * GET  /lieferants/:id : get the "id" lieferant.
     *
     * @param id the id of the lieferant to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the lieferant, or with status 404 (Not Found)
     */
    @GetMapping("/lieferants/{id}")
    public ResponseEntity<Lieferant> getLieferant(@PathVariable Long id) {
        log.debug("REST request to get Lieferant : {}", id);
        Optional<Lieferant> lieferant = lieferantRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(lieferant);
    }

    /**
     * DELETE  /lieferants/:id : delete the "id" lieferant.
     *
     * @param id the id of the lieferant to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/lieferants/{id}")
    public ResponseEntity<Void> deleteLieferant(@PathVariable Long id) {
        log.debug("REST request to delete Lieferant : {}", id);
        lieferantRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
