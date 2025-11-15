import { db } from "../infrastructure/firebase/firebase.js";

// (async () => {
//   const docRef = db.collection("test").doc("firstDoc");
//   await docRef.set({
//     message: "Firestore接続テスト成功！",
//     timestamp: new Date(),
//   });
//   console.log("✅ Firestoreに書き込み成功！");
// })();

(async () => {
  try {
    await db
      .collection("poll_results")
      .doc("テスト")
      .collection("poll")
      .doc("latest")
      .set({ ok: true, at: new Date() });

    console.log("✔ Firestore 書き込みテスト成功");
  } catch (e) {
    console.error("❌ Firestore エラー:", e);
  }
})();
