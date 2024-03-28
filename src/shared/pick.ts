const pick = <T extends Record<string, unknown>, K extends keyof T>(
  filterObj: T,
  searchKeys: K[]
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of searchKeys) {
    if (filterObj && Object.hasOwnProperty.call(filterObj, key))
      finalObj[key] = filterObj[key];
  }
  console.log(finalObj);
  return finalObj;
};

export default pick;
