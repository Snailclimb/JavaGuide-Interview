import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text: "项目介绍",
      icon: "star",
      collapsible: true,
      prefix: "javaguide/",
      children: ["faq"],
    },
    {
      text: "面试准备（必看）",
      icon: "interview",
      collapsible: true,
      prefix: "interview-preparation/",
      children: [
        "teach-you-how-to-prepare-for-the-interview-hand-in-hand",
        "resume-guide",
        "key-points-of-interview",
        "java-roadmap",
        "project-experience-guide",
        "how-to-handle-interview-nerves",
        "internship-experience",
      ],
    },
    {
      text: "Java",
      icon: "interview",
      collapsible: false,
      prefix: "java/",
      children: [
        "java-basis",
        "java-collection",
        "java-concurrent",
        "java-jvm",
      ],
    },
        {
      text: "计算机基础",
      icon: "interview",
      collapsible: false,
      prefix: "cs-basics/",
      children: [
        "network",
        "operating-system",
        "data-structure",
        "algorithms",
      ],
    },
    {
      text: "数据库和缓存",
      icon: "interview",
      collapsible: false,
      prefix: "database/",
      children: ["mysql", "redis"],
    },
    {
      text: "系统设计",
      icon: "interview",
      collapsible: false,
      prefix: "system-design/",
      children: ["design-pattern"],
    },
  ],
});
