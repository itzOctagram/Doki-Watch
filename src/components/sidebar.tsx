import React, { useState } from "react";
import {
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import {
  Link as ConnectIcon,
  Home as HomeIcon,
  CollectionsBookmark as MangaIcon,
} from "@mui/icons-material";
import styled from "@mui/material/styles/styled";
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; // For the toggle button
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"; // For the toggle button
import { useUser } from "@clerk/clerk-react"; // Import the useUser hook from the Clerk SDK

// Styled components using the `styled` API change according to the theme preferences
//TODO: Change the theme of the DialogBox/Form, make a bit anime themed @karan8404 and @Gadzrux
const AnimeDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    backgroundColor: "#fafafa", // Light grey background for the dialog
  },
});

const AnimeDialogTitle = styled(DialogTitle)({
  backgroundColor: "#151F2E", // title background colour
  color: "#3DB4F2", // light blue colour for title
});

const AnimeDialogContent = styled(DialogContent)({
  backgroundColor: "#9FADBD", // Off-white background for content
  color: "white",
});

const AnimeButton = styled(Button)({
  backgroundColor: "#4CC9F0", // Sky blue button background
  color: "white", // White text for buttons
  "&:hover": {
    backgroundColor: "#4895EF", // Darker blue on hover
  },
});

const AnimeTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#3A0CA3", // Dark purple text when focused
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "lightgrey", // Default state border color
    },
    "&:hover fieldset": {
      borderColor: "#4CC9F0", // Sky blue border on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4CC9F0", // Sky blue border for focused state
    },
  },
});

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser(); // Use the isSignedIn property from the useUser hook

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    const user = { username: event.target.value };
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Step 1: Define the click event handler function
  const handleSubmit = () => {
    console.log("Username submitted:", username);
    // Add your logic here

    window.open(
      "https://anilist.co/api/v2/oauth/authorize?client_id=19753&response_type=token",
      "_blank"
    );
    setOpen(false); // Close the dialog after submission
    //https://anilist.co/api/v2/oauth/authorize?client_id=19753&redirect_uri=https://domainofweeb.netlify.app/&response_type=code
  };

  // Define the click event handler function for Home
  const handleHomeClick = () => {
    console.log("Home IconButton clicked");
    // Redirect to the default home page
    window.location.href = "/";
  };

  //TODO: @Gadzrux We need to implement the Manga Stack
  // Define the click event handler function for Manga Stack
  const handleMangaClick = () => {
    console.log("Manga IconButton clicked");
    // Add your logic here for Manga Stack button
  };

  return (
    <>
      {isOpen && (
        <Stack
          direction="column" // Set direction to column for vertical layout
          className="fixed top-1/2 left-0 -translate-y-1/2 z-50 mx-4 bg-gray-800 p-2 rounded-lg"
          spacing={2} // Adjust spacing between items as needed
        >
          {isSignedIn && (
            <Tooltip title="Connect to Anilist" placement="right">
              {/* Step 2: Pass the handleClick function to the onClick prop */}
              <IconButton onClick={handleClickOpen}>
                <ConnectIcon className="text-white" />
              </IconButton>
            </Tooltip>
          )}
          <AnimeDialog open={open} onClose={handleClose}>
            <AnimeDialogTitle>Enter AniList Username</AnimeDialogTitle>
            <AnimeDialogContent>
              <AnimeTextField
                autoFocus
                margin="dense"
                id="username"
                label="AniList Username"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleUsernameChange}
              />
            </AnimeDialogContent>
            <DialogActions className="bg-[#9fadbd]">
              <AnimeButton onClick={handleClose}>Cancel</AnimeButton>
              <AnimeButton onClick={handleSubmit}>Submit</AnimeButton>
            </DialogActions>
          </AnimeDialog>
          <Tooltip title="Home" placement="right">
            <IconButton onClick={handleHomeClick}>
              <HomeIcon className="text-white" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Coming Soon" placement="right">
            <IconButton onClick={handleMangaClick}>
              <MangaIcon className="text-white" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
      <Tooltip title="Toggle Sidebar" placement="right">
        <div className="fixed top-[90vh] left-0 z-50 -translate-y-1/2 mx-4">
          <IconButton
            onClick={toggleSidebar}
            style={{ backgroundColor: "#212529" }}
          >
            {isOpen ? (
              <ChevronLeftIcon className="text-white" />
            ) : (
              <ChevronRightIcon className="text-white" />
            )}
          </IconButton>
        </div>
      </Tooltip>
    </>
  );
};

export default Sidebar;
