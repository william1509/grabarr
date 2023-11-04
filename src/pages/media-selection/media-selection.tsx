import ImageListItem from "@mui/material/ImageListItem";
import "./media-selection.css";
import ImageList from "@mui/material/ImageList";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { Media, SearchResult } from "../../types";
import { IconButton, Paper } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function MediaSelection({
  response,
}: {
  response: SearchResult;
}) {

  const downloadClicked = (item: Media) => {
    console.log("download clicked", item)
  }

  return (
    <Paper
      style={{ backgroundColor: "white", padding: "10px" }}
    >
      <ImageList
        className="image-list"
        cols={response.results.length}
        sx={{ width: 300, height: "fit-content", backgroundColor: "white", margin: "1em" }}
        gap={8}
      >
        {response.results.map((item) => (
          <ImageListItem 
            key={item.id}
            style={{ backgroundColor: "white" }}  
          >
            <img
              srcSet={`https://www.themoviedb.org/t/p/w154/${item.posterPath}`}
              src={`https://www.themoviedb.org/t/p/w154/${item.posterPath}`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.title}
              subtitle={<span>{item.releaseDate}</span>}
              position="below"
              style={{ width: 154 }}
              actionIcon={
                <IconButton
                  color="primary"
                  aria-label={`info about ${item.title}`}
                  onClick={() => downloadClicked(item)}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Paper>
  );
}
