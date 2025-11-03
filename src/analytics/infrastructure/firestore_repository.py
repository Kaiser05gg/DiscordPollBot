from google.cloud import firestore
from datetime import datetime
from ..domain.poll_result_model import PollResult

class FirestoreRepository:
    def __init__(self):
        self.db = firestore.Client()

    def get_monthly_results(self, target_month):
        results = []
        for doc in self.db.collection("poll_results").stream():
            data = doc.to_dict()
            voted_at = data.get("voted_at")
            if not voted_at:
                continue
            if voted_at.strftime("%Y-%m") == target_month:
                results.append(PollResult(
                    data["question"],
                    data.get("results", {}),
                    voted_at
                ))
        return results