import { useTheme } from "@emotion/react";
import {
  Paper,
  ThemeOptions,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import { MediaResult, MessagePayload, SearchResult } from "../../types";
import MovieCard from "../movie-card/movie-card";
import TvShowCard from "../tvshow-card/tvshow-card";
import "./media-selection.css";
import { MovieResult, TvResult } from "../../schemas";
import React from "react";

const MediaSelection: React.FC<{ item: SearchResult }> = (props) => {
  const theme: ThemeOptions = useTheme();
  const [mediaAvailability, setMediaAvailability] = React.useState<Map<number, number>>(new Map<number, number>());

  React.useEffect(() => {
    chrome.runtime.sendMessage({ type: "get_media_availability" }, (response: MessagePayload) => {
      const mediaAvailability: [number, number][] = response.body;
      if (mediaAvailability === undefined || mediaAvailability === null) {
        return;
      }
      setMediaAvailability(new Map(mediaAvailability));
    });
  }, []);

  return (
    <Paper
      style={{
        padding: "10px",
        backgroundColor: theme.palette?.background?.paper,
      }}
    >
      <ImageList
        className="image-list"
        cols={props.item.results.length}
        sx={{
          width: "fit-content",
          maxWidth: 300,
          height: "fit-content",
          margin: "0.5em",
        }}
        gap={8}
      >
        {props.item.results.map((item) => {
          switch (item.mediaType) {
            case "tv":
              return <TvShowCard key={item.id} item={item as TvResult} />;
            case "movie":
              return <MovieCard key={item.id} item={item as MovieResult} mediaAvailability={mediaAvailability.get((item as MovieResult).mediaInfo?.tmdbId ?? 0) ?? 0} />;
            default:
              console.log("Unknown media type", item);
          }
        })}
      </ImageList>
    </Paper>
  );
};

export default MediaSelection;
