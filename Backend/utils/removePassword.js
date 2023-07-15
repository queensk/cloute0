const removePassword = async (data) => {
  const dataWithoutPassword = data.map((item) => {
    const dataCopy = { ...item };
    delete dataCopy.password;
    return dataCopy;
  });
  return dataWithoutPassword;
};

export default removePassword;
