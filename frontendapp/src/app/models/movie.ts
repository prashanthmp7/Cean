import { IThumbnailData } from './ThumbnailData';
export interface IMovie {
  name: string;
  genre: string;
  formats: {
    digital: boolean;
    bluray: boolean;
    dvd: boolean;
  };
  thumbnailData: IThumbnailData;
  type: string;
}
