import React, { useState, useEffect } from "react";

export const usePagination = <T>(
  data: Array<T>,
  itemsPerPage: number,
  initialActiveIndex = 1
): [T[], number[], React.Dispatch<React.SetStateAction<number>>] => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const getPageData = () => {
    const startIndex = (activeIndex - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = () => Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    // Reset active index if it exceeds the total number of pages
    const totalPages = getTotalPages();
    if (activeIndex > totalPages) {
      setActiveIndex(1);
    }
  }, [activeIndex, data]);

  const paginationIndices = Array.from(
    { length: getTotalPages() },
    (_, index) => index + 1
  );

  return [getPageData(), paginationIndices, setActiveIndex];
};

export default usePagination;
