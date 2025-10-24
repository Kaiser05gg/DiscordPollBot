import express from "express";

export function startExpressServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.get("/", (_req, res) => {
    res.send("Express is running!");
  });

  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
}

