import { DEFAULT_PAGE_SIZE } from "@/constants";
import { Dispatch, SetStateAction } from "react";

const PaginationHandler: React.FC<{
  totalResults: number;
  currentPage: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
}> = ({ totalResults, currentPage, setPageNumber }) => {
  const resultsPerPage: number = DEFAULT_PAGE_SIZE;

  const totalPages: number = Math.ceil(totalResults / resultsPerPage);
  const startIndex: number = (currentPage - 1) * resultsPerPage + 1;
  const endIndex: number = Math.min(
    startIndex + resultsPerPage - 1,
    totalResults
  );

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setPageNumber(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setPageNumber(currentPage + 1);
    }
  };

  const generatePageNumbers = (): (number | string)[] => {
    const maxPageButtons = 5;
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const half = Math.floor(maxPageButtons / 2);
      let startPage = currentPage - half;
      let endPage = currentPage + half;

      if (startPage < 1) {
        endPage += 1 - startPage;
        startPage = 1;
      }
      if (endPage > totalPages) {
        startPage -= endPage - totalPages;
        endPage = totalPages;
      }

      if (startPage > 1) pageNumbers.push(1, "...");
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (endPage < totalPages) pageNumbers.push("...", totalPages);
    }

    return pageNumbers;
  };

  return (
    <section className="flex mt-5 justify-between items-center">
      <div>{`${startIndex} - ${endIndex} of ${totalResults} results`}</div>
      <div>
        <ul className="flex gap-8">
          <li
            className={`page-item previous ${
              currentPage === 1 ? "disabled" : ""
            }`}
          >
            <button onClick={handlePreviousClick}>
              <i className="previous" />
            </button>
          </li>
          {generatePageNumbers().map((number, index) => (
            <li
              key={index}
              className={`page-item px-3 py-1 rounded-full ${
                currentPage === number
                  ? "active !bg-[#fd7e14]/90 text-white"
                  : ""
              }`}
              onClick={() =>
                typeof number === "number" && setPageNumber(number)
              }
            >
              <button className="page-link">{number}</button>
            </li>
          ))}
          <li
            className={`page-item next ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button onClick={handleNextClick}>
              <i className="next" />
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default PaginationHandler;
