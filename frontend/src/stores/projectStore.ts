import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Scene {
  id: string;
  text: string;
  duration: number;
  visualPrompt: string;
  assetUrl?: string;
  assetType?: 'image' | 'video' | 'upload';
}

export interface Project {
  id: string;
  title: string;
  mode: 'shorts' | 'long' | 'external_montage';
  language: 'ar' | 'en';
  durationSeconds: number;
  aspectRatio: '9:16' | '16:9';
  status: 'draft' | 'processing' | 'completed' | 'failed';
  idea: {
    text: string;
    contentType: string[];
    uploads: string[];
  };
  script?: {
    fullText: string;
    scenes: Scene[];
  };
  voiceId?: string;
  music?: {
    url: string;
    volume: number;
  };
}

interface ProjectState {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  updateProject: (updates: Partial<Project>) => void;
  resetProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      currentProject: null,
      setCurrentProject: (project) => set({ currentProject: project }),
      updateProject: (updates) => set((state) => ({
        currentProject: state.currentProject ? { ...state.currentProject, ...updates } : null
      })),
      resetProject: () => set({ currentProject: null }),
    }),
    {
      name: 'aicontent-project-storage',
    }
  )
);
