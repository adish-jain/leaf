import { serialize, parse } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { create } from "domain";

const TOKEN_NAME = "token";
const USER_TOKEN_AGE = 60 * 60; // 1 hour
const REFRESH_TOKEN_AGE = 5 * 365 * 24 * 60 * 60; // 5 years
const MAX_AGE = 60 * 60 * 8; // 8 hours

type tokenType = {
  tokenName: string;
  token: string;
};

export function setTokenCookies(res: NextApiResponse, tokens: tokenType[]) {
  let cookies = [];
  for (let i = 0; i < tokens.length; i++) {
    const newCookie = createCookie(tokens[i].tokenName, tokens[i].token, {
      maxAge: REFRESH_TOKEN_AGE,
      expires: new Date(Date.now() + REFRESH_TOKEN_AGE),
    });
    cookies.push(newCookie);
  }
  let authedCookie = createCookie("authed", true, { httpOnly: false });
  cookies.push(authedCookie);
  res.setHeader("Set-Cookie", cookies);
}

function createCookie(name: string, data: any, options = {}) {
  return serialize(name, data, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    ...options,
  });
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
