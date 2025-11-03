import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), "../../"))
from analytics.infrastructure.firestore_repository import FirestoreRepository
from analytics.infrastructure.graph_generator import GraphGenerator


def generate_monthly_report(target_month):
    repo = FirestoreRepository()
    generator = GraphGenerator()

    all_results = repo.get_monthly_results(target_month)

    aggregated = {}
    for poll in all_results:
        for opt, val in poll.results.items():
            aggregated[opt] = aggregated.get(opt, 0) + val

    file_path = generator.generate(aggregated, target_month)
    return file_path