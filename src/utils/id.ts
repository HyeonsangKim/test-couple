let counter = 100;
export const generateId = (): string => {
  counter += 1;
  return `id_${Date.now()}_${counter}`;
};
