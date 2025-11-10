import { spawn } from "child_process";
import fs from "fs";
import path from "path";

// src/analytics にある venv を検出
const venvPath = path.join("/usr/src/app", "src/analytics/venv/bin/python");

// venv が存在すればそれを使う、なければグローバル python3
const pythonExec = fs.existsSync(venvPath) ? venvPath : "python3";

export const runPythonScript = async (
  month: string
): Promise<{ status: string; file?: string; message?: string }> => {
  return new Promise((resolve) => {
    const projectRoot = "/usr/src/app";

    const scriptPath = path.join(
      projectRoot,
      "src/analytics/interfaces/cli_entrypoint.py"
    );

    console.log("📊 実行パス:", scriptPath);
    console.log("🐍 使用Python:", pythonExec);

    const py = spawn(pythonExec, [scriptPath, month], {
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
        const match = stdoutData.match(/\{[\s\S]*\}$/m);
        if (!match) throw new Error("No JSON found in Python output");

        const result = JSON.parse(match[0]);
        if (result.status === "success") {
          console.log("✅ Python グラフ生成成功:", result.file);
          resolve(result);
        } else {
          console.error("❌ Python 内部エラー:", result.message);
          resolve(result);
        }
      } catch (err) {
        console.error("⚠️ JSON パース失敗:", stdoutData.slice(-200));
        resolve({ status: "error", message: String(err) });
      }
    });

    py.on("error", (err) => {
      console.error("💥 Python spawn エラー:", err);
      resolve({ status: "error", message: err.message });
    });
  });
};
