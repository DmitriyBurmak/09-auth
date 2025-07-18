import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  page: number;
  onPageChange: (selected: number) => void;
  totalPages: number;
}

export default function Pagination({
  page,
  onPageChange,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={selectedItem => onPageChange(selectedItem.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.page}
      previousClassName={css.arrow}
      nextClassName={css.arrow}
      breakClassName={css.break}
      disabledClassName={css.disabled}
    />
  );
}
