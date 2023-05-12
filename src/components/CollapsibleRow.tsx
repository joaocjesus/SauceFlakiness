import { useEffect, useRef, useState } from "react";

interface CollapsibleRowProps {
  label: string;
  content: React.ReactNode;
  floatContent?: boolean;
  classes?: string;
}

const COLLAPSIBLE_ROW_CLASS = "collapsible-row";

const CollapsibleRow = ({
  label,
  content,
  floatContent,
  classes,
}: CollapsibleRowProps) => {
  // Define a state variable to track whether the row is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Control clicking outside the component
  useEffect(() => {
    if (!floatContent) {
      return;
    }

    const handleClickOutside = (e: { target: any }) => {
      if (ref.current) {
        const collapsibleRows = document.getElementsByClassName(
          COLLAPSIBLE_ROW_CLASS
        );
        let clickedCollapsibleRow = false;
        for (let i = 0; i < collapsibleRows.length; i++) {
          if (collapsibleRows.item(i)?.contains(e.target)) {
            clickedCollapsibleRow = true;
            break;
          }
        }
        if (!clickedCollapsibleRow) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [floatContent]);

  // Toggle the isExpanded state when the label is clicked
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div
        ref={ref}
        className={`${
          floatContent ? "h-10" : ""
        } ${COLLAPSIBLE_ROW_CLASS} relative`}
      >
        <div className={`${classes} ${floatContent ? "absolute z-10" : ""}`}>
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
      </div>
    </>
  );
};

export { CollapsibleRow };
