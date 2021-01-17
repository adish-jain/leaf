import { useEffect, useState } from "react";
import { useLoggedIn } from "../../lib/UseLoggedIn";
import { useUserInfo } from "../../lib/useUserInfo";
import { UserPageProps } from "../../typescript/types/backend/userTypes";
import profileStyles from "../../styles/profile.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import imageStyles from "../../styles/imageview.module.scss";
import TextareaAutosize from "react-autosize-textarea/lib";
import { useRouter } from "next/router";
import { DisplayPosts } from "./DisplayPosts";
import { DomainContext } from "../../contexts/domain-context";
import Header, { HeaderUnAuthenticated } from "../Header";

export default function UserContent(props: UserPageProps) {
  const [editingBio, toggleEditingBio] = useState(false);
  const [canEditBio, toggleCanEditBio] = useState(false);
  const [profileImage, changeProfileImage] = useState("");
  const [uploadFailed, changeUploadFailed] = useState(false);
  const { authenticated, error, loading } = useLoggedIn();
  const {
    username,
    about,
    twitter,
    github,
    website,
    changeAbout,
    changeTwitter,
    changeGithub,
    changeWebsite,
    saveNewProfile,
  } = useUserInfo(authenticated);
  const { profileUsername, userHost, profileData, onCustomDomain } = props;
  useEffect(() => {
    toggleCanEditBio(username === profileUsername);
  }, [username, props.profileUsername]);

  useEffect(() => {
    if (props.profileData !== undefined) {
      profileData.about !== undefined && profileData.about !== null
        ? changeAbout(profileData.about)
        : changeAbout(profileUsername + " hasn't written a bio");
      profileData.twitter !== undefined && profileData.twitter !== null
        ? changeTwitter(profileData.twitter)
        : null;
      profileData.github !== undefined && profileData.github !== null
        ? changeGithub(profileData.github)
        : null;
      profileData.website !== undefined && profileData.website !== null
        ? changeWebsite(profileData.website)
        : null;
      profileData.profileImage !== undefined &&
      profileData.profileImage !== null
        ? changeProfileImage(profileData.profileImage)
        : "";
    }
  }, [props.profileData]);

  return (
    <DomainContext.Provider
      value={{
        username: profileUsername,
        userHost: userHost,
        onCustomDomain,
      }}
    >
      {authenticated ? (
        <Header
          username={username}
          settings={true}
          logout={true}
          explore={true}
        />
      ) : (
        <HeaderUnAuthenticated
          login={true}
          signup={true}
          about={true}
          explore={true}
        />
      )}
      <div className="container">
        <h1 className={profileStyles["profile-header"]}></h1>
        <div className={profileStyles["profile-content"]}>
          <div className={profileStyles["profile-left-pane"]}>
            {canEditBio ? (
              <AnimatePresence>
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >
                  <EditableProfileImage
                    profileImage={profileImage}
                    profileUsername={props.profileUsername}
                    uploadFailed={uploadFailed}
                    changeUploadFailed={changeUploadFailed}
                    changeProfileImage={changeProfileImage}
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >
                  <UneditableProfileImage
                    profileImage={profileImage}
                    profileUsername={props.profileUsername}
                  />
                </motion.div>
              </AnimatePresence>
            )}
            <div className={profileStyles["profile-name"]}>
              {props.profileUsername}
            </div>
            <AnimatePresence>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                <About
                  editingBio={editingBio}
                  canEditBio={canEditBio}
                  about={about}
                  twitter={twitter}
                  github={github}
                  website={website}
                  changeAbout={changeAbout}
                  changeTwitter={changeTwitter}
                  changeGithub={changeGithub}
                  changeWebsite={changeWebsite}
                  toggleEditingBio={toggleEditingBio}
                  saveNewProfile={saveNewProfile}
                  username={username}
                  profileUsername={profileUsername}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={profileStyles["profile-right-pane"]}>
            {
              <AnimatePresence>
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >
                  <DisplayPosts posts={props.posts} />
                </motion.div>
              </AnimatePresence>
            }
          </div>
        </div>
      </div>
    </DomainContext.Provider>
  );
}

function EditableProfileImage(props: {
  profileImage: string;
  profileUsername: string;
  uploadFailed: boolean;
  changeUploadFailed: React.Dispatch<React.SetStateAction<boolean>>;
  changeProfileImage: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={profileStyles["profile-img"]}>
      <div className={profileStyles["profile-img-wrapper"]}>
        {props.profileImage === "" ? (
          props.profileUsername !== undefined ? (
            props.profileUsername.substr(0, 2)
          ) : (
            ""
          )
        ) : (
          <img src={props.profileImage} />
        )}
      </div>
      <div className={profileStyles["profile-img-shade"]}></div>
      <div className={profileStyles["profile-img-button"]}>
        <label className={imageStyles["add-image"]}>
          {props.uploadFailed ? "Try Image < 5MB" : "Upload Photo"}
          <input
            type="file"
            id="myFile"
            name="filename"
            accept="image/*"
            onChange={(e) =>
              handleProfileImageUpload(
                e,
                props.changeUploadFailed,
                props.changeProfileImage
              )
            }
          />
        </label>
        {props.profileImage !== "" && (
          <label
            className={imageStyles["add-image"]}
            onClick={(e) => handleProfileImageDelete(props.changeProfileImage)}
          >
            Delete Photo
          </label>
        )}
      </div>
    </div>
  );
}

