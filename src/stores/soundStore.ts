import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as Tone from 'tone';

interface ActiveSound {
    id: string;
    player: Tone.Player;
    isPlaying: boolean;
    path: string;
}

interface SoundState {
    activeSounds: ActiveSound[];
    isPlaying: boolean;

    // Actions
    toggleSound: (id: string, path: string) => Promise<void>;
    togglePlayAll: () => void;
    stopAll: () => void;
}

export const useSoundStore = create<SoundState>()(
    persist(
        (set, get) => ({
            activeSounds: [],
            isPlaying: false,

            toggleSound: async (id, path) => {
                await Tone.start();
                const { activeSounds } = get();
                const existingSound = activeSounds.find(s => s.id === id);

                if (existingSound) {
                    if (existingSound.isPlaying) {
                        existingSound.player?.stop();
                        set({
                            activeSounds: activeSounds.map(s =>
                                s.id === id ? { ...s, isPlaying: false } : s
                            )
                        });
                    } else {
                        existingSound.player?.start();
                        set({
                            activeSounds: activeSounds.map(s =>
                                s.id === id ? { ...s, isPlaying: true } : s
                            )
                        });
                    }
                } else {
                    const player = new Tone.Player({
                        url: path,
                        loop: true,
                        autostart: true,
                    }).toDestination();

                    set({
                        activeSounds: [...activeSounds, {
                            id,
                            player,
                            isPlaying: true,
                            path
                        }],
                        isPlaying: true
                    });
                }

                const updatedSounds = get().activeSounds;
                const anyPlaying = updatedSounds.some(s => s.isPlaying);
                set({ isPlaying: anyPlaying });
            },

            togglePlayAll: () => {
                const { activeSounds, isPlaying } = get();
                const newIsPlaying = !isPlaying;

                activeSounds.forEach(sound => {
                    if (sound.player) {
                        if (newIsPlaying) {
                            sound.player.start();
                        } else {
                            sound.player.stop();
                        }
                    }
                });

                set({ isPlaying: newIsPlaying });
            },

            stopAll: () => {
                const { activeSounds } = get();
                activeSounds.forEach(sound => {
                    sound.player?.stop();
                });
                set({ activeSounds: [], isPlaying: false });
            }
        }),
        {
            name: 'sound-store',
            partialize: (state) => ({
                activeSounds: state.activeSounds.map(sound => ({
                    id: sound.id,
                    path: sound.path,
                    isPlaying: sound.isPlaying
                })),
                isPlaying: state.isPlaying
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Clear active sounds on rehydration to prevent undefined players
                    state.activeSounds = [];
                    state.isPlaying = false;
                }
            }
        }
    )
); 