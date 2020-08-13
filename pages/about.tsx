import Head from "next/head";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLoggedIn } from "../lib/UseLoggedIn";

const aboutStyles = require("../styles/About.module.scss");

export default function About() {
    const router = useRouter();

    const goToIndex = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        router.push("/");
    };

  return (
    <div>
      <Head>
        <title>About</title>
        <script src="https://unpkg.com/ionicons@5.1.2/dist/ionicons.js"></script>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <Header goToIndex={goToIndex}/>
        <div>
            <div className={aboutStyles.container}>
                <AboutLeaf />
                <FAQ />
                <Feedback />
            </div>
        </div>
      </main>
    </div>
  );
}

/*
Header Components
*/
function Header(props: {goToIndex: any}) {
    return (
      <div className={aboutStyles.Header}>
        <NavBar goToIndex={props.goToIndex}/>
      </div>
    );
  }
  
function NavBar(props: {goToIndex: any}) {
    return (
        <div className={aboutStyles.NavBar}>
        <Logo goToIndex={props.goToIndex}/>
        <Login />
        <Signup />
        <AboutNav />
        </div>
    );
}

function Logo(props: {goToIndex: any}) {
    return (
        <div className={aboutStyles.Logo} onClick={props.goToIndex}> 
        Leaf.
        </div>  
    );
}

function Login() {
    return (
        <div className={aboutStyles.Login}>
        <Link href="/login">
            <a>Login</a>
        </Link>
        </div>
    );
}

function Signup() {
    return (
        <div className={aboutStyles.Login}>
        <Link href="/signup">
            <a>Signup</a>
        </Link>
        </div>
    );
}

function AboutNav() {
    return (
        <div className={aboutStyles.Login}>
        <Link href="/about">
            <a>About</a>
        </Link>
        </div>
    );
}

/**
 *  Accordion tutorial by Julio Codes
 * 	@youtube     https://www.youtube.com/watch?v=MXrtXg1kpVs
 */
function FAQ() {
    return (
        <div>
            <h1>FAQ</h1>
            <div className={aboutStyles.accordion}>
                <div className={aboutStyles.accordionItem} id="question1">
                    <a href="#question1">
                        How often do you go to the beach?
                        <div className={aboutStyles.addIcon}>
                            {//@ts-ignore
                            <ion-icon icon="add"></ion-icon>
                            }
                        </div>
                        <div className={aboutStyles.removeIcon}>
                            {//@ts-ignore
                            <ion-icon icon="remove"></ion-icon>
                            }
                        </div>
                    </a>
                    <div className={aboutStyles.answer}>
                        <p>
                        I go to the beach many times a week.
                        </p>
                    </div>
                </div>

                <div className={aboutStyles.accordionItem} id="question2">
                    <a href="#question2">
                        How often do you go to the beach?
                        <div className={aboutStyles.addIcon}>
                            {//@ts-ignore
                            <ion-icon icon="add"></ion-icon>
                            }
                        </div>
                        <div className={aboutStyles.removeIcon}>
                            {//@ts-ignore
                            <ion-icon icon="remove"></ion-icon>
                            }
                        </div>
                    </a>
                    <div className={aboutStyles.answer}>
                        <p>
                        I go to the beach many times a week.
                        </p>
                    </div>
                </div>

                <div className={aboutStyles.accordionItem} id="question3">
                    <a href="#question3">
                        How often do you go to the beach?
                        <div className={aboutStyles.addIcon}>
                            {//@ts-ignore
                            <ion-icon icon="add"></ion-icon>
                            }
                        </div>
                        <div className={aboutStyles.removeIcon}>
                            {//@ts-ignore
                            <ion-icon icon="remove"></ion-icon>
                            }
                        </div>
                    </a>
                    <div className={aboutStyles.answer}>
                        <p>
                        I go to the beach many times a week.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
  }

function AboutLeaf() {
    return (
        <div>
            <h1>About</h1>
            <p>Our vision with Leaf is to create</p>
        </div>
    );
}

function Feedback() {
    return (
        <div>
            <h1>Feedback</h1>
            <h3>Found a bug? Have ideas on improving Leaf? We're all ears</h3>
        </div>
    );
}