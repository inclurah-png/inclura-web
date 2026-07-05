import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

export async function updateScorecard(uid, activity) {
  const userRef = doc(db, "users", uid);

  switch (activity) {
    case "textPost":
      await updateDoc(userRef, {
        "scorecard.monthlyTextPosts": increment(1),
        "creatorEconomy.engagementScore": increment(2),
      });
      break;

    case "videoPost":
      await updateDoc(userRef, {
        "scorecard.monthlyVideoPosts": increment(1),
        "creatorEconomy.engagementScore": increment(4),
      });
      break;

    case "videoCrosspost":
      await updateDoc(userRef, {
        "scorecard.monthlyVideoCrossPosts": increment(1),
        "scorecard.monthlyCrossPosts": increment(1),
        "creatorEconomy.engagementScore": increment(5),
      });
      break;

    case "textCrosspost":
      await updateDoc(userRef, {
        "scorecard.monthlyTextCrossPosts": increment(1),
        "scorecard.monthlyCrossPosts": increment(1),
        "creatorEconomy.engagementScore": increment(5),
      });
      break;

    default:
      break;
  }
}
