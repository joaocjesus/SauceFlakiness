import { useState } from "react";
import { HeaderStyleProps, TableOrder } from "./Table.props";

interface ColumnHeaderProps {
  index: number;
  header: string;
  columnSort: { order: TableOrder; column: string };
  setColumnSort: Function;
  headerStyle?: HeaderStyleProps[];
}

const SORT_ICON_ASC = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 15.75l7.5-7.5 7.5 7.5"
    />
  </svg>
);

const SORT_ICON_DESC = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const sortIcons = {
  [TableOrder.ASC]: SORT_ICON_ASC,
  [TableOrder.DESC]: SORT_ICON_DESC,
};

export const ColumnHeader = ({
  index,
  header,
  setColumnSort,
  columnSort,
  headerStyle,
}: ColumnHeaderProps) => {
  const defaultSort =
    columnSort.column === header ? columnSort.order : TableOrder.ASC;
  const [hover, setHover] = useState(false);
  const [sort, setSort] = useState(defaultSort);

  const getStyle = (header: string, colIndex: number): string => {
    if (!headerStyle) return "";

    // Finds column by name or index if passed via columnFormat
    const column = headerStyle.find(({ index, name }) =>
      name
        ? name.toLowerCase() === header || name.toLowerCase() === "*"
        : index === colIndex
    );

    return column?.style || "";
  };

  const style = getStyle(header, index);

  const getNextOrder = () =>
    sort === TableOrder.ASC ? TableOrder.DESC : TableOrder.ASC;

  const SortIcon = () => {
    let sortIcon;
    let classes = "ml-1 w-1";
    if (isSortedHeader()) {
      sortIcon = sortIcons[sort];
    } else {
      if (hover) {
        sortIcon = sortIcons[TableOrder.ASC];
        classes += " text-primary opacity-40";
      }
    }
    return (
      <span data-testid="sort-icon" className={classes}>
        {sortIcon}
      </span>
    );
  };

  const handleColumnClick = () => {
    if (isSortedHeader()) {
      setColumnSort({ order: getNextOrder(), column: header });
      setSort(getNextOrder());
    } else {
      setColumnSort({ order: TableOrder.ASC, column: header });
      setSort(TableOrder.ASC);
    }
  };

  const isSortedHeader = () =>
    columnSort?.column?.toLowerCase() === header?.toLowerCase();

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const formattedHeader = (header: string) => {
    const normalized = header.replaceAll(/[_-]/g, " ");
    const newHeader = normalized.charAt(0).toUpperCase() + normalized.slice(1);
    return newHeader;
  };

  return (
    <th
      key={index}
      title={header}
      className={"cursor-pointer" + style}
      onClick={() => handleColumnClick()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="flex items-center">
        {formattedHeader(header)}
        <SortIcon />
      </span>
    </th>
  );
};