async function saveProfileImage(
  selectedImage: File,
  changeProfileImage: React.Dispatch<React.SetStateAction<string>>
) {
  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  let data = {
    requestedAPI: "saveProfileImage",
    imageFile: await toBase64(selectedImage),
  };

  await fetch("/api/endpoint", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  })
    .then(async (res: any) => {
      let resJSON = await res.json();
      let url = resJSON.url;
      changeProfileImage(url);
    })
    .catch((error: any) => {
      console.log(error);
      console.log("upload failed.");
    });
}

function handleProfileImageUpload(
  e: React.ChangeEvent<HTMLInputElement>,
  changeUploadFailed: React.Dispatch<React.SetStateAction<boolean>>,
  changeProfileImage: React.Dispatch<React.SetStateAction<string>>
) {
  let selectedImage = e.target.files![0];
  if (selectedImage.size > 5000000) {
    changeUploadFailed(true);
  } else {
    saveProfileImage(selectedImage, changeProfileImage);
    changeUploadFailed(false);
  }
}

function UneditableProfileImage(props: {
  profileImage: string;
  profileUsername: string;
}) {
  return (
    <div className={profileStyles["profile-img-uneditable"]}>
      {props.profileImage === "" ? (
        props.profileUsername !== undefined ? (
          props.profileUsername.substr(0, 2)
        ) : (
          ""
        )
      ) : (
        <img src={props.profileImage} />
      )}
    </div>
  );
}

async function handleProfileImageDelete(
  changeProfileImage: React.Dispatch<React.SetStateAction<string>>
) {
  let data = {
    requestedAPI: "deleteProfileImage",
  };

  //optimistic mutate
  changeProfileImage("");

  await fetch("/api/endpoint", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  }).then(async (res: any) => {});
}

async function followUser(username: string, profileUsername: string) {
  let data = {
    requestedAPI: "followUser",
    username: username,
    profileUsername: profileUsername
  }

  await fetch("/api/endpoint", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  })
  .then(async (res: any) => {
    let resJSON = await res.json();
  })
  .catch((error: any) => {
    console.log(error);
    console.log("follow failed.");
  });
}

