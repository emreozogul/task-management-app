import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Pause, Play } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { useSoundStore } from '@/stores/soundStore';
import * as Tone from 'tone';
import { CollapsibleCard } from '../ui/collapsible-card';

const AMBIENT_SOUNDS = [
    {
        id: 'rain',
        name: 'Rain',
        path: '/sounds/rain.mp3',
        icon: '🌧️',
        category: 'Nature'
    },
    {
        id: 'fireplace',
        name: 'Fireplace',
        path: '/sounds/fireplace.mp3',
        icon: '🔥',
        category: 'Nature'
    },
    {
        id: 'city',
        name: 'City',
        path: '/sounds/city.mp3',
        icon: '🏙️',
        category: 'Urban'
    },
    {
        id: 'seagulls',
        name: 'Seagulls',
        path: '/sounds/seagulls.mp3',
        icon: '🐦',
        category: 'Urban'
    }
] as const;

const CATEGORIES = [...new Set(AMBIENT_SOUNDS.map(sound => sound.category))];

export const AmbientSoundPlayer = () => {
    const {
        activeSounds,
        isPlaying,
        toggleSound,
        togglePlayAll,
        stopAll
    } = useSoundStore();

    const [activeCategory, setActiveCategory] = useState<string>('All');

    const filteredSounds = AMBIENT_SOUNDS.filter(sound =>
        activeCategory === 'All' || sound.category === activeCategory
    );

    useEffect(() => {
        Tone.start();
    }, []);

    const handleToggleSound = async (id: string, path: string) => {
        await Tone.start();
        toggleSound(id, path);
    };

    return (
        <CollapsibleCard title="Sound Mixer" icon={<Volume2 className="w-5 h-5 mr-2 text-primary" />}>
            <div className="p-4 sm:px-6 pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
                    <div className="flex flex-col h-[400px]">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveCategory('All')}
                                className={`whitespace-nowrap ${activeCategory === 'All' ? 'bg-background-hover' : ''}`}
                            >
                                All Sounds
                            </Button>
                            {CATEGORIES.map(category => (
                                <Button
                                    key={category}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActiveCategory(category)}
                                    className={`whitespace-nowrap ${activeCategory === category ? 'bg-background-hover' : ''}`}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-background-hover">
                            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                                {filteredSounds.map((sound) => {
                                    const activeSound = activeSounds.find(s => s.id === sound.id);
                                    return (
                                        <div
                                            key={sound.id}
                                            onClick={() => handleToggleSound(sound.id, sound.path)}
                                            className={`group flex items-center gap-4 rounded-lg bg-background-hover p-3 transition-all hover:bg-background-secondary cursor-pointer ${activeSound?.isPlaying ? 'ring-2 ring-primary' : ''}`}
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background-hover text-2xl">
                                                {sound.icon}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-primary-foreground font-medium truncate">
                                                    {sound.name}
                                                </h3>
                                                <span className="text-xs text-muted">
                                                    {sound.category}
                                                </span>
                                            </div>
                                            {activeSound?.isPlaying && (
                                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <AudioVisualizer
                            isPlaying={isPlaying}
                            activeSounds={activeSounds}
                            className="w-full h-[300px]"
                        />

                        <div className="flex items-center justify-center gap-3">
                            <Button
                                onClick={togglePlayAll}
                                variant="outline"
                                size="sm"
                                className="border-border text-primary-foreground hover:bg-background-hover"
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button
                                onClick={stopAll}
                                variant="outline"
                                size="sm"
                                className="border-border text-primary-foreground hover:bg-background-hover"
                            >
                                Stop
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </CollapsibleCard>
    );
};
