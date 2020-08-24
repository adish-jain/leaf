import Head from "next/head";
import React, { Component, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as typeformEmbed from "@typeform/embed";
import { usePosts } from "../lib/usePosts";

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
        <script src="https://embed.typeform.com/embed.js"></script>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header goToIndex={goToIndex} />
        <div>
          <div className={aboutStyles.container}>
            <AboutLeaf />
            <FAQ />
            <Team />
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
function Header(props: { goToIndex: any }) {
  return (
    <div className={aboutStyles.Header}>
      <NavBar goToIndex={props.goToIndex} />
      {/* <hr></hr> */}
    </div>
  );
}

function NavBar(props: { goToIndex: any }) {
  return (
    <div className={aboutStyles.NavBar}>
      <Logo goToIndex={props.goToIndex} />
      <Login />
      <Signup />
    </div>
  );
}

function Logo(props: { goToIndex: any }) {
  return (
    <div className={aboutStyles.Logo} onClick={props.goToIndex}>
      <img src="/images/LeafLogo.svg" />
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

function SectionHeader(props: { title: string }) {
  return (
    <div className={aboutStyles["section-container"]}>
      <h1 className={aboutStyles["section-header"]}>{props.title}</h1>
      <hr />
    </div>
  );
}

function AboutLeaf() {
  return (
    <div className={aboutStyles.aboutLeaf}>
      <SectionHeader title={"About"} />
      <p>
        Leaf is a platform designed to reshape the way learners interact with
        coding tutorials. Inspired by{" "}
        <a
          href="https://stripe.com/docs/payments/integration-builder"
          target="_blank"
        >
          Stripe's side-by-side API documentation
        </a>
        , we wanted to build a tool which gives everyone a convenient way to
        process information through reactive learning.
        <br></br>
        <br></br>
        No more publishing code snippets on Medium! Leaf allows you to write out
        the steps of your coding tutorial using Markdown in the left pane, and
        then write the associated code of your steps in a code editor on the
        right pane. <br></br>
        <br></br>
        Leaf lets you associate your steps with parts of your codebase, so when
        you scroll through a finished tutorial, the code editor automatically
        scrolls to the relevant code. <br></br>
        <br></br>
      </p>
    </div>
  );
}

function Dropdown(props: { title: string; children: any }) {
  const [opened, toggleOpen] = useState(false);
  return (
    <div className={aboutStyles["dropdown"]}>
      <div className={aboutStyles["header"]}>
        <button onClick={(e) => toggleOpen(!opened)}>
          {opened ? "▾" : "▸"}
        </button>
        <p>{props.title}</p>
      </div>
      <div className={aboutStyles["dropdown-content"]}>
        {opened ? props.children : <div></div>}
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <div>
      <SectionHeader title={"FAQ"} />
      <Dropdown title={"What languages do you support?"}>
        <p>
          Our code editor currently allows you to do automatic
          syntax-highlighting on an extensive list of languages: HTML, CSS, JSX,
          Javascript, Python, C/C++, Java, Go, PHP, Ruby, & plain text. You can
          change the language of your file by toggling the language selection or
          by renaming your file with the relevant file extension. <br></br>
          <br></br>
          Don't see one of your favorite languages here? Shoot us some feedback
          below!
        </p>

        <img
          className={aboutStyles.animatedGif}
          src="/images/languagetoggle.gif"
        ></img>
      </Dropdown>
      <Dropdown title={"How do I associate my tutorial's steps with code?"}>
        <p>
          When you are in editing mode for a certain step, go to the file you
          want to associate with the step. Highlight the lines of code you want
          to select and you should be able to link the code to the step you're
          on.
        </p>
        <img
          className={aboutStyles.animatedGif}
          src="/images/associatecode.gif"
        ></img>
      </Dropdown>
      <Dropdown
        title={
          "I'm trying to publish a post, but am running into an issue with email verification. What's this about?"
        }
      >
        <p>
          Before you can publish your first post, we ask that you verify the
          email you signed up with! You should have received a verification
          email when you created your account, but if you can't find it, you can
          re-request a verification email in Settings. <br></br>
          <br></br>
          You can also change your email there if you want to verify using a
          separate email.
        </p>
      </Dropdown>
      <Dropdown title={"Can I edit my posts after publishing them?"}>
        <p>
          Yes! We all make mistakes, and you can edit yours easily by clicking
          <b> Edit</b> under <b>Your Published Posts. </b>
          This will allow you to edit any post you've already published.
        </p>
        <img
          className={aboutStyles.animatedGif}
          src="/images/editingposts.gif"
        ></img>
      </Dropdown>
      <Dropdown title={"O.K. I've published my first post. Now what?"}>
        <p>
          You now have a coding tutorial better than any you've published
          before! Get excited! <br></br>
          <br></br>
          Share the knowledge you've created & give us a good rating on Yelp.
        </p>
      </Dropdown>
    </div>
  );
}

function PersonCard(props: {
  img: string;
  name: string;
  children: any;
  username: string;
}) {
  const { name, username } = props;
  return (
    <div className={aboutStyles["person-card"]}>
      <div className={aboutStyles["img-header"]}>
        <img
          className={aboutStyles["profile-pic"]}
          src={`/images/${props.img}.png`}
        ></img>
        <div className={aboutStyles["bio"]}>
          <div>
            <h3>{name}</h3>
            {props.children}
          </div>
          <div className={aboutStyles.icons}>
            <a href={`https://twitter.com/${username}`} target="_blank">
              <img src="images/twitter.svg" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Team() {
  return (
    <div className={aboutStyles["team"]}>
      <SectionHeader title={"The Team"} />
      <div className={aboutStyles["people"]}>
        <PersonCard img={"rah"} name={"Rahul Sarathy"} username={"outofthebot"}>
          <p className={aboutStyles.img__description}>
            I previously created <a href="https://getpulp.io">getpulp.io</a>{" "}
            where I was trying to figure out how to improve the experience of
            reading things online. I’m endlessly curious about how people can
            express themselves on the internet in ways other than a standard
            blog post or video. If questions like this also interest you, feel
            free to reach out.
          </p>
        </PersonCard>
        <PersonCard img={"adi"} name={"Adish Jain"} username={"_adishj"}>
          <p className={aboutStyles.img__description}>
            I am really interested in problems having to do with educational
            systems. Tech can be used to foster better learning and improve the
            transfer of knowledge, and as a computer science teacher of 3 years,
            I'm always looking for better ways to convey ideas to people. Want
            to talk? Shoot me a message.
          </p>
        </PersonCard>
      </div>
    </div>
  );
}

function Team1() {
  return (
    <div className={aboutStyles.teamSection}>
      <SectionHeader title={"The Team"} />
      <div className={aboutStyles.teamBody}>
        <div className={aboutStyles.img__wrap}>
          <figure className={aboutStyles.figure}>
            <img className={aboutStyles.img__img} src="/images/rah.png"></img>
            <figcaption>
              Rahul Sarathy<br></br>
              Co-Founder, CEO<br></br>
            </figcaption>
          </figure>
          <div className={aboutStyles.img__description_layer}>
            <p className={aboutStyles.img__description}>
              I previously created <a href="getpulp.io">getpulp.io</a> where I
              was trying to figure out how to improve the experience of reading
              things online. I’m endlessly curious about how people can express
              themselves on the internet in ways other than a standard blog post
              or video.<br></br>
              <br></br>
              If questions like this also interest you, feel free to reach out
              via Twitter.
              <br></br>
              <br></br>
              <div className={aboutStyles.icons}>
                <a href="https://twitter.com/outofthebot" target="_blank">
                  <img src="https://img.icons8.com/color/48/000000/twitter.png" />
                </a>
              </div>
            </p>
          </div>
        </div>

        <div className={aboutStyles.img__wrap}>
          <figure className={aboutStyles.figure}>
            <img className={aboutStyles.img__img} src="/images/adi.png"></img>
            <figcaption>
              Adish Jain<br></br>
              Co-Founder, CTO<br></br>
            </figcaption>
          </figure>

          <div className={aboutStyles.img__description_layer}>
            <p className={aboutStyles.img__description}>
              I am really interested in problems having to do with educational
              systems. Tech can be used to foster better learning and improve
              the transfer of knowledge, and as a computer science teacher of 3
              years, I'm always looking for better ways to convey ideas to
              people. <br></br>
              <br></br>
              Want to talk? Shoot me a message on Twitter.
              <br></br>
              <br></br>
              <div className={aboutStyles.icons}>
                <a href="https://twitter.com/_adishj" target="_blank">
                  <img src="https://img.icons8.com/color/48/000000/twitter.png" />
                </a>
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feedback() {
  return (
    <div className={aboutStyles.feedback}>
      <SectionHeader title={"Feedback"} />
      <p>
        Leaf is still in a very early-development stage as a tool, so we
        appreciate you staying with us while we work out the wrinkles & make
        this a smooth experience.
        <br></br>
        <br></br>If you find any bugs or have ideas for improving Leaf, we're
        all ears. Fill out an issue below.
        <br></br>
        <br></br>
      </p>
      <TypeForm />
    </div>
  );
}

class TypeForm extends Component {
  componentDidMount() {
    const popup1 = typeformEmbed.makePopup(
      "https://adish664547.typeform.com/to/ggvipXSR",
      {
        mode: "popup",
        autoClose: 3000,
        hideHeaders: true,
        hideFooter: true,
        onSubmit: function () {
          console.log("Typeform successfully submitted");
        },
      }
    );
    // @ts-ignore
    document.getElementById("bt-popup").addEventListener("click", function () {
      popup1.open();
    });
  }

  render() {
    return (
      <div className={aboutStyles.popupButton}>
        <button id="bt-popup">Give us some feedback</button>
      </div>
    );
  }
}
