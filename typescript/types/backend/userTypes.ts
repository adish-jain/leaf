import { SignUpMethods } from "../../enums/backend/userEnums";
import { Post } from "../app_types";

export type fireBaseUserType = {
  about?: string;
  admin?: boolean;
  email: string;
  github?: string;
  profileImage?: string;
  twitter?: string;
  username?: string;
  website?: string;
  firebaseId?: string;
  method?: SignUpMethods;
};

export type UserPageProps = {
  profileUsername: string;
  profileData: fireBaseUserType;
  errored: boolean;
  uid: string;
  posts: Post[];
  customDomain: boolean;
};
