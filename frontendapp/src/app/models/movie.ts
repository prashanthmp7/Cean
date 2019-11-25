export interface Movie {
  name: string;
  genre: string;
  formats: {
    digital: boolean;
    bluray: boolean;
    dvd: boolean;
  };
}
