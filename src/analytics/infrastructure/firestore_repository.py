import os
from google.cloud import firestore
from google.oauth2 import service_account
from datetime import datetime
from ..domain.poll_result_model import PollResult

class FirestoreRepository:
    def __init__(self):
        # ✅ 3階層戻って DiscordPollBot直下へ
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
        key_path = os.path.join(project_root, "firebase-key.json")

        if not os.path.exists(key_path):
            raise FileNotFoundError(f"File not found: {key_path}")

        credentials = service_account.Credentials.from_service_account_file(key_path)
        self.db = firestore.Client(credentials=credentials, project=credentials.project_id)

    def get_monthly_results(self, target_month):
        results = []
        for doc in self.db.collection("poll_results").stream():
            data = doc.to_dict()
            voted_at = data.get("voted_at")

            if not voted_at:
                continue

            dt = voted_at if hasattr(voted_at, "strftime") else voted_at.to_datetime()

            if dt.strftime("%Y-%m") == target_month:
                results.append(PollResult(
                    data["question"],
                    data.get("results", {}),
                    dt
                ))
        return results
