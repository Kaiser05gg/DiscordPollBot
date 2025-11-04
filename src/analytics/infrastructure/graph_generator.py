import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import os

class GraphGenerator:
    def generate(self, aggregated_results, target_month):
        #macとDocker両対応のフォント探索パスを設定
        possible_fonts = [
            "/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc",  # macOS用
            "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",  # Debian(bookworm)用
            "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        ]

        font_path = next((p for p in possible_fonts if os.path.exists(p)), None)

        if font_path:
            fm.fontManager.addfont(font_path)
            plt.rcParams["font.family"] = fm.FontProperties(fname=font_path).get_name()
            print(f"✅ 使用フォント: {font_path}")
        else:
            print("⚠️ 日本語フォントが見つかりません。英字フォントで出力します。")

        #出力先ディレクトリ設定
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
        output_dir = os.path.join(project_root, "analytics", "output")
        os.makedirs(output_dir, exist_ok=True)

        path = os.path.join(output_dir, f"graph_{target_month}.png")

        #グラフデータ整形
        fixed_order = ["〜8時", "8〜9", "9時", "10時半〜", "不参加"]
        ordered_keys = [k for k in fixed_order if k in aggregated_results]
        ordered_values = [aggregated_results.get(k, 0) for k in ordered_keys]

        #グラフ描画
        plt.figure(figsize=(8, 5))
        plt.bar(ordered_keys, ordered_values, color="skyblue")
        plt.title(f"{target_month} の投票結果")
        plt.xlabel("選択肢")
        plt.ylabel("得票数")
        plt.tight_layout()
        plt.savefig(path)
        plt.close()

        return path