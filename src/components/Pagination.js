import { Pagination } from "react-bootstrap";

const Paginate = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPages = () => {
    const pages = [];
    for (let num = 1; num <= totalPages; num++) {
      pages.push(
        <Pagination.Item
          key={num}
          active={num === currentPage}
          onClick={() => onPageChange(num)}
        >
          {num}
        </Pagination.Item>
      );
    }
    return pages;
  };

  return (
    <Pagination className="justify-content-center mt-3">
      {renderPages()}
    </Pagination>
  );
};

export default Paginate;
