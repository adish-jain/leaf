import Head from "next/head";
import React, { Component, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as typeformEmbed from "@typeform/embed";
import { usePosts } from "../lib/usePosts";
import { HeaderUnAuthenticated } from "../components/Header";

import aboutStyles from "../styles/about.module.scss";
import { useHost } from "../lib/api/useHost";
import ErroredPage from "./404";

export default function About() {
  const router = useRouter();

  const { onCustomDomain } = useHost();

  if (onCustomDomain) {
    return <ErroredPage></ErroredPage>;
  }

  const goToIndex = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div>
      <Head>
        <title>About</title>
        <script src="https://embed.typeform.com/embed.js"></script>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HeaderUnAuthenticated explore={true} signup={true} login={true} />
        <div>
          <div className={aboutStyles["about-container"]}>
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
    <div className={aboutStyles["aboutLeaf"]}>
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
      <div className={aboutStyles["about-header"]}>
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
          className={aboutStyles["animatedGif"]}
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
          <div className={aboutStyles["icons"]}>
            <a href={`https://twitter.com/${username}`} target="_blank">
              <img src="images/bluebirdyicon.svg" />
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
          <p className={aboutStyles["img__description"]}>
            I previously created <a href="https://getpulp.io">getpulp.io</a>{" "}
            where I was trying to figure out how to improve the experience of
            reading things online. I’m endlessly curious about how people can
            express themselves on the internet in ways other than a standard
            blog post or video. If questions like this also interest you, feel
            free to reach out.
          </p>
        </PersonCard>
        <PersonCard img={"adi"} name={"Adish Jain"} username={"_adishj"}>
          <p className={aboutStyles["img__description"]}>
            I am really interested in problems having to do with educational
            systems. Tech can be used to foster better learning and improve the
            transfer of knowledge, and as a computer science teacher of 3 years,
            I'm always looking for better ways to convey ideas to people. Want
            to talk? Shoot me a message.
          </p>
        </PersonCard>
        <PersonCard img={"ria"} name={"Ruchika Gupta"} username={"Ruchika00291026"}>
          <p className={aboutStyles["img__description"]}>
            I grew up in Africa and am a left my home and family behind to
            pursue a computer science education in the United States. After
            graduating, I joined a start-up in the data science and web3
            space, where I was a full-stack engineer focused on
            responsive and accesible design. Education has been key to opening
            so many doors in my life, both professionally and culturally.
            Therefore, I am so excited to be building a tool which can help educate
            others.
          </p>
        </PersonCard>
      </div>
    </div>
  );
}

function Feedback() {
  return (
    <div className={aboutStyles["feedback"]}>
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
      <div className={aboutStyles["popupButton"]}>
        <button id="bt-popup">Give us some feedback</button>
      </div>
    );
  }
}
