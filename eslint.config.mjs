// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 繼承 Next.js 官方推薦設定
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 自訂規則：忽略以 _ 開頭的變數與參數，並選擇性禁用 any
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",      // 忽略變數名稱以 _ 開頭
          argsIgnorePattern: "^_",      // 忽略函式參數以 _ 開頭（如 catch(_error)）
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "off", // 若允許 any，請保持關閉
    },
  },

  // 全局忽略設定
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;