package org.hammerle.web.rest;
import org.hammerle.domain.Artikel;
import org.hammerle.repository.ArtikelRepository;
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
 * REST controller for managing Artikel.
 */
@RestController
@RequestMapping("/api")
public class ArtikelResource {

    private final Logger log = LoggerFactory.getLogger(ArtikelResource.class);

    private static final String ENTITY_NAME = "artikel";

    private final ArtikelRepository artikelRepository;

    public ArtikelResource(ArtikelRepository artikelRepository) {
        this.artikelRepository = artikelRepository;
    }

    /**
     * POST  /artikels : Create a new artikel.
     *
     * @param artikel the artikel to create
     * @return the ResponseEntity with status 201 (Created) and with body the new artikel, or with status 400 (Bad Request) if the artikel has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/artikels")
    public ResponseEntity<Artikel> createArtikel(@RequestBody Artikel artikel) throws URISyntaxException {
        log.debug("REST request to save Artikel : {}", artikel);
        if (artikel.getId() != null) {
            throw new BadRequestAlertException("A new artikel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Artikel result = artikelRepository.save(artikel);
        return ResponseEntity.created(new URI("/api/artikels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /artikels : Updates an existing artikel.
     *
     * @param artikel the artikel to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated artikel,
     * or with status 400 (Bad Request) if the artikel is not valid,
     * or with status 500 (Internal Server Error) if the artikel couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/artikels")
    public ResponseEntity<Artikel> updateArtikel(@RequestBody Artikel artikel) throws URISyntaxException {
        log.debug("REST request to update Artikel : {}", artikel);
        if (artikel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Artikel result = artikelRepository.save(artikel);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, artikel.getId().toString()))
            .body(result);
    }

    /**
     * GET  /artikels : get all the artikels.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of artikels in body
     */
    @GetMapping("/artikels")
    public List<Artikel> getAllArtikels() {
        log.debug("REST request to get all Artikels");
        return artikelRepository.findAll();
    }

    /**
     * GET  /artikels/:id : get the "id" artikel.
     *
     * @param id the id of the artikel to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the artikel, or with status 404 (Not Found)
     */
    @GetMapping("/artikels/{id}")
    public ResponseEntity<Artikel> getArtikel(@PathVariable Long id) {
        log.debug("REST request to get Artikel : {}", id);
        Optional<Artikel> artikel = artikelRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(artikel);
    }

    /**
     * DELETE  /artikels/:id : delete the "id" artikel.
     *
     * @param id the id of the artikel to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/artikels/{id}")
    public ResponseEntity<Void> deleteArtikel(@PathVariable Long id) {
        log.debug("REST request to delete Artikel : {}", id);
        artikelRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
