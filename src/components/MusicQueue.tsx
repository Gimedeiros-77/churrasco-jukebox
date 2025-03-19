
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/store/playerStore";
import { formatTime } from "@/lib/utils";
import { Play, X } from "lucide-react";

const MusicQueue = () => {
  const { 
    queue, 
    currentTrack, 
    isPlaying,
    setCurrentTrack,
    removeFromQueue
  } = usePlayerStore();
  
  const playTrack = (trackId: string) => {
    const track = queue.find(t => t.id === trackId);
    if (track) {
      setCurrentTrack(track);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-white">Fila de Reprodução</h2>
        <span className="text-sm text-white">{queue.length} músicas</span>
      </div>
      
      {queue.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-white">
          <p>A fila de reprodução está vazia</p>
        </div>
      ) : (
        <ScrollArea className="flex-1 -mx-2 px-2">
          <ul className="space-y-3">
            {queue.map((track) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              
              return (
                <li 
                  key={track.id}
                  className={`relative group rounded-lg p-3 transition-all duration-200
                    ${isCurrentTrack 
                      ? 'bg-ember-100/80 border border-ember-200' 
                      : 'border border-transparent hover:bg-coal-100/50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => playTrack(track.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        bg-white/80 text-coal-700 shadow-sm transition-all
                        group-hover:text-ember-600 group-hover:bg-white"
                      aria-label={isCurrentTrack ? "Reproduzindo" : "Reproduzir"}
                    >
                      {isCurrentTrack && isPlaying ? (
                        <div className="flex space-x-0.5">
                          <div className="w-1 h-3 bg-ember-500 animate-pulse"></div>
                          <div className="w-1 h-3 bg-ember-500 animate-pulse delay-75"></div>
                        </div>
                      ) : (
                        <Play size={16} />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {track.title}
                      </h3>
                      <p className="text-sm text-white truncate">
                        {track.artist}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white">
                        {formatTime(track.duration)}
                      </span>
                      
                      <button
                        onClick={() => removeFromQueue(track.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-white hover:text-white transition-opacity"
                        aria-label="Remover da fila"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
};

export default MusicQueue;
