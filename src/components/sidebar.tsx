// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   IconButton,
//   Tooltip,
//   Stack,
//   // Dialog,
//   // DialogActions,
//   // DialogContent,
//   // DialogTitle,
//   // Button,
//   // TextField,
// } from "@mui/material";
// import {
//   AddLink as LinkIcon,
//   // Link as ConnectIcon,
//   Home as HomeIcon,
//   // CollectionsBookmark as MangaIcon,
//   Schedule as ScheduleIcon,
//   Search as SearchIcon,
//   ContentPasteSearch as TraceIcon,
// } from "@mui/icons-material";
// // import styled from "@mui/material/styles/styled";
// import { useUser } from "@clerk/clerk-react";
// import { motion } from "framer-motion";
// import TraceAnimeModal from "./TraceAnimeModal";
// import { useAnilistAuth } from "../AnilistContext";


// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { isSignedIn } = useUser();
//   const [schedule, setSchedule] = useState([]);
//   const modalRef = useRef(null);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [isModalDisplayed, setIsModalDisplayed] = useState(false);
//   const traceRef = useRef<HTMLDialogElement>(null);
//   const { authenticate } = useAnilistAuth();

//   const handleModalDisplay = () => {
//     setIsModalDisplayed(true);
//     if (traceRef.current) {
//       (traceRef.current as HTMLDialogElement).showModal();
//     }
//   };

//   const handleModalClose = () => {
//     setIsModalDisplayed(false);
//     if (traceRef.current) {
//       (traceRef.current as HTMLDialogElement).close();
//     }
//   }

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const navigate = useNavigate();

//   const handleTitleClick = (animeId: any) => {
//     closeModal();
//     navigate(`/anime/${animeId}`);
//   };

//   const handleSubmit = () => {
//     authenticate();
//   };

//   const handleHomeClick = () => {
//     console.log("Home IconButton clicked");
//     navigate("/home");
//   };

//   const handleSearchClick = () => {
//     console.log("Search IconButton clicked");
//     navigate("/search");
//   };

//   const openModal = () => {
//     if (modalRef.current) {
//       (modalRef.current as HTMLDialogElement).showModal();
//     }
//     fetchAnimeSchedule();
//   };

//   const closeModal = () => {
//     if (modalRef.current) {
//       (modalRef.current as HTMLDialogElement).close();
//     }
//   };

//   const fetchAnimeSchedule = () => {
//     const currentDay = new Date()
//       .toLocaleDateString("en-US", { weekday: "long" })
//       .toLowerCase();
//     fetch(`https://api.jikan.moe/v4/schedules?kids=false&filter=${currentDay}`)
//       .then((response) => response.json())
//       .then((result) => setSchedule(result.data))
//       .catch((error) => console.error(error));
//   };

//   const convertToUserTime = (broadcastTime: string) => {
//     try {
//       //console.log("Broadcast Time:", broadcastTime);

//       // Append a default date to the time string
//       const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
//       const dateTimeString = `${currentDate}T${broadcastTime}:00`; // Combine date and time

//       // Parse the combined date-time string
//       const jstTime = new Date(dateTimeString);
//       if (isNaN(jstTime.getTime())) {
//         throw new Error("Invalid date format");
//       }

