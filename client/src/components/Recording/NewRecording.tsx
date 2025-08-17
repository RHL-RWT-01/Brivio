import React, { useState } from "react";
import { Upload } from "lucide-react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
function NewRecording() {
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const queryClient = new QueryClient();

    const {
        data: processingData,
        isLoading: isProcessingCheckLoading,
    } = useQuery({
        queryKey: ["processingRecording"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3000/api/recordings/processing", {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to check processing status");
            }
            return data;
        },
        retry: 0,
    });

    const isProcessing = processingData?.error;

    const {
        mutate: uploadRecording,
        isPending: isUploading,
        isSuccess,
        isError: isUploadError,
        error: uploadError,
    } = useMutation({
        mutationFn: async (recordingFile: File) => {
            const formData = new FormData();
            formData.append("recording", recordingFile);

            const res = await fetch("http://localhost:3000/api/recordings/new", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to upload recording");
            }
            return data;
        },
        onSuccess: () => {
            // re-fetch when user returns
            queryClient.invalidateQueries({ queryKey: ["processingRecording"] });
            navigate("/all");
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            uploadRecording(selectedFile);
        }
    };

    if (isProcessingCheckLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader size="lg" fullScreen={false} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-black px-4 bg-gray-50">
            {!isProcessing && (
                <h2 className="text-2xl font-bold mb-8 text-gray-800">
                    Upload new recording to analyze
                </h2>
            )}

            {isProcessing ? (
                <div className="w-full max-w-lg h-60 flex flex-col items-center justify-center rounded-2xl border border-red-300 bg-red-50 p-6 shadow-sm">
                    <div className="flex items-center space-x-2 mb-3">

                        <h2 className="text-lg font-semibold text-black">Processing Error</h2>
                    </div>
                    <p className="text-sm text-black text-center">
                        {processingData?.error || "Something went wrong. Please try again."}
                    </p>
                </div>
            ) : (
                <label
                    className={`w-full max-w-lg h-60 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
                        ${isUploading ? "border-blue-400" : isUploadError ? "border-red-400" : "border-gray-300 hover:border-blue-500"}`}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <Loader size="md" fullScreen={false} />
                            <span className="mt-4 text-gray-500 text-lg">Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-gray-500 text-lg">
                                Click or drag file here
                            </span>
                            <input
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                </label>
            )}

            {file && !isUploading && (
                <p className={`mt-4 text-sm font-medium ${isUploadError ? "text-red-500" : "text-green-600"}`}>
                    {isSuccess && `Selected: ${file.name} - Uploaded successfully!`}
                    {isUploadError && `Error: ${uploadError?.message}`}
                    {!isSuccess && !isUploadError && !isProcessing && `Selected: ${file.name}`}
                </p>
            )}
        </div>
    );
}

export default NewRecording;
