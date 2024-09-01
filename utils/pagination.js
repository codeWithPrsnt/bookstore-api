const paginate = (query) => {
    const { skip = 1, limit = process.env.LIMIT_PER_PAGE } = query;
    return { skip: parseInt(skip), limit: parseInt(limit) };
  };
  
  export default paginate;
  