//       //console.log("JST Time:", jstTime);
//       return jstTime.toLocaleString();
//     } catch (error) {
//       console.error("Error converting broadcast time:", error);
//       return "Invalid date";
//     }
//   };

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentDate(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <>
//       {isOpen && (
//         <motion.div
//           initial={{ x: "-100%" }}
//           animate={isOpen ? { x: "0%" } : { x: "-100%" }}
//           transition={
//             isOpen
//               ? { type: "spring", stiffness: 300 }
//               : { duration: 0.5, ease: "easeInOut" }
//           }
//           className="fixed top-1/3 left-0 -translate-y-1/2 z-50
//            mx-[5px] md:mx-[25px] bg-doki-dark-grey rounded-[22px] pt-2 pb-2"
//         >
//           <Stack direction="column" gap={1.5}>
//             {isSignedIn && (
//               <Tooltip
//                 title="Connect to Anilist"
//                 placement="right"
//                 sx={{ width: 56, height: 56 }}
//               >
//                 <IconButton onClick={handleSubmit}>
//                   <LinkIcon
//                     className="text-doki-purple rounded-full"
//                     sx={{ fontSize: 32 }}
//                   />
//                 </IconButton>
//               </Tooltip>
//             )}
//             <Tooltip title="Home" placement="right">
//               <IconButton onClick={handleHomeClick}>
//                 <HomeIcon
//                   className="text-doki-purple rounded-full"
//                   sx={{ fontSize: 32 }}
//                 />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Browse" placement="right">
//               <IconButton onClick={handleSearchClick}>
//                 <SearchIcon
//                   className="text-doki-purple rounded-full"
//                   sx={{ fontSize: 32 }}
//                 />
//               </IconButton>
//             </Tooltip>
//             {/* <Tooltip title="Manga Coming Soon" placement="right">
//               <IconButton>
//                 <MangaIcon
//                   className="text-doki-light-grey cursor-not-allowed"
//                   sx={{ fontSize: 32 }}
//                 />
//               </IconButton>
//             </Tooltip> */}
//             <Tooltip title="Anime Schedule" placement="right">
//               <IconButton onClick={openModal}>
//                 <ScheduleIcon
//                   className="text-doki-purple rounded-full"
//                   sx={{ fontSize: 32 }}
//                   id="schedule"
//                 />
//               </IconButton>
//             </Tooltip>
//             <dialog
//               id="my_modal_5"
//               className="modal modal-bottom sm:modal-middle"
//               ref={modalRef}
//               onClick={(e) => {
//                 if (e.target === e.currentTarget) {
//                   closeModal();
//                 }
//               }}
//             >
//               <div className="modal-box bg-doki-dark-grey backdrop-blur-lg rounded-[22px]">
//                 <h3 className="font-lato text-lg text-doki-purple">
//                   Anime Schedule
//                 </h3>
//                 <hr className="bg-doki-purple rounded-md h-[2px] border-0 mt-2" />
//                 <div className="py-4">
//                   <div>
//                     <p className="py-2 text-doki-purple font-lato">
//                       <strong>Current Date and Time:</strong>{" "}
//                       {`${new Intl.DateTimeFormat("en-US", {
//                         year: "numeric",
//                         month: "long",
//                         day: "2-digit",
//                         weekday: "long",
//                       }).format(currentDate)} - ${new Intl.DateTimeFormat(
//                         "en-US",
//                         {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           second: "2-digit",
//                           hour12: true,
//                         }
//                       ).format(currentDate)}`}
//                     </p>
//                   </div>
//                   {schedule.map((anime: any) => (
//                     <div
//                       id={anime.mal_id}
//                       key={anime.mal_id}
//                       className="relative text-doki-white p-4 rounded-[12px] 
//                       border-[3px] border-doki-purple shadow-lg hover:shadow-xl 
//                       transition-shadow duration-300 bg-cover bg-center 
//                       bg-no-repeat mb-4 hover:animate-scroll"
//                       style={{
//                         backgroundImage: `url(${anime.images.jpg.large_image_url})`,
//                         backgroundColor: "rgba(255, 255, 255, 0.1)",
//                       }}
//                     >
//                       <div className="absolute inset-0 bg-black opacity-75 rounded-lg"></div>
//                       <p className="relative">
//                         <strong className="cursor-default font-lato">
//                           Title:
//                         </strong>{" "}
//                         <span
//                           onClick={() => handleTitleClick(anime.mal_id)}
//                           // style={{ cursor: "pointer", color: "#04d9ff" }}
//                           className="cursor-pointer text-doki-light-grey font-lato"
//                         >
//                           {anime.title_english || anime.title}
//                         </span>
//                       </p>
//                       <p
//                         className="relative cursor-default font-lato
//                        text-doki-white opacity-80"
//                       >
//                         <strong></strong>{" "}
//                         {convertToUserTime(anime.broadcast.time)}
//                       </p>
//                       {/* <hr className="relative" /> */}
//                     </div>
//                   ))}
//                 </div>
//                 <div
//                   className="modal-action bg-transparent 
//                 bg-opacity-50 text-doki-purple border border-doki-purple 
//                 rounded-[12px] p-2.5 font-anime font-bold cursor-pointer 
//                 shadow-md hover:bg-doki-purple hover:scale-105 transform 
//                 hover:text-doki-white transition duration-150 ease-in-out"
//                 >
//                   <form method="dialog" onClick={closeModal} className="w-full">
//                     <button className="w-full rounded-lg">Close</button>
//                   </form>
//                 </div>
//               </div>
//             </dialog>
//             <Tooltip title="Anime Scene Trace" placement="right">
//               <IconButton onClick={handleModalDisplay}>
//                 <TraceIcon
//                   id="trace"
//                   className="text-doki-purple rounded-full"
//                   sx={{ fontSize: 32 }}
//                 />
//               </IconButton>
//             </Tooltip>
//             <TraceAnimeModal traceRef={traceRef} isModalDisplayed={isModalDisplayed} closeModal={handleModalClose} toggleSidebar={toggleSidebar} />
//           </Stack>
//         </motion.div>
//       )}
//       <Tooltip title="Toggle Sidebar" placement="right">
//         <div className="fixed top-[85vh] left-0 z-50 -translate-y-1/2 sm:ml-[25px] ml-[5px]">
//           <IconButton
//             onClick={toggleSidebar}
//             style={{ backgroundColor: "#6E78CB" }}
//             sx={{
//               backgroundColor: "#6E78CB",
//               width: 56,
//               height: 56,
//               borderRadius: "20px",
//               padding: "8px",
//             }}
//           >
//             {isOpen ? (
//               <svg
//                 width="30"
//                 height="29"
//                 viewBox="0 0 30 29"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="text-doki-purple w-8 h-8 p-1 sm:w-10 sm:h-10 sm:p-2"
//               >
//                 <path
//                   d="M3 3L27 26"
//                   stroke="#2F3672"
//                   strokeWidth="8"
//                   strokeLinecap="round"
//                 />
//                 <path
//                   d="M27 3L3 26"
//                   stroke="#2F3672"
//                   strokeWidth="8"
//                   strokeLinecap="round"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 width="46"
//                 height="46"
//                 viewBox="0 0 46 46"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="text-doki-purple w-8 h-8 p-1 sm:w-10 sm:h-10 sm:p-2"
//               >
//                 <path
//                   d="M5 5H41"
//                   stroke="#2F3672"
//                   strokeWidth="12"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M5 23H41"
//                   stroke="#2F3672"
//                   strokeWidth="12"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M5 41H41"
//                   stroke="#2F3672"
//                   strokeWidth="12"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             )}
//           </IconButton>
//         </div>
//       </Tooltip>
//     </>
//   );
// };

// export default Sidebar;
