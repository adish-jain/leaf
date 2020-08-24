import React, { Component } from "react";
import Link from "next/link";
const headerStyles = require("../styles/Header.module.scss");
import { goToIndex, logOut } from "../lib/UseLoggedIn";

type HeaderProps = {
  username: string;
  signup: boolean;
  login: boolean;
  about: boolean;
  settings: boolean;
  profile: boolean;
};

export default class Header extends Component<HeaderProps> {
  constructor(props: HeaderProps) {
    super(props);
  }

  render() {
    let { username } = this.props;
    return (
      <div className={headerStyles["header"]}>
        <div className={headerStyles["navbar"]}>
          <Logo />
          <div className={headerStyles["menu-items"]}>
            <Link href={`/${username}`}>
              <a>Profile</a>
            </Link>
            <Link href="/settings">
              <a>Settings</a>
            </Link>
            <Logout />
          </div>
        </div>
      </div>
    );
  }
}

function Logo() {
  return (
    <div className={headerStyles.logo} onClick={goToIndex}>
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
