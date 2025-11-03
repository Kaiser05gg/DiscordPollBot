import sys
import json
from ..usecases.generate_monthly_report import generate_monthly_report

if __name__ == "__main__":
    target_month = sys.argv[1] if len(sys.argv) > 1 else "2025-11"
    try:
        path = generate_monthly_report(target_month)
        print(json.dumps({
            "status": "success",
            "file": path
        }))
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "message": str(e)
        }))
