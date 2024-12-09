import React, { useState } from "react";

type Position = "left" | "right";

type SlideInMenuProps = {
  openIcon: React.ReactNode; // Icon to display when the menu is open
  closeIcon: React.ReactNode; // Icon to display when the menu is closed
  menuItems: { label: string; onClick: () => void }[]; // Menu items with callbacks
  position?: Position; // Menu position: "left" or "right"
  topOffset?: string; // Custom vertical position (CSS value, e.g., "4rem" or "50%")
};

const SlideInMenu: React.FC<SlideInMenuProps> = ({
  openIcon,
  closeIcon,
  menuItems,
  position = "right", // Default to right side
  topOffset = "1rem", // Default vertical offset
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        className={`fixed z-50 p-2 rounded-md bg-gray-800 bg-opacity-60 text-white focus:outline-none`}
        style={{
          top: topOffset, // Dynamic vertical positioning
          [position]: isOpen ? "0rem" : ".5rem", // Position on the left or right
        }}
        aria-label="Toggle Menu"
      >
        {isOpen ? closeIcon : openIcon}
      </button>

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 ${position}-0 bg-gray-800 text-white transform transition-transform p${position[0]}-4 ${
          isOpen
            ? "translate-x-0"
            : position === "right"
            ? "translate-x-full"
            : "-translate-x-full"
        } z-40`}
        style={{
          height: "auto", // Dynamically adjusts based on content
          top: topOffset, // Matches the toggle button's top offset
        }}
      >
        <nav className="flex flex-col p-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false); // Close menu after triggering the callback
              }}
              className="mb-4 text-lg hover:text-gray-300 text-left"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default SlideInMenu;
