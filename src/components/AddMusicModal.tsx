
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MusicTrack } from "@/types/music";
import { Music, Link } from "lucide-react";

interface AddMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMusic: (track: MusicTrack) => void;
}

const AddMusicModal = ({ isOpen, onClose, onAddMusic }: AddMusicModalProps) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");
  const [urlType, setUrlType] = useState<"file" | "link">("file");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !artist || !url) return;
    
    // Create a new track
    const newTrack: MusicTrack = {
      id: Date.now().toString(),
      title,
      artist,
      duration: 180, // Default duration of 3 minutes until we can calculate from the audio
      url
    };
    
    onAddMusic(newTrack);
    
    // Reset form
    setTitle("");
    setArtist("");
    setUrl("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Adicionar Música</DialogTitle>
          <DialogDescription className="text-center">
            Escolha um arquivo de música ou adicione um link
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex rounded-lg overflow-hidden divide-x">
            <button
              type="button"
              className={`flex-1 p-3 flex justify-center items-center gap-2 transition-all
                ${urlType === 'file' 
                  ? 'bg-ember-100 text-ember-800' 
                  : 'bg-coal-100 text-coal-600 hover:bg-coal-200'
                }`}
              onClick={() => setUrlType('file')}
            >
              <Music size={18} />
              <span>Arquivo</span>
            </button>
            <button
              type="button"
              className={`flex-1 p-3 flex justify-center items-center gap-2 transition-all
                ${urlType === 'link' 
                  ? 'bg-ember-100 text-ember-800' 
                  : 'bg-coal-100 text-coal-600 hover:bg-coal-200'
                }`}
              onClick={() => setUrlType('link')}
            >
              <Link size={18} />
              <span>Link</span>
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="title">Título da Música</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Bossa Nova Brasileira"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="artist">Artista</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Ex: João Gilberto"
                required
              />
            </div>
            
            {urlType === 'file' ? (
              <div>
                <Label htmlFor="file">Arquivo de Música</Label>
                <Input
                  id="file"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Create a local URL for the file
                      setUrl(URL.createObjectURL(file));
                    }
                  }}
                  required
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="url">URL da Música</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemplo.com/musica.mp3"
                  required
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!title || !artist || !url}
            >
              Adicionar à Fila
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMusicModal;
