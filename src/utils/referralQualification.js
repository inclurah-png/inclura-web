
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  Timestamp,
} from "firebase/firestore";

import { db, auth } from "../firebase";

export async function checkReferralQualification(uid) {
  const userRef = doc(db, "users", uid);

  const snap = await getDoc(userRef);

  if (!snap.exists()) return;

  const user = snap.data();

  // Already active
  if (user.isActiveReferral) return;

  const creator = user.creatorEconomy || {};

  // ACCOUNT AGE
  let accountAge = false;

  if (user.createdAt) {
    const days =
      (Date.now() - user.createdAt.toDate()) /
      (1000 * 60 * 60 * 24);

    accountAge = days >= 30;
  }

  // EMAIL VERIFIED
  const emailVerified =
    auth.currentUser?.emailVerified || false;

  // PROFILE COMPLETED
  const profileCompleted =
    !!user.displayName &&
    !!user.username &&
    !!user.photoURL &&
    !!user.bio;

  // POSTS
  const posts =
    (creator.monthlyVideoPosts || 0) +
    (creator.monthlyTextPosts || 0);

  // CREATOR SCORE
  const creatorScore =
    creator.creatorScore || 0;

  // LAST LOGIN
  let recentLogin = false;

  if (user.lastLogin) {
    const days =
      (Date.now() - user.lastLogin.toDate()) /
      (1000 * 60 * 60 * 24);

    recentLogin = days <= 20;
  }

  const qualified =
    accountAge &&
    emailVerified &&
    profileCompleted &&
    posts >= 10 &&
    creatorScore >= 20 &&
    recentLogin;

  if (!qualified) return;

  await updateDoc(userRef, {
    isActiveReferral: true,
  });

  if (user.referredBy) {
    const referrerRef = doc(
      db,
      "users",
      user.referredBy
    );

    await updateDoc(referrerRef, {
      activeReferrals: increment(1),
      referralQualityScore: increment(5),
    });
  }
    }
