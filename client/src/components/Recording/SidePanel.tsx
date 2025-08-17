import type { Recording } from "./AllRecordings";
import Loader from "../Loader";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

interface RecordingWithDetails extends Recording {
    aiSummary: string;
    originalTranscript: string;
}

function SidePanel({ id, setSelectedRecording }: { id: string, setSelectedRecording: (rec: Recording | null) => void }) {
    const { data: recording, isLoading, isError, error } = useQuery<RecordingWithDetails>({
        queryKey: ["recording", id],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/api/recordings/${id}`, {
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch recording details");
            }

            return res.json();
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader size="lg" fullScreen={false} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-full text-red-500 p-6">
                <p>Error: {error.message}</p>
            </div>
        );
    }

    if (!recording) {
        return (
            <div className="flex justify-center items-center h-full text-gray-500 p-6">
                <p>Recording not found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white shadow-xl">
            {/* Sticky Header */}
            <div className="sticky top-0 h-16 z-10 p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">Recording Analysis</h1>
                <button
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => setSelectedRecording(null)}
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Recording Details */}
                <div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-500 text-xs">Name</p>
                            <h3 className="font-semibold text-lg">{recording.title}</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 text-xs">Date</p>
                            <h3 className="font-semibold text-lg">
                                {new Date(recording.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </h3>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-gray-500 text-xs">Duration</p>
                        <h3 className="font-semibold text-lg">
                            {String(Math.floor(recording.duration / 60)).padStart(2, "0")}:
                            {String(recording.duration % 60).padStart(2, "0")}
                        </h3>
                    </div>
                </div>

                {/* Original Transcription */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold mb-2">Original Transcription</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                        {recording.originalTranscript}
                    </p>
                </div>

                {/* AI Summary */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold mb-2">AI Summary</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                        {recording.aiSummary}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SidePanel;