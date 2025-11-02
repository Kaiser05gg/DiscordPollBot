import { spawn } from "child_process";
import path from "path";

export const runPythonScript = (month: string): Promise<any> => {
  const scriptPath = path.resolve("analytics/interfaces/cli_entrypoint.py");

  return new Promise((resolve, reject) => {
    const process = spawn("python3", [scriptPath, month]);
    let output = "";
    let errorOutput = "";

    process.stdout.on("data", (data) => (output += data.toString()));
    process.stderr.on("data", (err) => (errorOutput += err.toString()));

    process.on("close", () => {
      if (errorOutput) {
        console.error("❌ Pythonエラー:", errorOutput);
      }

      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (err) {
        reject(`JSON解析失敗: ${output}`);
      }
    });
  });
};
