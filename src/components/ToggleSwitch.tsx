import React, { useState } from "react";

type Position = "left" | "right";

type ToggleSwitchProps = {
  initialState?: boolean; // Initial toggle state (true/false)
  onToggle: (state: boolean) => void; // Callback triggered on state change
  onIcon: React.ReactNode; // Icon for the "on" state
  offIcon: React.ReactNode; // Icon for the "off" state
  position?: Position; // Position of the button: "left" or "right"
  topOffset?: string; // Vertical position offset (e.g., "1rem", "50%")
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  initialState = false,
  onToggle,
  onIcon,
  offIcon,
  position = "right",
  topOffset = "1rem",
}) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onToggle(newState); // Notify parent component
  };

  return (
    <button
      onClick={handleToggle}
      className={`fixed flex items-center w-16 px-1 py-1 rounded-full focus:outline-none transition ${
        isOn ? "bg-gray-800 bg-opacity-60" : "bg-gray-800 bg-opacity-60" // no difference for now
      }`}
      style={{
        top: topOffset,
        [position]: "1rem",
      }}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-full shadow transform transition ${
          isOn ? "translate-x-7 bg-white" : "translate-x-0 bg-gray-300"
        }`}
      >
        {isOn ? onIcon : offIcon}
      </span>
    </button>
  );
};

export default ToggleSwitch;
