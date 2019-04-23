package org.hammerle.web.rest;

import org.hammerle.JHipsterHouseH2App;

import org.hammerle.domain.Artikel;
import org.hammerle.repository.ArtikelRepository;
import org.hammerle.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;


import static org.hammerle.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ArtikelResource REST controller.
 *
 * @see ArtikelResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = JHipsterHouseH2App.class)
public class ArtikelResourceIntTest {

    private static final String DEFAULT_ARTIKEL_BEZEICHNUNG = "AAAAAAAAAA";
    private static final String UPDATED_ARTIKEL_BEZEICHNUNG = "BBBBBBBBBB";

    private static final Double DEFAULT_PREIS = 1D;
    private static final Double UPDATED_PREIS = 2D;

    @Autowired
    private ArtikelRepository artikelRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restArtikelMockMvc;

    private Artikel artikel;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ArtikelResource artikelResource = new ArtikelResource(artikelRepository);
        this.restArtikelMockMvc = MockMvcBuilders.standaloneSetup(artikelResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Artikel createEntity(EntityManager em) {
        Artikel artikel = new Artikel()
            .artikelBezeichnung(DEFAULT_ARTIKEL_BEZEICHNUNG)
            .preis(DEFAULT_PREIS);
        return artikel;
    }

    @Before
    public void initTest() {
        artikel = createEntity(em);
    }

    @Test
    @Transactional
    public void createArtikel() throws Exception {
        int databaseSizeBeforeCreate = artikelRepository.findAll().size();

        // Create the Artikel
        restArtikelMockMvc.perform(post("/api/artikels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(artikel)))
            .andExpect(status().isCreated());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeCreate + 1);
        Artikel testArtikel = artikelList.get(artikelList.size() - 1);
        assertThat(testArtikel.getArtikelBezeichnung()).isEqualTo(DEFAULT_ARTIKEL_BEZEICHNUNG);
        assertThat(testArtikel.getPreis()).isEqualTo(DEFAULT_PREIS);
    }

    @Test
    @Transactional
    public void createArtikelWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = artikelRepository.findAll().size();

        // Create the Artikel with an existing ID
        artikel.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restArtikelMockMvc.perform(post("/api/artikels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(artikel)))
            .andExpect(status().isBadRequest());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllArtikels() throws Exception {
        // Initialize the database
        artikelRepository.saveAndFlush(artikel);

        // Get all the artikelList
        restArtikelMockMvc.perform(get("/api/artikels?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(artikel.getId().intValue())))
            .andExpect(jsonPath("$.[*].artikelBezeichnung").value(hasItem(DEFAULT_ARTIKEL_BEZEICHNUNG.toString())))
            .andExpect(jsonPath("$.[*].preis").value(hasItem(DEFAULT_PREIS.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getArtikel() throws Exception {
        // Initialize the database
        artikelRepository.saveAndFlush(artikel);

        // Get the artikel
        restArtikelMockMvc.perform(get("/api/artikels/{id}", artikel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(artikel.getId().intValue()))
            .andExpect(jsonPath("$.artikelBezeichnung").value(DEFAULT_ARTIKEL_BEZEICHNUNG.toString()))
            .andExpect(jsonPath("$.preis").value(DEFAULT_PREIS.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingArtikel() throws Exception {
        // Get the artikel
        restArtikelMockMvc.perform(get("/api/artikels/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateArtikel() throws Exception {
        // Initialize the database
        artikelRepository.saveAndFlush(artikel);

        int databaseSizeBeforeUpdate = artikelRepository.findAll().size();

        // Update the artikel
        Artikel updatedArtikel = artikelRepository.findById(artikel.getId()).get();
        // Disconnect from session so that the updates on updatedArtikel are not directly saved in db
        em.detach(updatedArtikel);
        updatedArtikel
            .artikelBezeichnung(UPDATED_ARTIKEL_BEZEICHNUNG)
            .preis(UPDATED_PREIS);

        restArtikelMockMvc.perform(put("/api/artikels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedArtikel)))
            .andExpect(status().isOk());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeUpdate);
        Artikel testArtikel = artikelList.get(artikelList.size() - 1);
        assertThat(testArtikel.getArtikelBezeichnung()).isEqualTo(UPDATED_ARTIKEL_BEZEICHNUNG);
        assertThat(testArtikel.getPreis()).isEqualTo(UPDATED_PREIS);
    }

    @Test
    @Transactional
    public void updateNonExistingArtikel() throws Exception {
        int databaseSizeBeforeUpdate = artikelRepository.findAll().size();

        // Create the Artikel

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArtikelMockMvc.perform(put("/api/artikels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(artikel)))
            .andExpect(status().isBadRequest());

        // Validate the Artikel in the database
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteArtikel() throws Exception {
        // Initialize the database
        artikelRepository.saveAndFlush(artikel);

        int databaseSizeBeforeDelete = artikelRepository.findAll().size();

        // Delete the artikel
        restArtikelMockMvc.perform(delete("/api/artikels/{id}", artikel.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Artikel> artikelList = artikelRepository.findAll();
        assertThat(artikelList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Artikel.class);
        Artikel artikel1 = new Artikel();
        artikel1.setId(1L);
        Artikel artikel2 = new Artikel();
        artikel2.setId(artikel1.getId());
        assertThat(artikel1).isEqualTo(artikel2);
        artikel2.setId(2L);
        assertThat(artikel1).isNotEqualTo(artikel2);
        artikel1.setId(null);
        assertThat(artikel1).isNotEqualTo(artikel2);
    }
}
