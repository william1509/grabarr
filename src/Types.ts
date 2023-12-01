import { MediaInfo, MovieResult, PageInfo, PersonResult, TvResult } from "./schemas";

export interface FormFields {
  jellyseerrAddress?: string;
  jellyseerrKey?: string;
}

export interface MessagePayload {
  type: string;
  status: MessageStatus;
  body: any;
}

export enum MessageStatus {
  OK = "OK",
  ERROR = "ERROR",
}

export type MediaResult = MovieResult | TvResult | PersonResult;

export interface SearchResult<T = MediaResult> {
  page: number;
  totalPages: number;
  totalResults: number;
  results: T[];
}

export interface MediaRepository {
  pageInfo: PageInfo;
  results: MediaInfo[];
}
