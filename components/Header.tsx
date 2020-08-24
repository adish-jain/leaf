import React, { Component } from "react";
import Link from "next/link";
const headerStyles = require("../styles/Header.module.scss");
import { goToIndex, goToLanding, logOut } from "../lib/UseLoggedIn";

type HeaderProps = {
  username?: string;
  signup?: boolean;
  login?: boolean;
  about?: boolean;
  settings?: boolean;
  profile?: boolean;
  logout?: boolean;
};

export class HeaderUnAuthenticated extends Component<HeaderProps> {
  constructor(props: HeaderProps) {
    super(props);
  }

  render() {
    const { signup, login, about } = this.props;
    return (
      <div className={headerStyles["header"]}>
        <div className={headerStyles["navbar"]}>
          <Logo goTo={goToIndex} />
          <div className={headerStyles["menu-items"]}>
            {signup ? (
              <Link href="/signup">
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
              <Link href="/about">
                <a>About</a>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default class Header extends Component<HeaderProps> {
  constructor(props: HeaderProps) {
    super(props);
  }

  render() {
    let { username, profile, settings, logout } = this.props;
    return (
      <div className={headerStyles["header"]}>
        <div className={headerStyles["navbar"]}>
          <Logo goTo={goToLanding} />
          <div className={headerStyles["menu-items"]}>
            {profile ? (
              <Link href={`/${username}`}>
                <a>Profile</a>
              </Link>
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
            {logout ? <Logout /> : <div></div>}
          </div>
        </div>
      </div>
    );
  }
}

function Logo(props: { goTo: () => void }) {
  return (
    <div className={headerStyles.logo} onClick={props.goTo}>
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
