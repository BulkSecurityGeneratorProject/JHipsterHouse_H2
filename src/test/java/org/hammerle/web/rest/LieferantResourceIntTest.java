package org.hammerle.web.rest;

import org.hammerle.JHipsterHouseH2App;

import org.hammerle.domain.Lieferant;
import org.hammerle.repository.LieferantRepository;
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
 * Test class for the LieferantResource REST controller.
 *
 * @see LieferantResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = JHipsterHouseH2App.class)
public class LieferantResourceIntTest {

    private static final String DEFAULT_LIEFERANTEN_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LIEFERANTEN_NAME = "BBBBBBBBBB";

    @Autowired
    private LieferantRepository lieferantRepository;

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

    private MockMvc restLieferantMockMvc;

    private Lieferant lieferant;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LieferantResource lieferantResource = new LieferantResource(lieferantRepository);
        this.restLieferantMockMvc = MockMvcBuilders.standaloneSetup(lieferantResource)
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
    public static Lieferant createEntity(EntityManager em) {
        Lieferant lieferant = new Lieferant()
            .lieferantenName(DEFAULT_LIEFERANTEN_NAME);
        return lieferant;
    }

    @Before
    public void initTest() {
        lieferant = createEntity(em);
    }

    @Test
    @Transactional
    public void createLieferant() throws Exception {
        int databaseSizeBeforeCreate = lieferantRepository.findAll().size();

        // Create the Lieferant
        restLieferantMockMvc.perform(post("/api/lieferants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(lieferant)))
            .andExpect(status().isCreated());

        // Validate the Lieferant in the database
        List<Lieferant> lieferantList = lieferantRepository.findAll();
        assertThat(lieferantList).hasSize(databaseSizeBeforeCreate + 1);
        Lieferant testLieferant = lieferantList.get(lieferantList.size() - 1);
        assertThat(testLieferant.getLieferantenName()).isEqualTo(DEFAULT_LIEFERANTEN_NAME);
    }

    @Test
    @Transactional
    public void createLieferantWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = lieferantRepository.findAll().size();

        // Create the Lieferant with an existing ID
        lieferant.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLieferantMockMvc.perform(post("/api/lieferants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(lieferant)))
            .andExpect(status().isBadRequest());

        // Validate the Lieferant in the database
        List<Lieferant> lieferantList = lieferantRepository.findAll();
        assertThat(lieferantList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllLieferants() throws Exception {
        // Initialize the database
        lieferantRepository.saveAndFlush(lieferant);

        // Get all the lieferantList
        restLieferantMockMvc.perform(get("/api/lieferants?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lieferant.getId().intValue())))
            .andExpect(jsonPath("$.[*].lieferantenName").value(hasItem(DEFAULT_LIEFERANTEN_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getLieferant() throws Exception {
        // Initialize the database
        lieferantRepository.saveAndFlush(lieferant);

        // Get the lieferant
        restLieferantMockMvc.perform(get("/api/lieferants/{id}", lieferant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(lieferant.getId().intValue()))
            .andExpect(jsonPath("$.lieferantenName").value(DEFAULT_LIEFERANTEN_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLieferant() throws Exception {
        // Get the lieferant
        restLieferantMockMvc.perform(get("/api/lieferants/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLieferant() throws Exception {
        // Initialize the database
        lieferantRepository.saveAndFlush(lieferant);

        int databaseSizeBeforeUpdate = lieferantRepository.findAll().size();

        // Update the lieferant
        Lieferant updatedLieferant = lieferantRepository.findById(lieferant.getId()).get();
        // Disconnect from session so that the updates on updatedLieferant are not directly saved in db
        em.detach(updatedLieferant);
        updatedLieferant
            .lieferantenName(UPDATED_LIEFERANTEN_NAME);

        restLieferantMockMvc.perform(put("/api/lieferants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLieferant)))
            .andExpect(status().isOk());

        // Validate the Lieferant in the database
        List<Lieferant> lieferantList = lieferantRepository.findAll();
        assertThat(lieferantList).hasSize(databaseSizeBeforeUpdate);
        Lieferant testLieferant = lieferantList.get(lieferantList.size() - 1);
        assertThat(testLieferant.getLieferantenName()).isEqualTo(UPDATED_LIEFERANTEN_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingLieferant() throws Exception {
        int databaseSizeBeforeUpdate = lieferantRepository.findAll().size();

        // Create the Lieferant

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLieferantMockMvc.perform(put("/api/lieferants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(lieferant)))
            .andExpect(status().isBadRequest());

        // Validate the Lieferant in the database
        List<Lieferant> lieferantList = lieferantRepository.findAll();
        assertThat(lieferantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteLieferant() throws Exception {
        // Initialize the database
        lieferantRepository.saveAndFlush(lieferant);

        int databaseSizeBeforeDelete = lieferantRepository.findAll().size();

        // Delete the lieferant
        restLieferantMockMvc.perform(delete("/api/lieferants/{id}", lieferant.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Lieferant> lieferantList = lieferantRepository.findAll();
        assertThat(lieferantList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Lieferant.class);
        Lieferant lieferant1 = new Lieferant();
        lieferant1.setId(1L);
        Lieferant lieferant2 = new Lieferant();
        lieferant2.setId(lieferant1.getId());
        assertThat(lieferant1).isEqualTo(lieferant2);
        lieferant2.setId(2L);
        assertThat(lieferant1).isNotEqualTo(lieferant2);
        lieferant1.setId(null);
        assertThat(lieferant1).isNotEqualTo(lieferant2);
    }
}
