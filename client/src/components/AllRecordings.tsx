type Recording = {
    id: string;
    title: string;
    createdAt: string;
    duration: number;
};

const dummyRecording: Recording[] = [
    { id: "1", title: "My First Recording", createdAt: "2023-03-01T12:00:00Z", duration: 120 },
    { id: "2", title: "My Second Recording", createdAt: "2023-03-02T12:00:00Z", duration: 150 },
    { id: "3", title: "My Third Recording", createdAt: "2023-03-03T12:00:00Z", duration: 180 },
    { id: "4", title: "My Fourth Recording", createdAt: "2023-03-04T12:00:00Z", duration: 210 },
    { id: "5", title: "My Fifth Recording", createdAt: "2023-03-05T12:00:00Z", duration: 240 },
    { id: "6", title: "My Sixth Recording", createdAt: "2023-03-06T12:00:00Z", duration: 270 },
    { id: "1", title: "My First Recording", createdAt: "2023-03-01T12:00:00Z", duration: 120 },
    { id: "2", title: "My Second Recording", createdAt: "2023-03-02T12:00:00Z", duration: 150 },
    { id: "3", title: "My Third Recording", createdAt: "2023-03-03T12:00:00Z", duration: 180 },
    { id: "4", title: "My Fourth Recording", createdAt: "2023-03-04T12:00:00Z", duration: 210 },
    { id: "5", title: "My Fifth Recording", createdAt: "2023-03-05T12:00:00Z", duration: 240 },
    { id: "6", title: "My Sixth Recording", createdAt: "2023-03-06T12:00:00Z", duration: 270 },
    { id: "1", title: "My First Recording", createdAt: "2023-03-01T12:00:00Z", duration: 120 },
    { id: "2", title: "My Second Recording", createdAt: "2023-03-02T12:00:00Z", duration: 150 },
    { id: "3", title: "My Third Recording", createdAt: "2023-03-03T12:00:00Z", duration: 180 },
    { id: "4", title: "My Fourth Recording", createdAt: "2023-03-04T12:00:00Z", duration: 210 },
    { id: "5", title: "My Fifth Recording", createdAt: "2023-03-05T12:00:00Z", duration: 240 },
    { id: "6", title: "My Sixth Recording", createdAt: "2023-03-06T12:00:00Z", duration: 270 },
    { id: "1", title: "My First Recording", createdAt: "2023-03-01T12:00:00Z", duration: 120 },
    { id: "2", title: "My Second Recording", createdAt: "2023-03-02T12:00:00Z", duration: 150 },
    { id: "3", title: "My Third Recording", createdAt: "2023-03-03T12:00:00Z", duration: 180 },
    { id: "4", title: "My Fourth Recording", createdAt: "2023-03-04T12:00:00Z", duration: 210 },
    { id: "5", title: "My Fifth Recording", createdAt: "2023-03-05T12:00:00Z", duration: 240 },
    { id: "6", title: "My Sixth Recording", createdAt: "2023-03-06T12:00:00Z", duration: 270 },
    { id: "1", title: "My First Recording", createdAt: "2023-03-01T12:00:00Z", duration: 120 },
    { id: "2", title: "My Second Recording", createdAt: "2023-03-02T12:00:00Z", duration: 150 },
    { id: "3", title: "My Third Recording", createdAt: "2023-03-03T12:00:00Z", duration: 180 },
    { id: "4", title: "My Fourth Recording", createdAt: "2023-03-04T12:00:00Z", duration: 210 },
    { id: "5", title: "My Fifth Recording", createdAt: "2023-03-05T12:00:00Z", duration: 240 },
    { id: "6", title: "My Sixth Recording", createdAt: "2023-03-06T12:00:00Z", duration: 270 },
    { id: "1", title: "My First Recording", createdAt: "2023-03-01T12:00:00Z", duration: 120 },
    { id: "2", title: "My Second Recording", createdAt: "2023-03-02T12:00:00Z", duration: 150 },
    { id: "3", title: "My Third Recording", createdAt: "2023-03-03T12:00:00Z", duration: 180 },
    { id: "4", title: "My Fourth Recording", createdAt: "2023-03-04T12:00:00Z", duration: 210 },
    { id: "5", title: "My Fifth Recording", createdAt: "2023-03-05T12:00:00Z", duration: 240 },
    { id: "6", title: "My Sixth Recording", createdAt: "2023-03-06T12:00:00Z", duration: 270 },
    { id: "1", title: "My First Recording", createdAt: "2023-03-01T12:00:00Z", duration: 120 },
    { id: "2", title: "My Second Recording", createdAt: "2023-03-02T12:00:00Z", duration: 150 },
    { id: "3", title: "My Third Recording", createdAt: "2023-03-03T12:00:00Z", duration: 180 },
    { id: "4", title: "My Fourth Recording", createdAt: "2023-03-04T12:00:00Z", duration: 210 },
    { id: "5", title: "My Fifth Recording", createdAt: "2023-03-05T12:00:00Z", duration: 240 },
    { id: "6", title: "My Sixth Recording", createdAt: "2023-03-06T12:00:00Z", duration: 270 },
    { id: "1", title: "My First Recording", createdAt: "2023-03-01T12:00:00Z", duration: 120 },
    { id: "2", title: "My Second Recording", createdAt: "2023-03-02T12:00:00Z", duration: 150 },
    { id: "3", title: "My Third Recording", createdAt: "2023-03-03T12:00:00Z", duration: 180 },
    { id: "4", title: "My Fourth Recording", createdAt: "2023-03-04T12:00:00Z", duration: 210 },
    { id: "5", title: "My Fifth Recording", createdAt: "2023-03-05T12:00:00Z", duration: 240 },
    { id: "6", title: "My Sixth Recording", createdAt: "2023-03-06T12:00:00Z", duration: 270 },
];

function formatDuration(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
        hrs > 0 ? String(hrs).padStart(2, "0") : null,
        String(mins).padStart(2, "0"),
        String(secs).padStart(2, "0"),
    ]
        .filter(Boolean)
        .join(":");
}

function AllRecordings() {
    return (
        <div className="text-black p-4 flex-1 w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-2 static">All Recordings</h2>
            <p className="mb-6 text-gray-600">Here you can find all your recordings.</p>

            <ul className="divide-y border-gray-600 divide-gray-200">
                {dummyRecording.map((rec) => (
                    <li key={rec.id} className="flex justify-between py-3 items-center">
                        <div>
                            <p className="text-base font-medium">{rec.title}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(rec.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="text-sm font-mono text-gray-700">
                            {formatDuration(rec.duration)}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AllRecordings;
