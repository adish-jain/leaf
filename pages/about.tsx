import Head from "next/head";
import React, { Component } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLoggedIn } from "../lib/UseLoggedIn";
import * as typeformEmbed from '@typeform/embed';
// import React, { Component } from 'react';

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

function AboutLeaf() {
    return (
        <div className={aboutStyles.aboutLeaf}>
            <h1>About</h1>
            <p>
                Leaf is a platform designed to reshape the way learners 
                interact with coding tutorials. Inspired by Stripe's side-by-side API 
                documentation, we wanted to build a tool which gives everyone 
                a convenient way to process information through reactive learning. <br></br><br></br>

                No more publishing code snippets on Medium! Leaf allows you to write out the steps of your coding tutorial using Markdown
                in the left pane, and then write the associated code of your steps in a code editor on 
                the right pane. <br></br><br></br>

                Leaf lets you associate your steps with parts of your codebase, so when you scroll
                through a finished tutorial, the code editor automatically scrolls to the
                relevant code. <br></br><br></br>
            </p>
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
                        Why do I need to provide an email?
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
                        Your email allows us to verify that you are a real human. Once you signup,
                        you'll get an email that allows you to verify who you are. You won't need to verify
                        yourself until you want to publish your first post!
                        </p>
                    </div>
                </div>

                <div className={aboutStyles.accordionItem} id="question2">
                    <a href="#question2">
                        Do I need an account?
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
                        Your account will allow you to keep all your tutorials in order. Once you publish your tutorial,
                        you'll get a permanent link to your tutorial which you'll be able to access through your account. 
                        </p>
                    </div>
                </div>

                <div className={aboutStyles.accordionItem} id="question3">
                    <a href="#question3">
                        What languages do you support?
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
                        Our code editor currently allows you to do automatic syntax-highlighting on an 
                        extensive list of languages: HTML, CSS, JSX, Javascript, Python, C/C++, Java, Go, PHP, Ruby, & plain text. 
                        You can change the language of your file by toggling the language selection or by renaming
                        your file with the relevant file extension. <br></br><br></br>
                        
                        Don't see one of your favorite languages here? Shoot us some feedback below!
                        </p>
                    </div>
                </div>

                <div className={aboutStyles.accordionItem} id="question4">
                    <a href="#question4">
                        O.K. I've started a draft. Can I save it & finish it later?
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
                        Everything you do in your draft is saved & stored for you to pick up later. 
                        </p>
                    </div>
                </div>

                <div className={aboutStyles.accordionItem} id="question5">
                    <a href="#question5">
                        How do I associate my tutorial's steps with code?
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
                        When you are in editing mode for a certain step, go to the file you want
                        to associate with the step. Highlight the lines of code you want to select
                        and you should be able to link the code to the step you're on.   
                        </p>
                    </div>
                </div>


                <div className={aboutStyles.accordionItem} id="question6">
                    <a href="#question6">
                        I'm trying to publish a post, but am running into an issue with email verification. What's this about?
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
                        Before you can publish your first post, we ask that you verify the email you signed up with! 
                        You should have received a verification email when you created your account, but if you can't find it,
                        you can re-request a verification email in Settings. <br></br><br></br>

                        You can also change your email there if you want to verify using a separate email. 
                        </p>
                    </div>
                </div>

                <div className={aboutStyles.accordionItem} id="question7">
                    <a href="#question7">
                        Can I edit my posts after publishing them?
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
                        Yes! We all make mistakes, and you can edit yours easily by clicking <b>Edit</b> under <b>Your Published Posts. </b>
                        This will allow you to edit any post you've already published. 
                        </p>
                    </div>
                </div>

                <div className={aboutStyles.accordionItem} id="question8">
                    <a href="#question8">
                        O.K. I've published my first post. Now what?
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
                        You now have a coding tutorial better than any you've published before! Get excited! <br></br><br></br>
                        Share the knowledge you've created & give us a good rating on Yelp.
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
            <h1>Feedback</h1>
            <p>
                Leaf is still in a very early-development stage as a tool, so we appreciate you staying
                with us while we work out the wrinkles & make this a smooth experience. <br></br><br></br>
                If you find any bugs or have ideas for improving Leaf, we're all ears. Fill out an issue below.
                <br></br><br></br>
            </p>
            <Series />
            {/* <form action="mailto:adish@getleaf.app" method="post" >
                <div className={aboutStyles.input}>
                    <input type="text" id="name" name="name" placeholder="Who are you?"/>
                </div>
                <input type="text" id="email" name="email" placeholder="Email"/>

                <select id="issue" name="issue">
                    <option value="Bug">Bug</option>
                    <option value="Idea">Idea</option>
                    <option value="Suggestion">Suggestion</option>
                    <option value="Other">Other</option>
                </select>

                <textarea id="subject" name="subject" placeholder="Message"></textarea>

                <input type="submit" value="Submit"/>

            </form> */}
        </div>
    );
}

class Series extends Component{
    componentDidMount() {
        const popup1 = typeformEmbed.makePopup(
            'https://adish664547.typeform.com/to/ggvipXSR', 
            {
                mode: 'popup',
                autoClose: 3000, 
                hideHeaders: true,
                hideFooter: true,
                onSubmit: function() {
                    console.log("Typeform successfully submitted")
                }
            }
        )
        // @ts-ignore
        document.getElementById('bt-popup').addEventListener('click', function() {
            popup1.open();
        });
    }

    render() {
        return (
            <div className={aboutStyles.popupButton}>
                <button id="bt-popup">Give us some feedback</button>
            </div>
        )
    }
}