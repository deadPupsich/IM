import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TeamMember {
  userId: string;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAssign: boolean;
  };
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
}

interface TeamsState {
  teams: Team[];
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  removeTeam: (id: string) => void;
  addMember: (teamId: string, member: TeamMember) => void;
  removeMember: (teamId: string, userId: string) => void;
  updatePermission: (teamId: string, userId: string, permission: string, value: boolean) => void;
  getTeamNames: () => string[];
}

const defaultTeams: Team[] = [
  {
    id: '1',
    name: 'SOC L1',
    description: 'Команда первой линии безопасности',
    members: []
  },
  {
    id: '2',
    name: 'SOC L2',
    description: 'Команда второй линии безопасности',
    members: []
  },
  {
    id: '3',
    name: 'DLP',
    description: 'Команда по предотвращению утечек данных',
    members: []
  }
];

export const useTeamsStore = create<TeamsState>()(
  persist(
    (set, get) => ({
      teams: defaultTeams,
      
      addTeam: (team) => {
        const newTeam: Team = {
          ...team,
          id: Date.now().toString()
        };
        set((state) => ({ teams: [...state.teams, newTeam] }));
      },
      
      updateTeam: (id, updates) => {
        set((state) => ({
          teams: state.teams.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
      },
      
      removeTeam: (id) => {
        set((state) => ({
          teams: state.teams.filter(t => t.id !== id)
        }));
      },
      
      addMember: (teamId, member) => {
        set((state) => ({
          teams: state.teams.map(t => {
            if (t.id !== teamId) return t;
            if (t.members.some(m => m.userId === member.userId)) return t;
            return { ...t, members: [...t.members, member] };
          })
        }));
      },
      
      removeMember: (teamId, userId) => {
        set((state) => ({
          teams: state.teams.map(t =>
            t.id === teamId
              ? { ...t, members: t.members.filter(m => m.userId !== userId) }
              : t
          )
        }));
      },
      
      updatePermission: (teamId, userId, permission, value) => {
        set((state) => ({
          teams: state.teams.map(t => {
            if (t.id !== teamId) return t;
            return {
              ...t,
              members: t.members.map(m =>
                m.userId === userId
                  ? { ...m, permissions: { ...m.permissions, [permission]: value } }
                  : m
              )
            };
          })
        }));
      },
      
      getTeamNames: () => {
        return get().teams.map(t => t.name);
      }
    }),
    {
      name: 'app-teams',
    }
  )
);
