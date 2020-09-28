import React, { Component } from "react";
import Link from "next/link";
import "../styles/header.scss";
import { goToIndex, goToLanding, logOut } from "../lib/UseLoggedIn";

type HeaderProps = {
  username?: string;
  signup?: boolean;
  login?: boolean;
  about?: boolean;
  settings?: boolean;
  profile?: boolean;
  logout?: boolean;
  examples?: boolean;
};

export class HeaderUnAuthenticated extends Component<HeaderProps> {
  constructor(props: HeaderProps) {
    super(props);
  }

  render() {
    const { signup, login, about, examples } = this.props;
    return (
      <div className={"header"}>
        <div className={"navbar"}>
          <Logo goTo={goToIndex} />
          <div className={"menu-items"}>
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
            {examples ? (
              <Link href="/examples">
                <a>Examples</a>
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
      <div className={"header"}>
        <div className={"navbar"}>
          <Logo goTo={goToLanding} />
          <div className={"menu-items"}>
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
    <div className={'logo'} onClick={props.goTo}>
      <img src="/images/LeafLogo.svg" />
    </div>
  );
}

function Logout() {
  return (
    <div className={"menu-item"} onClick={logOut}>
      Logout
    </div>
  );
}
