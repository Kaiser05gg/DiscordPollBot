import { runPythonScript } from "../../infrastructure/python/pythonExecutor.js";

export const generateGraphUseCase = async (month: string) => {
  console.log(`Pythonで ${month} の投票結果グラフ生成を実行...`);
  const result = await runPythonScript(month);
  return result;
};
