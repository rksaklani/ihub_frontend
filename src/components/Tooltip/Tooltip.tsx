import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode; // The element that will trigger the tooltip
  content: ReactNode;  // The content of the tooltip
  disabled?: boolean;  // Optional prop to disable the tooltip
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, disabled }) => {
  const [visible, setVisible] = useState(false);

  const handleMouseEnter = () => {
    if (!disabled) {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setVisible(false);
    }
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {visible && !disabled && (
        <div
          role="tooltip"
          className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-xs transition-opacity duration-300"
        >
          {content}
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;