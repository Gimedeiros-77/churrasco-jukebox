
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import MusicPlayer from "@/components/MusicPlayer";
import MusicQueue from "@/components/MusicQueue";
import AddMusicModal from "@/components/AddMusicModal";
import { MusicTrack, CommercialTrack } from "@/types/music";
import { usePlayerStore } from "@/store/playerStore";
import { Plus, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const JukeboxApp = () => {
  const { 
    isPlaying, 
    currentTrack, 
    queue, 
    playedTime,
    resetPlayedTime,
    setIsPlaying,
    setCurrentTrack,
    addToQueue,
    removeFromQueue,
    skipTrack,
    previousTrack
  } = usePlayerStore();
  
  const [isAddMusicOpen, setIsAddMusicOpen] = useState(false);
  const [lastCommercialTime, setLastCommercialTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Default commercial track
  const commercialTrack: CommercialTrack = {
    id: "commercial-default",
    title: "Propaganda da Churrascaria",
    artist: "Churrascaria Original",
    duration: 30,
    url: "/commercial-placeholder.mp3", // Replace with actual commercial when available
    isCommercial: true
  };
  
  // Initialize with some sample tracks
  useEffect(() => {
    const sampleTracks: MusicTrack[] = [
      {
        id: "1",
        title: "Bossa Nova Brasileira",
        artist: "João Gilberto",
        duration: 198,
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Creative_Commons/Nheap/Extra/Nheap_-_01_-_Crossings.mp3"
      },
      {
        id: "2",
        title: "Samba de Verão",
        artist: "Astrud Gilberto",
        duration: 176,
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3"
      }
    ];
    
    // Add sample tracks to queue if queue is empty
    if (queue.length === 0) {
      sampleTracks.forEach(track => {
        addToQueue(track);
      });
      
      // Set the first track as current if none is playing
      if (!currentTrack) {
        setCurrentTrack(sampleTracks[0]);
      }
    }
  }, []);
  
  // Handle commercial playback every 15 minutes
  useEffect(() => {
    // Convert 15 minutes to milliseconds (15 * 60 * 1000)
    const commercialInterval = 15 * 60 * 1000; 
    
    // Check if 15 minutes have passed since last commercial and music is playing
    if (playedTime - lastCommercialTime >= commercialInterval && isPlaying) {
      // Pause current music
      setIsPlaying(false);
      
      // Save the current track position
      const currentTime = audioRef.current?.currentTime || 0;
      
      // Play commercial
      toast.info("Reproduzindo propaganda da Churrascaria Original", {
        duration: 5000
      });
      
      // Create a temporary audio for the commercial
      const commercialAudio = new Audio(commercialTrack.url);
      commercialAudio.play();
      
      // After commercial ends, resume music
      commercialAudio.onended = () => {
        resetPlayedTime();
        setLastCommercialTime(playedTime);
        setIsPlaying(true);
        
        // Resume from saved position
        if (audioRef.current) {
          audioRef.current.currentTime = currentTime;
          audioRef.current.play();
        }
      };
    }
  }, [playedTime, lastCommercialTime]);
  
  return (
    <div className="min-h-screen bg-wood-texture bg-cover bg-center flex flex-col">
      <header className="p-6 flex justify-center">
        <div className="text-center">
          <img 
            src="/lovable-uploads/8ae4a6b3-cd5f-463a-a662-3310937de3a4.png" 
            alt="Churrascaria Original" 
            className="h-28 mx-auto"
          />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 max-w-7xl">
        <div className="w-full md:w-2/3 glass-panel rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur-lg overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Player</h2>
            <Button 
              onClick={() => setIsAddMusicOpen(true)} 
              className="btn-primary flex items-center gap-2 bg-primary"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Adicionar Música</span>
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <MusicPlayer 
              audioRef={audioRef}
              onAddMusic={() => setIsAddMusicOpen(true)}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/3 glass-panel rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur-lg overflow-hidden">
          <MusicQueue />
        </div>
      </main>
      
      <footer className="p-6 text-center text-white">
        <p className="text-sm">
          © {new Date().getFullYear()} Churrascaria Original • Todos os direitos reservados
        </p>
      </footer>
      
      <AddMusicModal 
        isOpen={isAddMusicOpen} 
        onClose={() => setIsAddMusicOpen(false)}
        onAddMusic={(track) => {
          addToQueue(track);
          setIsAddMusicOpen(false);
          toast.success(`"${track.title}" adicionada à fila`);
        }}
      />
    </div>
  );
};

export default JukeboxApp;
