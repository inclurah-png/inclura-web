import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function sendNotification({
  receiverId,
  senderId,
  type,
  text,
}) {
  try {
    await addDoc(
      collection(
        db,
        "notifications"
      ),
      {
        receiverId,
        senderId,
        type,
        text,
        read: false,
        createdAt:
          serverTimestamp(),
      }
    );
  } catch (error) {
    console.log(error);
  }
}
