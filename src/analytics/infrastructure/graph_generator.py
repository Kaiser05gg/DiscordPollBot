import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import os

class GraphGenerator:
    def generate(self, aggregated_results, target_month):
        # ✅ 日本語フォント設定（macOS / Linux 両対応）
        font_path = "/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc"
        if os.path.exists(font_path):
            plt.rcParams["font.family"] = fm.FontProperties(fname=font_path).get_name()
        else:
            plt.rcParams["font.family"] = "Noto Sans CJK JP"

        # ✅ 出力先を「プロジェクト直下/analytics/output」に固定
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
        output_dir = os.path.join(project_root, "analytics", "output")
        os.makedirs(output_dir, exist_ok=True)

        path = os.path.join(output_dir, f"graph_{target_month}.png")

        # ✅ グラフ描画
        plt.figure(figsize=(8, 5))
        plt.bar(aggregated_results.keys(), aggregated_results.values(), color="skyblue")
        plt.title(f"{target_month} の投票結果")
        plt.xlabel("選択肢")
        plt.ylabel("得票数")
        plt.tight_layout()
        plt.savefig(path)
        plt.close()

        return path
