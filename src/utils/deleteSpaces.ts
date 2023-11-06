export const deleteSpaces = (text: string) =>
  text
    .split('\n')
    .filter((linea) => linea.trim() !== '')
    .join('\n');
