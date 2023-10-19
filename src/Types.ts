export interface SearchResult {
    page:         number;
    totalPages:   number;
    totalResults: number;
    results:      Media[];
}

export interface Media {
    id:               number;
    mediaType:        MediaType;
    adult?:           boolean;
    genreIds:         number[];
    originalLanguage: string;
    originalTitle?:   string;
    overview:         string;
    popularity:       number;
    releaseDate?:     Date;
    title?:           string;
    video?:           boolean;
    voteAverage:      number;
    voteCount:        number;
    backdropPath:     null | string;
    posterPath:       string;
    firstAirDate?:    Date;
    name?:            string;
    originCountry?:   string[];
    originalName?:    string;
}

export enum MediaType {
    Movie = "movie",
    Tv = "tv",
}

interface FormFields {
    jellyseerrAddress?: string,
    jellyseerrKey?: string,
  }