import matplotlib.pyplot as plt
import os

class GraphGenerator:
    def generate(self, aggregated_results, target_month):
        if not aggregated_results or sum(aggregated_results.values()) == 0:
            print(f"⚠️ No data found for {target_month}")
            raise ValueError(f"No poll data found for {target_month}")
        # Firestoreの日本語ラベルを英語に変換
        label_map = {
            "〜8時": "8AM",
            "8〜9": "8-9AM",
            "9時": "9AM",
            "10時半〜": "10:30AM-",
            "時間未定": "TBD",
            "不参加": "Absent",
        }

        # 日本語 → 英語へ置き換え
        converted_results = {}
        for jp_label, count in aggregated_results.items():
            en_label = label_map.get(jp_label, jp_label)
            converted_results[en_label] = count

        # 描画順序
        fixed_order = ["8AM", "8-9AM", "9AM", "10:30AM-", "TBD", "Absent"]
        ordered_keys = [k for k in fixed_order if k in converted_results]
        ordered_values = [converted_results.get(k, 0) for k in ordered_keys]

        # 出力パス
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
        output_dir = os.path.join(project_root, "analytics", "output")
        os.makedirs(output_dir, exist_ok=True)
        path = os.path.join(output_dir, f"graph_{target_month}.png")

        # グラフ描画（英語フォントのみ使用 → フォントエラー消失）
        plt.figure(figsize=(8, 5))
        plt.bar(ordered_keys, ordered_values, color="skyblue")
        plt.title(f"{target_month} Poll Results")
        plt.xlabel("Options")
        plt.ylabel("Votes")
        plt.tight_layout()
        plt.savefig(path)
        plt.close()

        print(f"✅ English-only graph generated: {path}")
        return path
