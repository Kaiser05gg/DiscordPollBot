import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateGraph = async (
  month: string
): Promise<{ status: string; file?: string; message?: string }> => {
  return new Promise((resolve) => {
    const projectRoot = path.resolve("/usr/src/app");
    const scriptPath = path.join(
      projectRoot,
      "src/analytics/interfaces/cli_entrypoint.py"
    );

    console.log("📊 Python実行パス:", scriptPath);

    const py = spawn("python3", [scriptPath, month], {
      cwd: projectRoot,
    });

    let stdoutData = "";
    let stderrData = "";

    py.stdout.on("data", (chunk) => (stdoutData += chunk));
    py.stderr.on("data", (chunk) => (stderrData += chunk));

    py.on("close", () => {
      if (stderrData) {
        const shortErr = stderrData.slice(0, 200);
        console.error("⚠️ Python stderr:", shortErr);
        return resolve({ status: "error", message: shortErr });
      }

      try {
        const result = JSON.parse(stdoutData);
        if (result.status === "success") {
          console.log("✅ Python グラフ生成成功:", result.file);
          resolve(result);
        } else {
          console.error("❌ Python 内部エラー:", result.message);
          resolve(result);
        }
      } catch {
        console.error("⚠️ JSON パース失敗:", stdoutData.slice(0, 200));
        resolve({ status: "error", message: "JSON parse error" });
      }
    });
  });
};
