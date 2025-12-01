"use client";

import Spinner from "../ui/Spinner";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] bg-white w-full">
            <Spinner />
            <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
    );
}
