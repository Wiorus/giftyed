import { Timestamp } from "firebase/firestore";

export type UserApp = {
  _id: string;
  createAt: Date;
  displayName: string;
  email: string;
  birthday: Timestamp | null;
  age: number | null;
  photoURL: string | null;
  interests: Array<string> | null;
  followed: Array<string> | null;
  wishes: Array<string> | null;
};
