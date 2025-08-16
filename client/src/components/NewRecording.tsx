import { useState } from "react";
import { Upload } from "lucide-react";

function NewRecording() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = (selectedFile: File) => {
        setUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            console.log("Uploaded:", selectedFile);
            alert(`Uploaded: ${selectedFile.name}`);
            setUploading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-black px-4">
            <h2 className="text-lg font-medium mb-6">
                Upload new recording to analyze
            </h2>

            <label
                className="w-full max-w-md h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-gray-500 text-lg">
                    {uploading ? "Uploading..." : "Upload"}
                </span>
                <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>

            {file && (
                <p className="mt-4 text-sm text-green-600">
                    Selected: {file.name}
                </p>
            )}
        </div>
    );
}

export default NewRecording;
