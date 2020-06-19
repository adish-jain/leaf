import { serialize, parse } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const TOKEN_NAME = "token";
const MAX_AGE = 60 * 60 * 8; // 8 hours

type tokenType = {
  tokenName: string;
  token: string;
};

export function setTokenCookies(res: NextApiResponse, tokens: tokenType[]) {
  let cookies = [];
  for (let i = 0; i < tokens.length; i++) {
    const cookie = serialize(tokens[i].tokenName, tokens[i].token, {
      maxAge: MAX_AGE,
      expires: new Date(Date.now() + MAX_AGE * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    cookies.push(cookie);
  }

  res.setHeader("Set-Cookie", cookies);
}

export function removeTokenCookies(res: NextApiResponse, tokens: string[]) {
  let cookies = [];
  for (let i = 0; i < tokens.length; i++) {
    const cookie = serialize(tokens[i], "", {
      maxAge: -1,
      path: "/",
    });
    cookies.push(cookie);
  }

  res.setHeader("Set-Cookie", cookies);
}

// export function removeTokenCookie(res: NextApiResponse, token: string) {

// }

export function parseCookies(req: NextApiRequest) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || "");
}

export function getTokenCookie(req: NextApiRequest) {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
}
