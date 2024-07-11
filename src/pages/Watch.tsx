import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { DiscussionEmbed } from "disqus-react";

interface Source {
  url: string;
  quality: string;
}

export const Watch: React.FC = () => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [settingsVisible, setSettingsVisible] = useState(false);

  let params = useParams<{ id: any }>();
  let id: string = params.id;
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(id);
        const response = await fetch(
          `${import.meta.env.VITE_CONSUMET_API_ENDPOINT}watch/${id}`
        );
        const data = await response.json();
        if (data && data.sources && data.sources.length > 0) {
          setSources(data.sources);
          setStreamUrl(data.sources[4].url); // Default to 1080p
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();
  }, [id]);

  const reload = () => {
    window.location.reload();
  };

  const handleQualityChange = (url: string) => {
    setStreamUrl(url);
    setSettingsVisible(false); // Hide settings menu after selection
  };

  const handleDownload = () => {
    const player = document.querySelector("video");
    if (player) {
      const a = document.createElement("a");
      a.href = player.src;
      a.download = "video.mp4";
      a.click();
    }
  };

  const handlePrev = () => {
    let episodeNumber: number = parseInt(id[id.length]);
    if (episodeNumber > 1) {
      const newId: string = id.replace(
        `${episodeNumber}`,
        `${episodeNumber - 1}`
      );
      id = newId;
    }
  };

  const handleNext = () => {
    let episodeNumber: number = parseInt(id[id.length]);
    const newId: string = id.replace(
      `${episodeNumber}`,
      `${episodeNumber + 1}`
    );
    id = newId;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-4xl relative">
        {streamUrl ? (
          <div onLoad={reload}>
            <button
              onClick={handleDownload}
              className="absolute top-2.5 left-2.5 z-10 p-2 bg-black bg-opacity-50 text-white border-none cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </button>

            <button
              onClick={() => setSettingsVisible(!settingsVisible)}
              className="absolute top-2.5 right-2.5 z-10 p-2 bg-black bg-opacity-50 text-white border-none cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
            <ReactPlayer
              url={streamUrl}
              playing={true}
              controls={true}
              width="100%"
              height="500px"
              className="aspect-video"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner text-info"></span>
            <p className="ml-2 font-poppins font-semibold">loading..</p>
          </div>
        )}
        {streamUrl && (
          <div className="p-2 flex justify-evenly mt-3">
            <button
              className="rounded-lg bg-[#1F2837] p-3 border border-white"
              onClick={handlePrev}
            >
              Prev episode
            </button>
            <button
              className="rounded-lg bg-[#1F2837] p-3 border border-white"
              onClick={handleNext}
            >
              Next episode
            </button>
          </div>
        )}

        {settingsVisible && (
          <div className="absolute top-10 right-2.5 bg-black border border-gray-300 shadow-md z-20">
            {sources.map((source, index) => (
              <div
                key={index}
                onClick={() => handleQualityChange(source.url)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor: streamUrl === source.url ? "Black" : "Black",
                }}
              >
                {source.quality}
              </div>
            ))}
          </div>
        )}

        {/* Disqus Comment Section */}
        <div className="mt-10 p-6 bg-[#1F2837] text-white rounded-lg">
          <DiscussionEmbed
            shortname="domain-of-weebs"
            config={{
              url: window.location.href,
              identifier: id,
              title: `Episode ${id}`,
              language: "en", // e.g. for Traditional Chinese (Taiwan)
            }}
          />
        </div>
      </div>
    </div>
  );
};
