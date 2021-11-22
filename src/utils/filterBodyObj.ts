interface UnknownObj {
  [prop: string]: string;
}

export const filterBodyObj = (
  obj: UnknownObj,
  ...allowedFields: string[]
): UnknownObj => {
  const newObj: UnknownObj = {};

  Object.keys(obj).forEach((item) => {
    if (allowedFields.includes(item)) newObj[item] = obj[item];
  });

  return newObj;
};
