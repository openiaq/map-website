import React from "react";
import { IoCloseOutline } from "react-icons/io5";

interface DetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed bg-white rounded-t-2xl md:rounded-l-none md:rounded-r-2xl shadow-lg transform transition-transform duration-300 ${
        isOpen
          ? "translate-x-0 md:translate-y-0" // Open state
          : "translate-y-full md:-translate-x-full" // Closed state
      } top-auto md:top-0 left-0 md:left-0 bottom-0 z-50 w-full md:w-1/3 h-1/3 md:h-full`}
    >
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 p-2 text-black rounded-full"
        onClick={onClose}
        aria-label="Close Panel"
      >
        <IoCloseOutline className='h-6 w-6 bg-white' />
      </button>

      {/* Scrollable Content */}
      <div className="p-4 overflow-y-auto h-full">{children}</div>
    </div>
  );
};

export default DetailsPanel;
