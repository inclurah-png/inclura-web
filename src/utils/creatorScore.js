import {
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "../firebase";

export async function addVideoPost(uid) {
  await updateDoc(doc(db, "users", uid), {
    "creatorEconomy.monthlyVideoPosts": increment(1),
    "creatorEconomy.creatorScore": increment(4),
  });
}

export async function addTextPost(uid) {
  await updateDoc(doc(db, "users", uid), {
    "creatorEconomy.monthlyTextPosts": increment(1),
    "creatorEconomy.creatorScore": increment(2),
  });
}

export async function addCrossPost(uid) {
  await updateDoc(doc(db, "users", uid), {
    "creatorEconomy.monthlyCrossPosts": increment(1),
    "creatorEconomy.creatorScore": increment(5),
  });
}

export async function addComment(uid) {
  await updateDoc(doc(db, "users", uid), {
    "creatorEconomy.communityTrust": increment(2),
  });
}
