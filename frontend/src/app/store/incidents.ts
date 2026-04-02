import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Incident } from '../types/incident.ts';
import { initialIncidents } from '../data/initialIncidents.ts';

interface IncidentsState {
  incidents: Incident[];
  updateIncident: (incidentId: string, updates: Partial<Incident>) => void;
  addIncident: (incident: Incident) => void;
  deleteIncident: (incidentId: string) => void;
}

export const useIncidentsStore = create<IncidentsState>()(
  persist(
    (set) => ({
      incidents: initialIncidents,
      updateIncident: (incidentId, updates) =>
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === incidentId ? { ...incident, ...updates } : incident
          ),
        })),
      addIncident: (incident) =>
        set((state) => ({
          incidents: [...state.incidents, incident],
        })),
      deleteIncident: (incidentId) =>
        set((state) => ({
          incidents: state.incidents.filter((incident) => incident.id !== incidentId),
        })),
    }),
    {
      name: 'incidents-storage',
    }
  )
);
