package org.hammerle.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Lieferant.
 */
@Entity
@Table(name = "lieferant")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Lieferant implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lieferanten_name")
    private String lieferantenName;

    @OneToMany(mappedBy = "lieferant")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Artikel> lieferantenNames = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLieferantenName() {
        return lieferantenName;
    }

    public Lieferant lieferantenName(String lieferantenName) {
        this.lieferantenName = lieferantenName;
        return this;
    }

    public void setLieferantenName(String lieferantenName) {
        this.lieferantenName = lieferantenName;
    }

    public Set<Artikel> getLieferantenNames() {
        return lieferantenNames;
    }

    public Lieferant lieferantenNames(Set<Artikel> artikels) {
        this.lieferantenNames = artikels;
        return this;
    }

    public Lieferant addLieferantenName(Artikel artikel) {
        this.lieferantenNames.add(artikel);
        artikel.setLieferant(this);
        return this;
    }

    public Lieferant removeLieferantenName(Artikel artikel) {
        this.lieferantenNames.remove(artikel);
        artikel.setLieferant(null);
        return this;
    }

    public void setLieferantenNames(Set<Artikel> artikels) {
        this.lieferantenNames = artikels;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Lieferant lieferant = (Lieferant) o;
        if (lieferant.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), lieferant.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Lieferant{" +
            "id=" + getId() +
            ", lieferantenName='" + getLieferantenName() + "'" +
            "}";
    }
}
