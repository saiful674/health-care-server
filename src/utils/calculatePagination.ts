type TCalculatePaginationOptions = {
  page: string;
  limit: string;
  sortBy: string;
  sortOrder: string;
};
const calculatePagination = (options: TCalculatePaginationOptions) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export default calculatePagination;
