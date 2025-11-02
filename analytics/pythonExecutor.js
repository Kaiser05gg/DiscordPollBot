import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Firestoreデータをもとに月次グラフをPythonで生成する
 * @param {string} month - 例: "2025-11"
 * @returns {Promise<{status: string, file?: string, message?: string}>}
 */
export const generateGraph = async (month) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      __dirname,
      "..",
      "interfaces",
      "cli_entrypoint.py"
    );

    const py = spawn("python3", [scriptPath, month], {
      cwd: __dirname,
    });

    let stdoutData = "";
    let stderrData = "";

    py.stdout.on("data", (chunk) => (stdoutData += chunk));
    py.stderr.on("data", (chunk) => (stderrData += chunk));

    py.on("close", (code) => {
      if (stderrData) {
        console.error("Python stderr:", stderrData);
        return resolve({ status: "error", message: stderrData });
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
      } catch (err) {
        console.error("⚠️ JSON パース失敗:", stdoutData);
        resolve({ status: "error", message: "JSON parse error" });
      }
    });
  });
};
