export const appConfig = {
  BCRYPT_COST: process.env.BCRYPT_COST ? +process.env.BCRYPT_COST : 12,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "mega_super-SecReT",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "super_duper_seCreT",
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "30m",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d"
};
