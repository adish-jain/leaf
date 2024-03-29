import { SignUpMethods } from "../../enums/backend/userEnums";
import { Post } from "../app_types";

export type fireBaseUserType = {
  about?: string | null;
  admin?: boolean;
  email: string;
  github?: string | null;
  profileImage?: string | null;
  twitter?: string | null;
  username?: string;
  website?: string | null;
  uid?: string;
  method?: SignUpMethods;
  numFollowers?: number | null;
  numFollowing?: number | null;
};

export type UserPageProps = {
  profileUsername: string;
  profileData: fireBaseUserType;
  errored: boolean;
  uid: string;
  posts: Post[];
  userHost: string;
  onCustomDomain: boolean;
};
