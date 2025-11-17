import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  dest: "./dist",

  title: "JavaGuide(面试突击版)",
  description:
    "Java 学习&面试指南（Go、Python 后端面试通用,计算机基础面试总结）  ",
  lang: "zh-CN",

  head: [
    // meta
    ["meta", { name: "robots", content: "all" }],
    ["meta", { name: "author", content: "Guide" }],
    [
      "meta",
      {
        "http-equiv": "Cache-Control",
        content: "no-cache, no-store, must-revalidate",
      },
    ],
    ["meta", { "http-equiv": "Pragma", content: "no-cache" }],
    ["meta", { "http-equiv": "Expires", content: "0" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "Java,Go,Java面试,Java基础, 多线程, JVM, 虚拟机, 数据库, MySQL, Spring, Redis, MyBatis, 系统设计, 分布式, RPC, 高可用, 高并发",
      },
    ],
    [
      "meta",
      {
        name: "description",
        content:
          "「Java 突击面试指南」一份涵盖大部分 Java 程序员所需要掌握的核心知识。准备 Java 面试，首选 JavaGuide！",
      },
    ],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    // 添加百度统计
    [
      "script",
      {},
      `var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?e1bad04c60516dda715993552ed7ebb1";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();`,
    ],
  ],

  bundler: viteBundler(),

  theme,

  pagePatterns: ["**/*.md", "!**/*.snippet.md", "!.vuepress", "!node_modules"],

  shouldPrefetch: false,
  shouldPreload: false,
});
