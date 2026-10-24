const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,

  secure: isProduction,

  sameSite: isProduction ? "none" : "lax",
};

const accessTokenCookieOptions = {
  ...baseCookieOptions,

  maxAge: 15 * 60 * 1000,
};

const refreshTokenCookieOptions = {
  ...baseCookieOptions,

  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export {
  baseCookieOptions,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
};
