import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { resolve } from "node:path";
import { nanoid } from "nanoid";

/**
 * @description: 获取vite输出目录
 * @return {*} {Promise<string>} 输出目录
 */
const getViteOutDir = async () => {
  try {
    const { resolveConfig } = await import("vite");
    const config = await resolveConfig({}, "build", "prod");
    return config.build.outDir;
  } catch {
    console.warn('Failed to read vite.config.ts, using default "dist"');
    return "dist";
  }
};

(async () => {
  execSync("tsc -b && vite build --mode prod -- --enable-update", {
    stdio: "inherit",
  });
  const outDir = await getViteOutDir();
  const buildInfo = { timestamp: Date.now(), buildId: nanoid() };
  const buildJsonPath = resolve(outDir, "manifest.json");
  writeFileSync(buildJsonPath, JSON.stringify(buildInfo, null, 2));
})();
