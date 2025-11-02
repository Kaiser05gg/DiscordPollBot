import matplotlib.pyplot as plt

class GraphGenerator:
    def generate(self, aggregated_results, target_month):
        plt.figure(figsize=(8, 5))
        plt.bar(aggregated_results.keys(), aggregated_results.values(), color="skyblue")
        plt.title(f"{target_month} 投票結果")
        plt.xlabel("選択肢")
        plt.ylabel("得票数")
        plt.tight_layout()
        path = f"graph_{target_month}.png"
        plt.savefig(path)
        return path