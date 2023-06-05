import {TablePagination} from "@mui/material";
import * as React from "react";

interface PaginationProps {
  total: number;
  page: number;
  itemsPerPage?: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
}

const Pagination = ({ total, page, itemsPerPage = 5, onPageChange }: PaginationProps) => {
  return <TablePagination rowsPerPageOptions={[5]} count={total} page={page} onPageChange={onPageChange} rowsPerPage={itemsPerPage} />
};

export default Pagination;
