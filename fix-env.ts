import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve("./src"); // ou le dossier contenant ton code frontend

// Fonction récursive pour parcourir les fichiers
function walkDir(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (stat.isFile() && fullPath.endsWith(".ts")) {
      callback(fullPath);
    }
  });
}

// Patch des fichiers : remplace process.env ou Deno.env par import.meta.env.VITE_...
walkDir(SRC_DIR, (filePath) => {
  let content = fs.readFileSync(filePath, "utf-8");

  let original = content;

  // Remplacer Deno.env.get("VAR") → import.meta.env.VITE_VAR
  content = content.replace(/Deno\.env\.get\(["']([\w_]+)["']\)/g, "import.meta.env.VITE_$1");

  // Remplacer process.env.VAR → import.meta.env.VITE_VAR
  content = content.replace(/process\.env\.([\w_]+)/g, "import.meta.env.VITE_$1");

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`Patched env references in: ${filePath}`);
  }
});

console.log("✅ Patch env variables terminé !");
