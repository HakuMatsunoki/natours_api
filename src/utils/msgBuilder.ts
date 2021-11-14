export const requestsLimitMsg = (time: number): string =>
  `Too many requests from this ip address. Please, try again in an ${time} hour${
    time !== 1 ? "s" : ""
  }..`;

export const noUrlMsg = (url: string): string =>
  `Can't find ${url} on this server..`;
