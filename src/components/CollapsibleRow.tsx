import React, { useState } from "react";

interface CollapsibleRowProps {
  label: string;
  content: React.ReactNode;
  classes?: string;
}

const CollapsibleRow: React.FC<CollapsibleRowProps> = ({
  label,
  content,
  classes,
}) => {
  // Define a state variable to track whether the row is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle the isExpanded state when the label is clicked
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={classes}>
      <button
        onClick={handleToggle}
        className={`btn btn-sm w-full ${
          isExpanded ? "btn-secondary" : "btn-primary"
        }`}
      >
        {label}
      </button>
      <div className={isExpanded ? "" : "hidden"}>{content}</div>
    </div>
  );
};

export default CollapsibleRow;
