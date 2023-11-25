import { useTheme } from "@emotion/react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  IconButton,
  Paper,
  ThemeOptions,
  Tooltip,
  Typography,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { TvResult } from "../../schemas";
import { MessagePayload } from "../../types";

const TvShowCard: React.FC<{ item: TvResult }> = (props) => {
  const theme: ThemeOptions = useTheme();
  // const [mediaAvailability, setMediaAvailability] = React.useState<RequestResponse[]>([]);

  const downloadClicked = (item: TvResult) => {
    chrome.runtime.sendMessage(
      { type: "request", body: item },
      (response: MessagePayload) => {
        console.log("Received message from background script!", response);
      }
    );
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
        alt={props.item.name}
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
          <Typography variant="body2">{props.item.name}</Typography>
          // </Tooltip>
        }
        subtitle={
          <Typography variant="body2">{props.item.firstAirDate}</Typography>
        }
        position="below"
        style={{ width: 154 }}
        actionIcon={
          <div
            style={{ display: "flex", height: "100%", alignItems: "center" }}
          >
            <IconButton
              color="primary"
              aria-label={`info about ${props.item.name}`}
              onClick={() => downloadClicked(props.item)}
            >
              <FileDownloadIcon />
            </IconButton>
          </div>
        }
      />
    </ImageListItem>
  );
};

export default TvShowCard;