function About(props: {
  editingBio: boolean;
  canEditBio: boolean;
  about: string;
  twitter: string;
  github: string;
  website: string;
  changeAbout: React.Dispatch<React.SetStateAction<string>>;
  changeTwitter: React.Dispatch<React.SetStateAction<string>>;
  changeGithub: React.Dispatch<React.SetStateAction<string>>;
  changeWebsite: React.Dispatch<React.SetStateAction<string>>;
  toggleEditingBio: React.Dispatch<React.SetStateAction<boolean>>;
  saveNewProfile: () => Promise<void>;
  username: string;
  profileUsername: string;
}) {
  return (
    <div>
      <div className={profileStyles["profile-about-header"]}>ABOUT</div>
      <AboutSection
        editingBio={props.editingBio}
        about={props.about}
        changeAbout={props.changeAbout}
      />
      <div className={profileStyles["profile-about-icons"]}>
        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <TwitterSection
              editingBio={props.editingBio}
              twitter={props.twitter}
              changeTwitter={props.changeTwitter}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <GithubSection
              editingBio={props.editingBio}
              github={props.github}
              changeGithub={props.changeGithub}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <WebsiteSection
              editingBio={props.editingBio}
              website={props.website}
              changeWebsite={props.changeWebsite}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <EditProfileButton
            editingBio={props.editingBio}
            canEditBio={props.canEditBio}
            toggleEditingBio={props.toggleEditingBio}
            saveNewProfile={props.saveNewProfile}
            username={props.username}
            profileUsername={props.profileUsername}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EditProfileButton(props: {
  editingBio: boolean;
  canEditBio: boolean;
  toggleEditingBio: React.Dispatch<React.SetStateAction<boolean>>;
  saveNewProfile: () => Promise<void>;
  username: string;
  profileUsername: string;
}) {
  return props.canEditBio ? (
    props.editingBio ? (
      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <div
            className={profileStyles["profile-edit-button"]}
            onClick={(e) => {
              props.toggleEditingBio(!props.editingBio);
              props.saveNewProfile();
            }}
          >
            Save Profile
          </div>
        </motion.div>
      </AnimatePresence>
    ) : (
      <div
        className={profileStyles["profile-edit-button"]}
        onClick={(e) => props.toggleEditingBio(!props.editingBio)}
      >
        Edit Profile
      </div>
    )
  ) : (
    <div
      className={profileStyles["profile-edit-button"]}
      onClick={(e) => followUser(props.username, props.profileUsername)}
    >
      Follow
    </div>
  );
}

function TwitterSection(props: {
  editingBio: boolean;
  twitter: string;
  changeTwitter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return props.editingBio ? (
    <EditingTwitterSection
      twitter={props.twitter}
      changeTwitter={props.changeTwitter}
    />
  ) : (
    <SavedTwitterSection twitter={props.twitter} />
  );
}

function WebsiteSection(props: {
  editingBio: boolean;
  website: string;
  changeWebsite: React.Dispatch<React.SetStateAction<string>>;
}) {
  return props.editingBio ? (
    <EditingWebsiteSection
      website={props.website}
      changeWebsite={props.changeWebsite}
    />
  ) : (
    <SavedWebsiteSection website={props.website} />
  );
}

function SavedWebsiteSection(props: { website: string }) {
  return props.website !== "" ? (
    <div className={profileStyles["profile-icon-and-link"]}>
      <a href={validateWebsite(props.website)} target="blank">
        <img src="/images/webicon.svg" />
      </a>
      <a href={validateWebsite(props.website)} target="blank">
        <p>{props.website}</p>
      </a>
    </div>
  ) : (
    <div></div>
  );
}

function EditingWebsiteSection(props: {
  website: string;
  changeWebsite: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={profileStyles["profile-icon-and-input"]}>
      <img src="/images/webicon.svg" />
      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <TextareaAutosize
            placeholder={"Personal Website"}
            value={props.website}
            onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
              let myTarget = e.target as HTMLTextAreaElement;
              props.changeWebsite(myTarget.value);
            }}
            style={{
              fontSize: "15px",
              color: "D0D0D0",
            }}
            name="website"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EditingTwitterSection(props: {
  twitter: string;
  changeTwitter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={profileStyles["profile-icon-and-input"]}>
      <img src="/images/birdyicon.svg" />
      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <TextareaAutosize
            placeholder={"Twitter Handle"}
            value={props.twitter}
            onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
              let myTarget = e.target as HTMLTextAreaElement;
              props.changeTwitter(myTarget.value);
            }}
            style={{
              fontSize: "15px",
              color: "D0D0D0",
            }}
            name="twitter"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SavedTwitterSection(props: { twitter: string }) {
  return props.twitter !== "" ? (
    <div className={profileStyles["profile-icon-and-link"]}>
      <a href={"https://twitter.com/" + props.twitter} target="blank">
        <img src="/images/birdyicon.svg" />
      </a>
      <a href={"https://twitter.com/" + props.twitter} target="blank">
        <p>{props.twitter}</p>
      </a>
    </div>
  ) : (
    <div></div>
  );
}

function GithubSection(props: {
  editingBio: boolean;
  github: string;
  changeGithub: React.Dispatch<React.SetStateAction<string>>;
}) {
  return props.editingBio ? (
    <EditingGithubSection
      github={props.github}
      changeGithub={props.changeGithub}
    />
  ) : (
    <SavedGithubSection github={props.github} />
  );
}

function EditingGithubSection(props: {
  github: string;
  changeGithub: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={profileStyles["profile-icon-and-input"]}>
      <img src="/images/githubicon.svg" />
      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <TextareaAutosize
            placeholder={"Github Username"}
            value={props.github}
            onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
              let myTarget = e.target as HTMLTextAreaElement;
              props.changeGithub(myTarget.value);
            }}
            style={{
              fontSize: "15px",
              color: "D0D0D0",
            }}
            name="github"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SavedGithubSection(props: { github: string }) {
  return props.github !== "" ? (
    <div className={profileStyles["profile-icon-and-link"]}>
      <a href={"https://github.com/" + props.github} target="blank">
        <img src="/images/githubicon.svg" />
      </a>
      <a href={"https://github.com/" + props.github} target="blank">
        <p>{props.github}</p>
      </a>
    </div>
  ) : (
    <div></div>
  );
}

function validateWebsite(websiteURL: string): string {
  var match = websiteURL.match(
    /^(http|https|ftp)?(?:[\:\/]*)([a-z0-9\.-]*)(?:\:([0-9]+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i
  );
  let protocol = match![1];
  if (protocol === undefined) {
    websiteURL = "http://" + websiteURL;
  }
  return websiteURL;
}

function AboutSection(props: {
  editingBio: boolean;
  about: string;
  changeAbout: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={profileStyles["profile-about-content"]}>
      {props.editingBio ? (
        <div className={profileStyles["about-icon-and-input"]}>
          <AnimatePresence>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              <TextareaAutosize
                placeholder={"About yourself"}
                value={props.about}
                onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
                  let myTarget = e.target as HTMLTextAreaElement;
                  let myTargetConstrained = myTarget.value.replace(
                    /[\r\n\v]+/g,
                    ""
                  );
                  props.changeAbout(myTargetConstrained);
                }}
                style={{
                  fontSize: "15px",
                  color: "D0D0D0",
                }}
                maxLength={250}
                name="title"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        props.about
      )}
    </div>
  );
}
