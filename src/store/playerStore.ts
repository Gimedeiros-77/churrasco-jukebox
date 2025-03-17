
import { create } from 'zustand';
import { MusicTrack } from '@/types/music';

interface PlayerState {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  queue: MusicTrack[];
  volume: number;
  progress: number;
  isMuted: boolean;
  playedTime: number; // Time since last commercial in ms
  
  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleMute: () => void;
  addToQueue: (track: MusicTrack) => void;
  removeFromQueue: (id: string) => void;
  skipTrack: () => void;
  previousTrack: () => void;
  incrementPlayedTime: (ms: number) => void;
  resetPlayedTime: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  currentTrack: null,
  queue: [],
  volume: 80,
  progress: 0,
  isMuted: false,
  playedTime: 0,
  
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  setCurrentTrack: (track) => set({ currentTrack: track }),
  
  setVolume: (volume) => set({ volume }),
  
  setProgress: (progress) => set({ progress }),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  
  addToQueue: (track) => {
    set((state) => {
      // Add track to queue
      const newQueue = [...state.queue, track];
      
      // If no track is currently playing, set this as current
      if (!state.currentTrack) {
        return { queue: newQueue, currentTrack: track };
      }
      
      return { queue: newQueue };
    });
  },
  
  removeFromQueue: (id) => {
    set((state) => {
      // Remove track from queue
      const newQueue = state.queue.filter(track => track.id !== id);
      
      // If we're removing the current track, play the next one
      if (state.currentTrack?.id === id) {
        const nextTrack = newQueue.length > 0 ? newQueue[0] : null;
        return { 
          queue: newQueue,
          currentTrack: nextTrack,
          isPlaying: nextTrack ? state.isPlaying : false
        };
      }
      
      return { queue: newQueue };
    });
  },
  
  skipTrack: () => {
    set((state) => {
      if (!state.currentTrack) return state;
      
      // Find index of current track
      const currentIndex = state.queue.findIndex(
        track => track.id === state.currentTrack?.id
      );
      
      // If current track not found or it's the last one
      if (currentIndex === -1 || currentIndex === state.queue.length - 1) {
        // Loop back to first track if queue not empty
        if (state.queue.length > 0) {
          return { currentTrack: state.queue[0] };
        }
        // Stop playback if queue is empty
        return { currentTrack: null, isPlaying: false };
      }
      
      // Play next track
      return { currentTrack: state.queue[currentIndex + 1] };
    });
  },
  
  previousTrack: () => {
    set((state) => {
      if (!state.currentTrack) return state;
      
      // Find index of current track
      const currentIndex = state.queue.findIndex(
        track => track.id === state.currentTrack?.id
      );
      
      // If current track not found or it's the first one
      if (currentIndex <= 0) {
        // Loop to last track if queue not empty
        if (state.queue.length > 0) {
          return { currentTrack: state.queue[state.queue.length - 1] };
        }
        return state;
      }
      
      // Play previous track
      return { currentTrack: state.queue[currentIndex - 1] };
    });
  },
  
  incrementPlayedTime: (ms) => {
    set((state) => ({ playedTime: state.playedTime + ms }));
  },
  
  resetPlayedTime: () => {
    set({ playedTime: 0 });
  }
}));
