import { create } from 'zustand';
import { mockIncidents } from '../data/mockData.ts';
import { Incident } from '../types/incident.ts';

interface IncidentsState {
  incidents: Incident[];
  updateIncident: (incidentId: string, updates: Partial<Incident>) => void;
}

export const useIncidentsStore = create<IncidentsState>()((set) => ({
  incidents: mockIncidents,
  updateIncident: (incidentId, updates) =>
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === incidentId ? { ...incident, ...updates } : incident
      ),
    })),
}));
