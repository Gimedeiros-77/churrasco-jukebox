
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  url: string;
  isCommercial?: false;
}

export interface CommercialTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  url: string;
  isCommercial: true;
}

export type Track = MusicTrack | CommercialTrack;
