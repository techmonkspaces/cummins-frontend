import { Plant, UserPersona } from '../types';
import { MOCK_PLANTS, MOCK_PERSONAS } from '../data/mockData';

const STORAGE_KEY_PLANTS = 'cummins_ppwr_plants_v4';
const STORAGE_KEY_ACTIVE_PLANT = 'cummins_ppwr_active_plant_id_v4';
const STORAGE_KEY_ACTIVE_PERSONA = 'cummins_ppwr_active_persona_id_v4';

export const ALL_PLANTS_OBJECT: Plant = {
  id: 'ALL_PLANTS',
  name: 'All Factories (Consolidated)',
  shortName: 'All Factories',
  code: 'ALL-GLB',
  location: 'Global Operations Network',
  country: 'Global',
  configuredMethod: 'CALCULATED',
  primaryErpSystem: 'SAP S/4HANA (PP/MM)',
  description: 'Consolidated overview across Pune, Phaltan, and Jamshedpur manufacturing facilities.',
  activeSkus: ['GA-102', 'BP-201', 'IN-108', 'VL-310', 'TC-550', 'SP-415'],
  managerName: 'Admin User',
  roleTitle: 'Super Admin • Global Sustainability Director',
  usersCount: 54,
  recordsCount: 2536,
  status: 'Active'
};

class PlantService {
  private plants: Plant[] = [];
  private activePlantId: string = 'PLANT-PUNE';
  private activePersonaId: string = 'PERSONA-PUNE';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedPlants = localStorage.getItem(STORAGE_KEY_PLANTS);
      if (savedPlants) {
        this.plants = JSON.parse(savedPlants);
      } else {
        this.plants = [...MOCK_PLANTS];
        this.saveToStorage();
      }

      const savedActivePlant = localStorage.getItem(STORAGE_KEY_ACTIVE_PLANT);
      if (savedActivePlant && (this.plants.some(p => p.id === savedActivePlant) || savedActivePlant === 'ALL_PLANTS')) {
        this.activePlantId = savedActivePlant;
      } else {
        this.activePlantId = 'PLANT-PUNE';
      }

      const savedActivePersona = localStorage.getItem(STORAGE_KEY_ACTIVE_PERSONA);
      if (savedActivePersona && MOCK_PERSONAS.some(p => p.id === savedActivePersona)) {
        this.activePersonaId = savedActivePersona;
      } else {
        this.activePersonaId = 'PERSONA-PUNE';
      }
    } catch (e) {
      console.error('Failed to load plants from storage:', e);
      this.plants = [...MOCK_PLANTS];
      this.activePlantId = 'PLANT-PUNE';
      this.activePersonaId = 'PERSONA-PUNE';
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_PLANTS, JSON.stringify(this.plants));
      localStorage.setItem(STORAGE_KEY_ACTIVE_PLANT, this.activePlantId);
      localStorage.setItem(STORAGE_KEY_ACTIVE_PERSONA, this.activePersonaId);
    } catch (e) {
      console.error('Failed to save plants to storage:', e);
    }
  }

  public getPlants(): Plant[] {
    return [...this.plants];
  }

  public getPersonas(): UserPersona[] {
    return [...MOCK_PERSONAS];
  }

  public getActivePlant(): Plant {
    if (this.activePlantId === 'ALL_PLANTS') {
      return ALL_PLANTS_OBJECT;
    }
    const found = this.plants.find(p => p.id === this.activePlantId);
    return found || this.plants[0];
  }

  public getActivePlantId(): string {
    return this.activePlantId;
  }

  public getActivePersona(): UserPersona {
    const found = MOCK_PERSONAS.find(p => p.id === this.activePersonaId);
    return found || MOCK_PERSONAS[0];
  }

  public setActivePlant(plantId: string): Plant {
    this.activePlantId = plantId;
    
    // Auto sync persona if matching plant
    const matchingPersona = MOCK_PERSONAS.find(p => p.plantId === plantId);
    if (matchingPersona) {
      this.activePersonaId = matchingPersona.id;
    } else if (plantId === 'ALL_PLANTS') {
      this.activePersonaId = 'PERSONA-ADMIN';
    }

    this.saveToStorage();
    return this.getActivePlant();
  }

  public setActivePersona(personaId: string): UserPersona {
    this.activePersonaId = personaId;
    const persona = MOCK_PERSONAS.find(p => p.id === personaId);
    if (persona) {
      this.activePlantId = persona.plantId;
    }
    this.saveToStorage();
    return this.getActivePersona();
  }

  public updatePlantConfig(plantId: string, updates: Partial<Plant>): Plant | null {
    const idx = this.plants.findIndex(p => p.id === plantId);
    if (idx === -1) return null;

    this.plants[idx] = {
      ...this.plants[idx],
      ...updates
    };

    this.saveToStorage();
    return this.plants[idx];
  }

  public resetToDefault() {
    this.plants = [...MOCK_PLANTS];
    this.activePlantId = 'PLANT-PUNE';
    this.activePersonaId = 'PERSONA-PUNE';
    this.saveToStorage();
  }
}

export const plantService = new PlantService();
