
import { useState, useRef } from "react";
import MusicQueue from "@/components/MusicQueue";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { LogOut, Music, Plus } from "lucide-react";
import AddMusicModal from "@/components/AddMusicModal";
import { usePlayerStore } from "@/store/playerStore";
import MusicPlayer from "@/components/MusicPlayer";

const JukeboxApp = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isAddMusicModalOpen, setIsAddMusicModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { addToQueue } = usePlayerStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenAddMusicModal = () => {
    setIsAddMusicModalOpen(true);
  };

  const handleCloseAddMusicModal = () => {
    setIsAddMusicModalOpen(false);
  };

  const handleAddMusic = (track) => {
    addToQueue(track);
    setIsAddMusicModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-wood-texture bg-cover bg-center flex flex-col">
      {/* Header */}
      <header className="glass-panel p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/8ae4a6b3-cd5f-463a-a662-3310937de3a4.png" 
            alt="Churrascaria Original" 
            className="h-12"
          />
          <h1 className="text-xl font-bold text-white">Jukebox da Churrascaria</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-white mr-2">Olá, {user?.username}</span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-black border-white/20">
            <LogOut size={16} className="mr-1 text-black" />
            Sair
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-4 flex flex-col md:flex-row gap-4 overflow-hidden">
        {/* Queue section */}
        <div className="w-full md:w-1/3 glass-panel rounded-lg p-4">
          <MusicQueue />
        </div>
        
        {/* Player section */}
        <div className="w-full md:w-2/3 glass-panel rounded-lg p-4 flex flex-col">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-white">Player de Música</h2>
            <p className="text-white">Selecione ou adicione músicas à fila para começar</p>
          </div>
          
          {/* Player component */}
          {audioRef && (
            <MusicPlayer 
              audioRef={audioRef} 
              onAddMusic={handleOpenAddMusicModal} 
            />
          )}
        </div>
      </main>
      
      {/* Footer with player controls */}
      <footer className="glass-panel p-4 text-center">
        <p className="text-white">© 2023 Churrascaria Original - Sistema de Jukebox</p>
      </footer>

      {/* Add Music Modal */}
      <AddMusicModal
        isOpen={isAddMusicModalOpen}
        onClose={handleCloseAddMusicModal}
        onAddMusic={handleAddMusic}
      />
      
      {/* Hidden audio element for music playback */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default JukeboxApp;
