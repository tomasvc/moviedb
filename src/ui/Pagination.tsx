interface PaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

export const Pagination = ({ count, page, onChange }: PaginationProps) => {
  // Custom pagination implementation using Tailwind
  // Can include previous/next buttons, page numbers, etc.
};
