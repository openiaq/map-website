import React, { useState } from "react";

type Position = "left" | "right";

type ToggleSwitchProps = {
  initialState?: boolean; // Initial toggle state (true/false)
  onToggle: (state: boolean) => void; // Callback triggered on state change
  onIcon: React.ReactNode; // Icon for the "on" state
  offIcon: React.ReactNode; // Icon for the "off" state
  position?: Position; // Position of the button: "left" or "right"
  size?: number;
  className?: string; // TailwindCSS styles
  hoverText?: string; // Text to display on hover
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  initialState = false,
  onToggle,
  onIcon,
  offIcon,
  position = "right",
  size = 8,
  className = "",
  hoverText = "",
}) => {
  const [isOn, setIsOn] = useState(initialState);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    setIsHovered(false);
    const newState = !isOn;
    setIsOn(newState);
    onToggle(newState); // Notify parent component
  };

  return (
    <div className={`flex bg-gray-800 bg-opacity-60 rounded-full ${position}-2 ${className}`}>

      <button
        onClick={handleToggle}
        // Workaround bug for (size * 2) not working in tailwind
        className={`${size == 4 ? "w-8" : "w-16"} py-1 rounded-full`}
      >
        <span
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center justify-center w-${size} h-${size} rounded-full shadow transform transition
            ${isOn ? "bg-white translate-x-full" : "bg-gray-300 translate-x-0"}`}
        >
          {isOn ? onIcon : offIcon}
        </span>
      </button >

      {
        hoverText && isHovered && (
          <span
            className={`fixed right-20 flex bg-gray-700 bg-opacity-40 text-white text-sm rounded px-2 shadow`}
          >
            {hoverText}
          </span>
        )
      }

    </div>



  );
};

export default ToggleSwitch;
