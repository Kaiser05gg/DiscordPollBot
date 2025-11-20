import { pollResultRepository } from "../../infrastructure/firebase/pollResultRepository.js";

export const createPollDocumentUseCase = async ({
  message_id,
  question,
}: {
  message_id: string;
  question: string;
}) => {
  try {
    await pollResultRepository.createPollResult({
      messageId: message_id, // Firestoreの識別用
      question,
    });

    console.log("📦 Firestore 初期投票ドキュメントを作成しました");
  } catch (err) {
    console.error("❌ Firestore 初期ドキュメント作成エラー:", err);
  }
};
