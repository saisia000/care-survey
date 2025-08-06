import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
    interface Window {
        rdt?: {
            track: (event: string) => void;
        };
    }
}

const useRedditPixel = () => {
    const location = useLocation();

    useEffect(() => {
        // Ensure Reddit Pixel is loaded and safe to call
        if (
            typeof window !== "undefined" &&
            window.rdt &&
            typeof window.rdt.track === "function"
        ) {
            try {
                window.rdt.track("PageVisit");
            } catch (err) {
                console.warn("Reddit Pixel failed:", err);
            }
        }
    }, [location.pathname]);
};

export default useRedditPixel;
