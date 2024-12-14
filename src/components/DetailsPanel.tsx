import React, { useEffect, useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";

interface DetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ isOpen, onClose, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  // Scroll to the top when the content changes
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [children]);

  return (
    <div
      ref={panelRef}
      className={`fixed bg-white z-50 overflow-auto
          transform transition-transform duration-1000 
        ${isOpen ?
          "portrait:translate-y-0  portrait:h-1/3  portrait:w-full  portrait:bottom-0 portrait:rounded-t-2xl " +
          "landscape:translate-x-0 landscape:w-1/3 landscape:h-full landscape:top-0   landscape:rounded-r-2xl "
          :
          "portrait:translate-y-full landscape:-translate-x-full pointer-events-none"
        }
          overflow-y-auto
        `}


    >

      <div className="p-4">{children}</div>

      {/* Close Button after children to ensure it's on top */}
      <button
        className="absolute top-2 right-2 p-2 text-black rounded-full"
        onClick={onClose}
        aria-label="Close Panel"
      >
        <IoCloseOutline className='h-6 w-6 bg-white' />
      </button>
    </div>
  );
};

export default DetailsPanel;
