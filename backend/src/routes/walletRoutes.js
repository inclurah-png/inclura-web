import express from "express";
import { firestore, auth } from "../config/firebaseAdmin.js";

const router = express.Router();

async function requireMember(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer (.+)$/i);
    if (!match) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const decoded = await auth().verifyIdToken(match[1]);
    req.user = decoded;
    return next();
  } catch (error) {
    console.error("Wallet authentication failed:", error);
    return res.status(401).json({ success: false, message: "Invalid authentication token." });
  }
}

router.get("/overview", requireMember, async (req, res) => {
  try {
    const uid = req.user.uid;
    const database = firestore();
    const walletRef = database.collection("walletAccounts").doc(uid);
    const walletSnap = await walletRef.get();

    if (!walletSnap.exists) {
      return res.status(200).json({
        success: true,
        wallet: {
          status: "not_initialized",
          currency: "NGN",
          availableBalance: null,
          pendingBalance: null,
          creatorEarnings: null,
          marketplaceEarnings: null,
          withdrawableBalance: null,
        },
      });
    }

    const wallet = walletSnap.data();
    return res.status(200).json({
      success: true,
      wallet: {
        status: wallet.status || "active",
        currency: wallet.currency || "NGN",
        availableBalance: Number.isFinite(Number(wallet.availableBalance))
          ? Number(wallet.availableBalance)
          : null,
        pendingBalance: Number.isFinite(Number(wallet.pendingBalance))
          ? Number(wallet.pendingBalance)
          : null,
        creatorEarnings: Number.isFinite(Number(wallet.creatorEarnings))
          ? Number(wallet.creatorEarnings)
          : null,
        marketplaceEarnings: Number.isFinite(Number(wallet.marketplaceEarnings))
          ? Number(wallet.marketplaceEarnings)
          : null,
        withdrawableBalance: Number.isFinite(Number(wallet.withdrawableBalance))
          ? Number(wallet.withdrawableBalance)
          : null,
        updatedAt: wallet.updatedAt || null,
      },
    });
  } catch (error) {
    console.error("Wallet overview failed:", error);
    return res.status(500).json({ success: false, message: "Wallet overview could not be loaded." });
  }
});

router.get("/transactions", requireMember, async (req, res) => {
  try {
    const uid = req.user.uid;
    const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100);
    const database = firestore();

    const snapshot = await database
      .collection("walletTransactions")
      .where("userId", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const transactions = snapshot.docs.map((transactionDoc) => {
      const data = transactionDoc.data();
      return {
        id: transactionDoc.id,
        type: data.type || "unknown",
        status: data.status || "unknown",
        currency: data.currency || "NGN",
        amount: Number(data.amount) || 0,
        reference: data.reference || null,
        description: data.description || "",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
      };
    });

    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Wallet transactions failed:", error);
    return res.status(500).json({ success: false, message: "Wallet transactions could not be loaded." });
  }
});

router.get("/status", requireMember, async (req, res) => {
  return res.status(200).json({
    success: true,
    architecture: "provider_settlement",
    clientBalanceWrites: false,
    serverLedger: true,
    marketplaceSettlement: "provider_required",
    status: "ready_for_payment-provider-integration",
  });
});

export default router;
