const apiJSON = (data, message, status) => {
  return {
    status: status || false,
    data: data || {},
    message: message || null,
    pagination: {
      next_page: null,
      next_max_id: null,
    },
  };
};
export default apiJSON;
