
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  runTransaction,
} from "firebase/firestore";

import { db, auth } from "../firebase";
  }


  async function reactToPost(postId, emoji) {
    const user = auth.currentUser;
async function reactToPost(postId, emoji) {
  const user = auth.currentUser;

    if (!user) {
      alert("Please sign in to react to a post.");
      return;
    }
  if (!user) {
    alert("Please sign in to react to a post.");
    return;
  }

    const scoreMap = {
      "❤️": 4,
      "👏": 3,
      "😊": 3,
      "👍": 2,
      "😂": 2,
      "😮": 2,
      "😢": 2,
      "👎": -3,
    };
  const allowedEmojis = [
    "❤️",
    "👏",
    "😊",
    "👍",
    "😂",
    "😮",
    "😢",
    "👎",
  ];
  if (!allowedEmojis.includes(emoji)) {
    return;
  }

    if (!Object.prototype.hasOwnProperty.call(scoreMap, emoji)) {
      return;
    }
  const API_BASE_URL = (
    import.meta.env.VITE_AI_BACKEND_URL ||
    "https://inclura-ai-backend.onrender.com"
  ).replace(/\/+$/, "");
  try {
    // Obtain a Firebase ID token for the signed-in user.
    const idToken = await user.getIdToken();
    const response = await fetch(
      `${API_BASE_URL}/api/posts/${encodeURIComponent(postId)}/react`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emoji,
        }),
      }
    );

    const postRef = doc(db, "posts", postId);
    let result;

    try {
      const result = await runTransaction(db, async (transaction) => {
        const postSnap = await transaction.get(postRef);
        if (!postSnap.exists()) {
          throw new Error("This post no longer exists.");
        }
        const post = postSnap.data();
        const creatorId = post.userId;
        if (!creatorId) {
          throw new Error(
            "The post has no creator ID. No score was changed."
          );
        }
        // A creator must not earn engagement points
        // by reacting to their own post.
        if (creatorId === user.uid) {
          throw new Error(
            "You cannot earn creator points by reacting to your own post."
          );
        }
        const creatorRef = doc(db, "users", creatorId);
        const creatorSnap = await transaction.get(creatorRef);
        if (!creatorSnap.exists()) {
          throw new Error(
            "The creator profile could not be found. No reaction was saved."
          );
        }
        const previousReactions = post.userReactions || {};
        const previousReaction = previousReactions[user.uid] || null;
        const reactions = {
          "👍": 0,
          "❤️": 0,
          "😂": 0,
          "😊": 0,
          "😮": 0,
          "😢": 0,
          "👏": 0,
          "👎": 0,
          ...(post.reactions || {}),
        };
        // Work out the score change from this user's
        // previous reaction to their new reaction.
        let scoreDelta = 0;
        const nextUserReactions = { ...previousReactions };
        if (previousReaction === emoji) {
          // Clicking the same reaction again removes it.
          reactions[emoji] = Math.max(
            0,
            (Number(reactions[emoji]) || 0) - 1
          );
          scoreDelta = -(scoreMap[emoji] || 0);
          delete nextUserReactions[user.uid];
        } else {
          // Remove the previous reaction, if any.
          if (
            previousReaction &&
            Object.prototype.hasOwnProperty.call(
              scoreMap,
              previousReaction
            )
          ) {
            reactions[previousReaction] = Math.max(
              0,
              (Number(reactions[previousReaction]) || 0) - 1
            );
            scoreDelta -= scoreMap[previousReaction];
          }
          // Add the new reaction exactly once.
          reactions[emoji] =
            (Number(reactions[emoji]) || 0) + 1;
          scoreDelta += scoreMap[emoji];
          nextUserReactions[user.uid] = emoji;
        }
        const currentPostScore =
          Number(post.creatorScore) || 0;
        const nextPostScore =
          currentPostScore + scoreDelta;
        const creator = creatorSnap.data();
        const currentCreatorScore =
          Number(creator.creatorScore) || 0;
        const nextCreatorScore =
          currentCreatorScore + scoreDelta;
      result = await response.json();
    } catch {
      throw new Error(
        "The reaction service returned an invalid response."
      );
    }

        // Both writes commit together or neither commits.
        transaction.update(postRef, {
          reactions,
          creatorScore: nextPostScore,
          userReactions: nextUserReactions,
        });
    if (!response.ok) {
      throw new Error(
        result?.detail ||
          "Unable to save your reaction. Please try again."
      );
    }

        transaction.update(creatorRef, {
          creatorScore: nextCreatorScore,
        });
    if (
      result?.success !== true ||
      !result.reactions ||
      !result.userReactions
    ) {
      throw new Error(
        "The reaction service did not confirm the update."
      );
    }

        return {
          reactions,
          creatorScore: nextPostScore,
          userReactions: nextUserReactions,
        };
      });
      const updateReactionState = (previousPosts) =>
        previousPosts.map((currentPost) =>
          currentPost.id === postId
            ? {
                ...currentPost,
                reactions: result.reactions,
                creatorScore: result.creatorScore,
                userReactions: result.userReactions,
              }
            : currentPost
        );
    // Use the server's confirmed reaction data.
    const updateReactionState = (previousPosts) =>
      previousPosts.map((currentPost) =>
        currentPost.id === postId
          ? {
              ...currentPost,
              reactions: result.reactions,
              creatorScore:
                result.postCreatorScore ??
                currentPost.creatorScore ??
                0,
              userReactions: result.userReactions,
            }
          : currentPost
      );

      setPosts(updateReactionState);
      setFilteredPosts(updateReactionState);
    } catch (error) {
      console.error("Inclura Reaction Error:", error);
    setPosts(updateReactionState);
    setFilteredPosts(updateReactionState);
  } catch (error) {
    console.error(
      "Inclura Reaction Error:",
      error
    );

      alert(
        error?.message ||
          "Unable to save your reaction. Please try again."
      );
    }
    alert(
      error?.message ||
        "Unable to save your reaction. Please try again."
    );
  }
}

  async function translatePost(
    post
