import React, { Component, useContext } from "react";
import Link from "next/link";
import headerStyles from "../styles/header.module.scss";
import { goToIndex, goToLanding, logOut } from "../lib/UseLoggedIn";
import { goToProfileFromLanding, useHost } from "../lib/api/useHost";
import { DomainContext } from "../contexts/domain-context";
import { getHomeDomain } from "../lib/domainUtils";

type HeaderProps = {
  username?: string;
  signup?: boolean;
  login?: boolean;
  about?: boolean;
  settings?: boolean;
  profile?: boolean;
  logout?: boolean;
  explore?: boolean;
};

export function HeaderUnAuthenticated(props: HeaderProps) {
  const { signup, login, about, explore } = props;
  const { onCustomDomain } = useHost();
  return (
    <div className={headerStyles["header"]}>
      <div className={headerStyles["navbar"]}>
        <Logo goTo={goToIndex} />
        <div className={headerStyles["menu-items"]}>
          {signup ? (
            <Link href={`${getHomeDomain()}/signup`}>
              <a>Signup</a>
            </Link>
          ) : (
            <div></div>
          )}

          {login ? (
            <Link href="/login">
              <a>Login</a>
            </Link>
          ) : (
            <div></div>
          )}
          {about ? (
            <Link href={`${getHomeDomain()}/about`}>
              <a>About</a>
            </Link>
          ) : (
            <div></div>
          )}
          {explore ? (
            <Link href={`${getHomeDomain()}/explore`}>
              <a>Explore</a>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Header(props: HeaderProps) {
  const { username, onCustomDomain, userHost } = useContext(DomainContext);
  let { profile, settings, explore, logout } = props;

  return (
    <div className={headerStyles["header"]}>
      <div className={headerStyles["navbar"]}>
        <Logo goTo={goToLanding} />
        <div className={headerStyles["menu-items"]}>
          {profile ? (
            <a
              href={goToProfileFromLanding(onCustomDomain, userHost, username)}
            >
              Profile
            </a>
          ) : (
            <div></div>
          )}
          {settings ? (
            <Link href="/settings">
              <a>Settings</a>
            </Link>
          ) : (
            <div></div>
          )}
          {explore ? (
            <Link href="/explore">
              <a>Explore</a>
            </Link>
          ) : (
            <div></div>
          )}
          {logout ? <Logout /> : <div></div>}
        </div>
      </div>
    </div>
  );
}

function Logo(props: { goTo: () => void }) {
  return (
    <div className={headerStyles["logo"]} onClick={props.goTo}>
      <img src="/images/LeafLogo.svg" />
    </div>
  );
}

function Logout() {
  return (
    <div className={headerStyles["menu-item"]} onClick={logOut}>
      Logout
    </div>
  );
}
