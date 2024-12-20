
import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import "./Watch.css";
import { CurrEpisodeData } from "../interfaces/CurrEpisodeData";
import { VideoPlayer } from "../components/VideoPlayer";
import { DiscussionEmbed } from "disqus-react";
import { CommentCount } from 'disqus-react';
import { AnimeWatchData, getAnimeData, getCurrentEpisodeData } from "../Hooks/GetStreamingData";

export const Watch: React.FC = () => {
  const [animeData, setAnimeData] = useState<AnimeWatchData>();
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState<number>();
  const [currentEpisode, setCurrentEpisode] = useState<CurrEpisodeData>();
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const { id: pathId } = useParams();
  // Toggle function
  const toggleCommentsVisibility = () => {
    setIsCommentsVisible(!isCommentsVisible);
  };

  useEffect(() => {
    if (!params.id) {
      alert("Invalid params id")
      return;
    }
    const malId = parseInt(params.id);

    if (!searchParams.get("id")) {
      alert("No name found in searchParams")
      return;
    }
    const name: string = searchParams.get("id")!;

    getAnimeData(malId, name).then((data) => setAnimeData(data));

  }, [params]);

  useEffect(() => {
    if (!searchParams.get("ep")) {
      alert("episode number not found in searchParams")
      return;
    }
    const epNumber = parseInt(searchParams.get("ep")!);
    setCurrentEpisodeNumber(epNumber);
  }, [searchParams]);

  const prefetchNextEpisode = (forceRefetch: boolean = false) => {
    console.log("Prefetching next episode", currentEpisodeNumber! + 1);
    const epId = animeData?.episodes[currentEpisodeNumber!].id;
    getCurrentEpisodeData(epId!, animeData!.hasDub, forceRefetch)
  }

  const fetchEpisodes = async (forceRefetch: boolean = false) => {
    if (!animeData || !currentEpisodeNumber)
      return;
    if (forceRefetch)
      console.log("Refetching current episode", currentEpisodeNumber);
    const epId = animeData.episodes[currentEpisodeNumber - 1].id
    const epData = await getCurrentEpisodeData(epId, animeData.hasDub, forceRefetch)
    setCurrentEpisode(epData);

    if (currentEpisodeNumber < animeData.episodes.length)
      prefetchNextEpisode(forceRefetch);
  }

  useEffect(() => {
    if (!animeData || !currentEpisodeNumber)
      return;

    if (currentEpisodeNumber < 1 || currentEpisodeNumber > animeData.episodes.length) {
      alert("Invalid episode number")
      return;
    }
    fetchEpisodes();
  }, [animeData, currentEpisodeNumber]);

  useEffect(() => {
    if (!currentEpisode || !animeData || !currentEpisodeNumber)
      return;
    console.log(currentEpisode);
  }, [currentEpisode]);

  const [isQueried, setIsQueried] = useState(false);
  // const queryAnilist = async () => {
  //   var user = localStorage.getItem("user");
  //   var accessToken = JSON.parse(user as string).access_token;
  //   const query = `
  //     query ($username: String ,$mediaId: Int) {
  //           MediaList(userName: $username,mediaId: $mediaId){
  //           id
  //           status
  //           progress
  //         }
  //     }`;
  //   const variables = {
  //     username: JSON.parse(localStorage.getItem("user") as string).username,
  //     mediaId: parseInt(pathId ?? ""),
  //   };
  //   console.log("variables", variables);
  //   const response = await axios.post(
  //     "https://graphql.anilist.co",
  //     {
  //       query,
  //       variables,
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  //   // Access the response data
  //   const data = response.data;
  //   console.log(data);
  //   if (data.data.MediaList.status === "CURRENT") {
  //     return data.data.MediaList.progress;
  //   } else {
  //     console.log("Not watching this anime", data.data.MediaList.status);
  //   }
  // };
  const updateAnilist = async (progress: number, mediaID: number) => {
    try {
      var user = localStorage.getItem("user");
      var accessToken = JSON.parse(user as string).access_token;
      const query = `
      mutation ($mediaId: Int, $progress: Int) {
        SaveMediaListEntry(mediaId: $mediaId, progress: $progress) {
          id
          status
          progress
        }
      }
    `;

      console.log(typeof mediaID);

      const variables = {
        mediaId: mediaID,
        progress: parseInt(searchParams.get("ep") ?? ""),
      };

      console.log("variables", variables);

      const response = await axios.post(
        "https://graphql.anilist.co",
        {
          query,
          variables,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Access the response data
      const data = response.data;
      console.log(data);

      return true; // Indicate that the operation was successful
    } catch (error) {
      console.error("An error occurred while updating Anilist:", error);
      return false; // Indicate that an error occurred
    }
  };

  const handleProgress = async (state: { playedSeconds: number }) => {
    //save playedSeconds in sessionStorage and 
    //update mongodb when user leaves page or changes episode
    setPlayedSeconds(state.playedSeconds);
    const percentageWatched = totalDuration
      ? (state.playedSeconds / totalDuration) * 100
      : 0;

    let mid = parseInt(pathId ?? "");
    const mediaIdList = JSON.parse(
      sessionStorage.getItem("mediaIdList") || "[]"
    );

    // Find the object that matches the given mal_id
    const foundItem = mediaIdList.find(
      (item: { mal_id: number; progress: number }) => item.mal_id === mid
    );

    // Extract the mediaId and progress if found, otherwise set to null
    const mediaId = foundItem ? foundItem.mediaId : null;
    const progress = foundItem ? foundItem.progress : null;

    // Update mid to use the found mediaId for further processing
    mid = mediaId;

    if (
      percentageWatched >= 80 &&
      !isQueried &&
      !isNaN(mid) &&
      currentEpisodeNumber &&
      currentEpisodeNumber > progress
    ) {
      let success = await updateAnilist(
        parseInt(searchParams.get("ep") as string),
        mid
      );

      if (success) {
        // If the update was successful, update the mediaIdList with the new progress
        const updatedList = mediaIdList.map(
          (item: { mal_id: number; mediaId: number; progress: number }) => {
            if (item.mediaId === mid) {
              return { ...item, progress: currentEpisodeNumber };
            }
            return item;
          }
        );

        // Save the updated list back to session storage
        sessionStorage.setItem("mediaIdList", JSON.stringify(updatedList));
        console.log("Media list updated successfully with new progress.");
      }

      setIsQueried(true); // Ensure this block is only executed once
    }
  };

  const handleDuration = (duration: number) => {
    setTotalDuration(duration);
  };

  const handleWatchEpisode = (episodeId: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("ep", episodeId.toString());
    setSearchParams(newSearchParams);
    setCurrentEpisode(dummyCurrEpisodeData) //this is unsafe
  };

  const handlePrev = () => {
    if (!currentEpisodeNumber) return;
    if (currentEpisodeNumber > 1) {
      handleWatchEpisode(currentEpisodeNumber - 1);
    } else {
      alert("You are watching the first episode");
    }
  };

  const handleNext = () => {
    if (!currentEpisodeNumber) return;
    if (currentEpisodeNumber === animeData?.episodes.length) {
      alert("You are watching the last episode");
    } else {
      handleWatchEpisode(currentEpisodeNumber + 1);
    }
  };
  return (
    <div className="mx-4 2xl:mr-36">
     <div id="episodes" className="flex w-full
     flex-col-reverse lg:flex-row gap-3 lg:gap-1 justify-center h-fit items-stretch">
        <div className="flex flex-col py-2 bg-doki-light-grey text-doki-purple h-fit 
        max-h-[560px] sm:max-h-[624px] sm:h-[624px] w-full lg:w-72 mx-1 sm:mx-0 font-lato sm:border-r-slate-500 backdrop-blur-lg text-center 
        rounded-l-[22px] rounded-r-[22px] lg:rounded-r-none">
          <div className="text-center font-lato font-[30px] pb-1">
            EPISODES
          </div>
          <hr className="border-doki-purple rounded-md h-[4px] border-2 bg-doki-purple mx-3 mb-2" />
          <div className="overflow-y-auto cursor-pointer scrollHide rounded-bl-[12px] rounded-br-[12px]">
            {animeData?.episodes.map((episode, index) => (
              <div role="button"
                key={index}
                className={`relative flex justify-start items-center h-14 
                  ${episode.number == currentEpisodeNumber
                  ? "bg-doki-light-grey"
                  : "bg-doki-light-grey hover:bg-doki-white"
                  } transition-colors duration-150 ease-in-out`}
                onClick={() => {
                  handleWatchEpisode(episode.number);
                }}
              >
                {episode.number == currentEpisodeNumber && (
                  <div className="absolute inset-0 bg-doki-dark-grey animate-slideIn z-0"></div>
                )}
                <div
                  className={`w-1 relative 
                    bg-transparent h-full transition-opacity 
                    duration-500 ease-in-out ${episode.number == currentEpisodeNumber
                    ? "opacity-100"
                    : "opacity-0"
                    }`}
                ></div>
                <div className="relative z-10  ml-2 
                font-lato cursor-pointer truncate">
                  {episode.number}. {episode.title}
                </div>
                {/* <div className="sm:hidden text-white mx-auto font-poppins">
                  E-{episode.number}
                </div> */}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full max-w-4xl relative">

          <div className="2xl:w-[1000px]">
            <VideoPlayer
              currentEpisode={currentEpisode || dummyCurrEpisodeData}
              handlePreviousEpisode={handlePrev}
              handleNextEpisode={handleNext}
              hasPreviousEpisode={(currentEpisodeNumber || 0) > 1}
              hasNextEpisode={(currentEpisodeNumber || 0) < (animeData?.episodes.length || 0)}
              onProgress={handleProgress}
              onDuration={handleDuration}
              fetchEpisodes={fetchEpisodes}
            />
            <div className="bg-doki-light-grey rounded-br-[22px] rounded-bl-[22px] 
            lg:rounded-bl-none h-auto sm:h-16 lg:h-[114px] 2xl:h-14 flex flex-row sm:flex-row 
            items-center justify-center mb-1 mx-1 sm:mx-0 px-4 mt-1 sm:mt-0 relative">
              <div className="flex flex-col sm:flex-row justify-center items-center bg-transparent
                    sm:mt-0 sm:bg-doki-dark-grey sm:py-1.5 2xl:h-3/4 rounded-xl">
                      {/* Find the current episode and display its title */}
                      <p className="whitespace-nowrap text-xs sm:text-sm font-lato 
                      font-semibold text-doki-purple p-3 sm:p-2 truncate">
                        CURRENT EPISODE:{" "}
                      </p>
                      <p className="truncate whitespace-normal sm:whitespace-nowrap text-xs 
                      sm:text-sm mr-2 flex items-center font-lato
                      sm:px-1 p-2 rounded-full font-semibold">
                        {currentEpisodeNumber} -{" "}
                        {
                          animeData?.episodes.find(
                            (episode) => episode.number === currentEpisodeNumber
                          )?.title
                        }
                      </p>
                    </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div
        id="jjk"
        className="mt-2 bg-transparent backdrop-blur-lg border border-white text-center rounded-md py-2"
      >
        <div className="toggle-container justify-center items-center mb-4">
          <input
            type="checkbox"
            id="toggle-comments"
            className="toggle-checkbox"
            onChange={toggleCommentsVisibility}
          />
          <label htmlFor="toggle-comments" className="toggle-label">
            <span className="toggle-inner" />
            <span className="toggle-switch" />
          </label>
          <span className="whitespace-nowrap font-anime">
            {isCommentsVisible ? "Hide Comments" : "Show Comments"}
          </span>
        </div>
        {isCommentsVisible && (
          <>
            <div className="disqus-container">
              <DiscussionEmbed
                shortname="doki-watch"
                config={{
                  url: window.location.href,
                  identifier: `${params.id}-${currentEpisodeNumber}`,
                  title: `Episode ${currentEpisodeNumber}`,
                  language: "en", // e.g. for Traditional Chinese (Taiwan)
                }}
              />
              <CommentCount
                shortname="doki-watch"
                config={{
                  url: window.location.href,
                  identifier: `${params.id}-${currentEpisodeNumber}`,
                  title: `Episode ${currentEpisodeNumber}`,
                }}
              >
                Comments
              </CommentCount>
            </div>
          </>
        )}
      </div> */}
    </div>
  );
};

const dummyCurrEpisodeData: CurrEpisodeData = {
  zoroId: "",
  intro: {
    start: 0,
    end: 0
  },
  outro: {
    start: 0,
    end: 0
  },
  sources: {
    sub: "",
    dub: ""
  },
  thumbnailSrc: "",
  dubThumbnailSrc: "",
  subtitles: [],
}