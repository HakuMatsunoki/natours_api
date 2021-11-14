export const userNameHandler = (name: string): string =>
  name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^A-Za-z]/g, " ")
    .split(" ")
    .join(" ");
