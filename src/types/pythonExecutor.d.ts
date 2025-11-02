declare module "analytics/pythonExecutor.js" {
  export function generateGraph(month: string): Promise<{
    status: string;
    file?: string;
    message?: string;
  }>;
}
