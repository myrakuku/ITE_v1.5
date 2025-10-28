// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;


// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 自訂規則：忽略 _ 開頭變數 + 禁用 any
  {
    rules: {
      // 忽略 _error, _unused 等變數
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",     // 忽略變數
          argsIgnorePattern: "^_",     // 忽略參數（如 catch(_error)）
          ignoreRestSiblings: true,
        },
      ],
      // 禁止 any（可選）
      "@typescript-eslint/no-explicit-any": "off", // 如果您允許 any，可關閉
    },
  },
];

export default eslintConfig;