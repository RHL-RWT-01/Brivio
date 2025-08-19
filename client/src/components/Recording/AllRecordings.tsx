import { useState, useEffect, useRef } from "react";
import Loader from "../Loader";
import SidePanel from "./SidePanel";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

export type Recording = {
    _id: string;
    title: string;
    createdAt: string;
    duration: number;
    status: "processing" | "completed" | "failed";
};



export default function RecordingList() {
    const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

    const loaderRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["recordings"],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await fetch(`http://localhost:3000/api/recordings/all?page=${pageParam}&limit=10`, {
                credentials: "include",
            });

            if (res.status === 401) {
                navigate("/login");
                return;
            }

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch recordings");
            }
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.recordings.length < 10) {
                return undefined; // No more pages
            }
            return allPages.length + 1; // Return the next page number
        },
    });

    const handleRecordingClick = (rec: Recording) => {
        if (selectedRecording && selectedRecording._id === rec._id) {
            setSelectedRecording(null);
        } else {
            setSelectedRecording(rec);
        }
    };

    useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        {
            root: null,
            rootMargin: '200px',
            threshold: 1.0,
        }
    );

    const loaderElement = loaderRef.current;
    
    // Only observe the loader element if it exists and we have more pages
    if (loaderElement && hasNextPage) {
        observer.observe(loaderElement);
    }

    return () => {
        if (loaderElement) {
            observer.unobserve(loaderElement);
        }
    };
}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader size="lg" fullScreen={false} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen w-full text-red-500">
                Error: {error.message}
            </div>
        );
    }

    const recordings = data?.pages.flatMap(page => page.recordings) || [];

    return (
        <div className="flex h-screen w-full bg-white">
            <div className="flex w-1/2 flex-col">
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 p-4 h-16 bg-gray-100 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-800">All Recordings</h1>
                </div>

                {/* Scrollable List Container */}
                <div className="flex-1 overflow-y-auto py-2">
                    {recordings.map(rec => (
                        <div
                            key={rec._id}
                            onClick={() => handleRecordingClick(rec)}
                            className={`h-18 p-2 border-b cursor-pointer transition-colors duration-200
                                ${selectedRecording?._id === rec._id ? "bg-white shadow-md rounded-sm" : "hover:bg-gray-200"}`}
                        >
                            <h2 className="font-semibold">{rec.title}</h2>
                            <div className="flex mr-4 justify-between text-sm text-gray-500">
                                <span>{new Date(rec.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
                                <span>
                                    {String(Math.floor(rec.duration / 60)).padStart(2, "0")}:
                                    {String(Math.floor(rec.duration) % 60).padStart(2, "0")}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Loader for next pages */}
                    {isFetchingNextPage && (
                        <div className="flex justify-center py-4">
                            <Loader size="sm" fullScreen={false} />
                        </div>
                    )}

                    {/* The IntersectionObserver target element */}
                    <div ref={loaderRef} className="h-1" />

                    {!hasNextPage && !isFetchingNextPage && (
                        <div className="text-center text-gray-500 my-4 text-sm">You have reached the end.</div>
                    )}
                </div>
            </div>

            {/* SidePanel only if a recording is selected */}
            {selectedRecording && selectedRecording._id && (
                <div className="w-1/2 border-l border-gray-200 shadow-xl">
                    <SidePanel
                        id={selectedRecording._id}
                        setSelectedRecording={setSelectedRecording}
                    />
                </div>
            )}
        </div>
    );
}
