import React from "react";
import Lottie from "lottie-react";

/**
 * Reusable AnimatedIcon component using Lottie
 * @param {Object} animationData - The Lottie JSON data
 * @param {string} width - Width of the icon (e.g., "24px")
 * @param {string} height - Height of the icon (e.g., "24px")
 * @param {boolean} loop - Whether the animation should loop (default: true)
 * @param {boolean} autoplay - Whether the animation should autoplay (default: true)
 * @param {Object} style - Additional styles
 */
const AnimatedIcon = ({
    animationData,
    width = "24px",
    height = "24px",
    loop = true,
    autoplay = true,
    style = {}
}) => {
    if (!animationData) return null;

    return (
        <div style={{ width, height, display: "inline-flex", alignItems: "center", justifyContent: "center", ...style }}>
            <Lottie
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
};

export default AnimatedIcon;
