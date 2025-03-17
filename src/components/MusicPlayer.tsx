
import { RefObject, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Plus, Volume2, Volume1, VolumeX } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/store/playerStore";

interface MusicPlayerProps {
  audioRef: RefObject<HTMLAudioElement>;
  onAddMusic: () => void;
}

const MusicPlayer = ({ audioRef, onAddMusic }: MusicPlayerProps) => {
  const { 
    isPlaying, 
    currentTrack, 
    volume,
    progress,
    isMuted,
    queue,
    setIsPlaying,
    setProgress,
    setVolume,
    toggleMute,
    skipTrack,
    previousTrack,
    incrementPlayedTime
  } = usePlayerStore();

  // Set up audio element and event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Update audio src when current track changes
    if (currentTrack) {
      audio.src = currentTrack.url;
      if (isPlaying) {
        audio.play().catch(err => console.error("Error playing track:", err));
      }
    }

    // Set up event listeners
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      skipTrack();
    };

    // Track played time for commercial timing
    const playedTimeInterval = setInterval(() => {
      if (isPlaying) {
        incrementPlayedTime(1000); // increment by 1 second in ms
      }
    }, 1000);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Clean up
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      clearInterval(playedTimeInterval);
    };
  }, [currentTrack, isPlaying]);

  // Control playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(err => console.error("Error playing track:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Control volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Handle seeking
  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    
    const newPosition = value[0];
    setProgress(newPosition);
    audio.currentTime = (newPosition / 100) * audio.duration;
  };

  // Get current time for display
  const getCurrentTime = () => {
    const audio = audioRef.current;
    if (!audio) return "0:00";
    return formatTime(audio.currentTime);
  };

  // Get total duration for display
  const getTotalTime = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return "0:00";
    return formatTime(audio.duration);
  };

  // Volume icon based on current volume level
  const VolumeIcon = isMuted 
    ? VolumeX 
    : volume > 50 
      ? Volume2 
      : Volume1;

  // Animation styles for playing state
  const waveBarClass = "w-1 mx-[1px] bg-ember-500 rounded-full transform origin-bottom transition-all duration-300";

  return (
    <div className="flex flex-col h-full">
      <audio ref={audioRef} className="hidden" />
      
      {/* Track Info */}
      <div className="flex-1 flex flex-col items-center justify-center mb-8">
        {currentTrack ? (
          <>
            <div className="h-24 w-full flex items-end justify-center mb-6">
              {isPlaying ? (
                <div className="flex items-end h-20">
                  <div className={`h-16 animate-wave1 ${waveBarClass}`}></div>
                  <div className={`h-14 animate-wave2 ${waveBarClass}`}></div>
                  <div className={`h-20 animate-wave3 ${waveBarClass}`}></div>
                  <div className={`h-12 animate-wave4 ${waveBarClass}`}></div>
                  <div className={`h-18 animate-wave5 ${waveBarClass}`}></div>
                  <div className={`h-13 animate-wave1 ${waveBarClass}`}></div>
                  <div className={`h-16 animate-wave2 ${waveBarClass}`}></div>
                </div>
              ) : (
                <div className="flex items-end h-20">
                  <div className={`h-6 ${waveBarClass}`}></div>
                  <div className={`h-4 ${waveBarClass}`}></div>
                  <div className={`h-8 ${waveBarClass}`}></div>
                  <div className={`h-3 ${waveBarClass}`}></div>
                  <div className={`h-7 ${waveBarClass}`}></div>
                  <div className={`h-4 ${waveBarClass}`}></div>
                  <div className={`h-6 ${waveBarClass}`}></div>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-display font-medium text-coal-900">
                {currentTrack.title}
              </h2>
              <p className="text-coal-600 mt-1">
                {currentTrack.artist}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center text-coal-600">
            <p>Nenhuma música na fila</p>
            <button 
              onClick={onAddMusic}
              className="btn-primary mt-4 flex items-center mx-auto"
            >
              <Plus size={18} className="mr-1" /> Adicionar música
            </button>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[progress]}
          min={0}
          max={100}
          step={0.1}
          onValueChange={handleSeek}
          disabled={!currentTrack}
          className="my-2"
        />
        <div className="flex justify-between text-sm text-coal-500">
          <span>{getCurrentTime()}</span>
          <span>{getTotalTime()}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 justify-center items-center gap-2 md:gap-4">
          <button 
            onClick={previousTrack}
            disabled={!currentTrack || queue.length === 0}
            className="btn-control text-coal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Música anterior"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!currentTrack}
            className="btn-control bg-ember-100 p-4 text-ember-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? <Pause size={30} /> : <Play size={30} />}
          </button>
          
          <button 
            onClick={skipTrack}
            disabled={!currentTrack || queue.length === 0}
            className="btn-control text-coal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Próxima música"
          >
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <button 
            onClick={toggleMute}
            className="btn-control p-2 text-coal-700"
            aria-label={isMuted ? "Ativar som" : "Mudo"}
          >
            <VolumeIcon size={20} />
          </button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            className="w-20 sm:w-24"
          />
          
          <button 
            onClick={onAddMusic}
            className="btn-control p-2 text-coal-700"
            aria-label="Adicionar música"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
