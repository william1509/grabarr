import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { IconButton, Paper, ThemeOptions, Tooltip, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useTheme } from "@emotion/react";
import { MessagePayload } from "../../types";
import { MovieResult } from "../../schemas";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const MovieCard: React.FC<{ item: MovieResult; mediaAvailability: number }> = (props) => {
  const theme: ThemeOptions = useTheme();
  // const [mediaAvailability, setMediaAvailability] = React.useState<RequestResponse[]>([]);

  const downloadClicked = (item: MovieResult) => {
    chrome.runtime.sendMessage({ type: "request", body: item }, (response: MessagePayload) => {
      console.log("Received message from background script!", response);
    });
  };

  const getMediaButton = (item: MovieResult) => {
    switch (props.mediaAvailability) {
      case 0:
      case 1:
        return (
          <IconButton color="primary" aria-label={`info about ${item.title}`} onClick={() => downloadClicked(item)}>
            <FileDownloadIcon />
          </IconButton>
        );
      case 2:
      case 3:
      case 4:
      case 5:
        return <CheckCircleOutlineIcon />;
    }
  };

  return (
    <ImageListItem
      key={props.item.id}
      style={{
        backgroundColor: theme.palette?.background?.default,
        borderRadius: "0.5em",
        padding: "0.5em",
      }}
    >
      <img
        srcSet={`https://www.themoviedb.org/t/p/w154/${props.item.posterPath}`}
        src={`https://www.themoviedb.org/t/p/w154/${props.item.posterPath}`}
        alt={props.item.title}
        loading="lazy"
        width={154}
        style={{ borderRadius: "0.5em" }}
        onError={(e) => {
          const parentElement = e.currentTarget.parentElement;
          if (parentElement) {
            parentElement.style.display = "none";
          }
        }}
      />
      <ImageListItemBar
        title={
          // <Tooltip title={item.mediaType === 'movie' ? item.title : item.name}>
          <Typography variant="subtitle1" whiteSpace={"normal"}>
            {props.item.title}
          </Typography>
          // </Tooltip>
        }
        subtitle={
          <Typography variant="caption" whiteSpace={"normal"}>
            {props.item.releaseDate}
          </Typography>
        }
        position="below"
        style={{ width: 154 }}
        actionIcon={<div style={{ display: "flex", height: "100%", alignItems: "center" }}>{getMediaButton(props.item)}</div>}
      />
    </ImageListItem>
  );
};

export default MovieCard;
