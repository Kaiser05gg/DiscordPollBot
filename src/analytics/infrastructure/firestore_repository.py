import os
from google.cloud import firestore
from google.oauth2 import service_account
from datetime import datetime
from ..domain.poll_result_model import PollResult

class FirestoreRepository:
    def __init__(self):
        project_root = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../../../")
        )
        key_path = os.path.join(project_root, "firebase-key.json")

        if not os.path.exists(key_path):
            raise FileNotFoundError(f"❌ Firebase認証キーが見つかりません: {key_path}")

        credentials = service_account.Credentials.from_service_account_file(key_path)
        self.db = firestore.Client(
            credentials=credentials, project=credentials.project_id
        )

    def get_monthly_results(self, target_month):
        """指定月のpoll_resultsをFirestoreから取得"""
        results = []
        for doc in self.db.collection("poll_results").stream():
            data = doc.to_dict()
            voted_at = data.get("voted_at")

            if not voted_at:
                continue

            if hasattr(voted_at, "strftime"):
                dt = voted_at
            else:
                dt = voted_at.to_datetime()

            if dt.strftime("%Y-%m") == target_month:
                results.append(
                    PollResult(
                        data.get("question", "不明な質問"),
                        data.get("results", {}),
                        dt,
                    )
                )

        return results
