---
title: 2025阿里淘天一面面经
description: 2025年阿里淘天一面真实面经分享：涵盖阿里招聘流程、面试技巧、技术八股文如GET/POST区别、反射应用、SQL优化等高频面试题，以及在线编程考核内容，助你备战阿里面试。
category: 真实面经
tag:
  - 阿里
  - 淘天
  - 大厂面经
head:
  - - meta
    - name: keywords
      content: 阿里面经,淘天面经,2025面经,阿里面试,大厂面经,Java面经,后端面经,阿里技术面试,GET POST区别,反射,SQL优化
---

过去两年，阿里的招聘策略正在悄悄发生结构性变化。

一方面，阿里整体调整组织架构，形成淘天、阿里云、夸克等多个相对独立的业务方向；另一方面，不少应届生明显感受到：**阿里开始“卡学历”了。**

从我这段时间收到的反馈来看——

- 淘天、高德、蚂蚁、阿里云等核心业务线 **对双非学历的过滤明显增强**，进入难度比前几年高很多；
- 社招相对宽松，但学历同样会影响初筛通过率；
- 部门之间的招聘标准差异极大： **有的部门卡得很严，有的部门依旧相对友好。**

还有一个投递小技巧：阿里不同部门之间的投递 **是可以分开算的**。 同学们别傻傻只投一个 JD，被拒了连第二次机会都没有。

至于面试流程，阿里整体依然保持“技术主导”，一般是：

- 两轮或三轮技术面（极少出现四轮）
- 技术通过后才会约 HR 面
- HR 面依旧“玄学”，也需要重视

**千万不要以为：技术面过了 = 稳了。**

这是一位来自四川大学的同学分享的 **阿里淘天一面** 面经。从整体感受来看，这次面试偏轻松，面试官提问比较随意（有点像是 KPI 面试），主要分为三个部分：

1. 非技术类问题（自我介绍、实习经历等）
2. 小型笔试题（在线编程，不是 LeetCode 偏难题）
3. 基础技术八股（如 GET/POST 区别、反射应用场景、SQL 优化等）

面试时长约 **一个半小时**。整体难度比较简单，最让我意外的事竟然考察了三道笔试题，不是那种纯粹的 LeetCode 问题，偏向于考察对 Java 语言的掌握，挺简单的！

![](https://static001.geekbang.org/infoq/6a/6a07333e392e0b710fb5bf2b3ae28652.png)

> 这篇是24届同学的面经，当时分享过，但笔试题的答案需要重新完善一下。根据我的观察来看，阿里的面试一般不会考察这么多笔试题，所以说有点像是 KPI 面试。

## 非技术问题

### 自我介绍

面试时的自我介绍，其实是你给面试官的“第一印象浓缩版”。它不需要面面俱到，但要精准、自信地展现你的核心价值和与岗位的匹配度。通常控制在 1-2 分钟内比较合适。一个好的自我介绍应该包含这几点要素：

1. 用简单的话说清楚自己主要的技术栈于擅长的领域，例如 Java 后端开发、分布式系统开发；
2. 把重点放在自己的优势上，重点突出自己的能力，最好能用一个简短的例子支撑，例如：我比较擅长定位和解决复杂问题。在[某项目/实习]中，我曾通过[简述方法，如日志分析、源码追踪、压力测试]成功解决了[某个具体问题，如一个棘手的性能瓶颈/一个偶现的 Bug]，将[某个指标]提升了[百分比/具体数值]。
3. 简要提及 1-2 个最能体现你能力和与岗位要求匹配的项目经历、实习经历或竞赛成绩。不需要展开细节，目的是引出面试官后续的提问。
4. 如果时间允许，可以非常简短地表达对所申请岗位的兴趣和对公司的向往，表明你是有备而来。

### 讲一下实习经历以及遇到的难点

实习经历的描述一定要避免空谈，尽量列举出你在实习期间取得的成就和具体贡献，使用具体的数据和指标来量化你的工作成果。

示例（这里假设项目细节放在实习经历这里介绍，你也可以选择将实习经历参与的项目放到项目经历中）：

1. 参与项目订单模块的开发，负责订单创建、删除、查询等功能。
2. 排查并解决扣费模块由于扣费父任务和反作弊子任务使用同一个线程池导致的死锁问题。
3. 使用 CompletableFuture 并行加载后台用户统计模块的数据信息，平均相应时间从 3.5s 降低到 1s。
4. 使用 Redis+Caffeine 多级缓存优化热门数据（如首页、热门商品）的访问，解决了缓存击穿和穿透问题，查询速度毫秒级，QPS 30w+。
5. 在实习期间，共完成了 10 个需求开发和 5 个问题修复，编写了 2000 行代码和 100 个测试用例，通过了代码评审和测试验收，上线运行稳定无故障。

关于实习经历这块再多提一点。很多同学实习期间可能接触不到什么实际的开发任务，大部分时间可能都是在熟悉和维护项目。对于这种情况，你可以适当润色这段实习经历，找一些简单的功能研究透，包装成自己做的，很多同学都是这么做的。不过，我更建议你在实习期间主动去承担一些开发任务，甚至说对原系统进行优化改造。常见的性能优化方向实践（涉及到多线程、JVM、数据库/缓存、数据结构优化这 4 个常见的性能优化方向）总结请看：https://t.zsxq.com/0c1uS7q2Y （这块内容分享在 [知识星球](https://javaguide.cn/about-the-author/zhishixingqiu-two-years.html) 里了，你也可以自己按照我的思路总结，效果是一样的）。

![](https://mmbiz.qpic.cn/mmbiz_png/iaIdQfEric9TxXGicjSaF6UyjV4csrgaupfKjoAicvzudEdsneGxSVXKpZWHJ89sEcABibf318JJb1qyhu8joLibzicAg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

### 说一下自己以后的发展发向

> [工作五年之后，对技术和业务的思考](https://javaguide.cn/high-quality-technical-articles/advanced-programmer/thinking-about-technology-and-business-after-five-years-of-work.html) 这篇文章是我在两年前看到的一篇对我触动比较深的文章，介绍了作者工作五年之后，对于技术和业务的深度思考。

建议：

- 如果你的想法是干个两三年就跳槽或者换行业的话，尽量不要直说，一定要体现出自己的稳定性。
- 绝大部分人的职业目标都可以从技术精进、项目管理和个人影响力三个方面来回答。

参考回答：

在接下来的五年里，我的职业目标主要集中在技术精进、项目管理和个人影响力三个方面。

首先，技术上，我会深入专研 Java 后端开发，争取早日成为 Java 后端开发领域的技术专家。为此，我将不断深入学习 Java 的核心技术和最新技术进展。

其次，项目管理上，我会慢慢尝试着在工作中承担更多的项目管理职责，积累项目管理经验，争取早日能够拥有独立带领中小型项目的能力。

最后，个人影响力上，我希望通过我的专业技能对公司的核心产品做出重大贡献，解决技术难题，提升产品性能和用户体验。同时，我也计划积极参与贡献开源项目和技术社区。

## 笔试题

笔试的形式是给你的邮箱发个链接，点进去就是一个在线的编辑器。

### 写三种单例模式的实现方式

**1、枚举（推荐）**:

```java
public enum Singleton {
    INSTANCE;
    public void doSomething(String str) {
        System.out.println(str);
    }
}
```

《Effective Java》作者推荐的一种单例实现方式，简单高效，无需加锁，线程安全，可以避免通过反射破坏枚举单例。

**2、静态内部类（推荐）**：

```java
public class Singleton {
    // 私有化构造方法
    private Singleton() {
    }

    // 对外提供获取实例的公共方法
    public static Singleton getInstance() {
        return SingletonInner.INSTANCE;
    }

    // 定义静态内部类
    private static class SingletonInner{
        private final static Singleton INSTANCE = new Singleton();
    }

}
```

当外部类 `Singleton` 被加载的时候，并不会创建静态内部类 `SingletonInner` 的实例对象。只有当调用 `getInstance()` 方法时，`SingletonInner` 才会被加载，这个时候才会创建单例对象 `INSTANCE`。`INSTANCE` 的唯一性、创建过程的线程安全性，都由 JVM 来保证。

这种方式同样简单高效，无需加锁，线程安全，并且支持延时加载。

**3、双重校验锁**：

```java
public class Singleton {

    private volatile static Singleton uniqueInstance;

    // 私有化构造方法
    private Singleton() {
    }

    public  static Singleton getUniqueInstance() {
       //先判断对象是否已经实例过，没有实例化过才进入加锁代码
        if (uniqueInstance == null) {
            //类对象加锁
            synchronized (Singleton.class) {
                if (uniqueInstance == null) {
                    uniqueInstance = new Singleton();
                }
            }
        }
        return uniqueInstance;
    }
}
```

`uniqueInstance` 采用 `volatile` 关键字修饰也是很有必要的， `uniqueInstance = new Singleton();` 这段代码其实是分为三步执行：

1. 为 `uniqueInstance` 分配内存空间
2. 初始化 `uniqueInstance`
3. 将 `uniqueInstance` 指向分配的内存地址

但是由于 JVM 具有指令重排的特性，执行顺序有可能变成 1->3->2。指令重排在单线程环境下不会出现问题，但是在多线程环境下会导致一个线程获得还没有初始化的实例。例如，线程 T1 执行了 1 和 3，此时 T2 调用 `getUniqueInstance`() 后发现 `uniqueInstance` 不为空，因此返回 `uniqueInstance`，但此时 `uniqueInstance` 还未被初始化。

这种方式实现起来较麻烦，但同样线程安全，支持延时加载。

推荐阅读：[Java 并发常见面试题总结（中）](https://javaguide.cn/java/concurrent/java-concurrent-questions-02.html)。

### 编号为 1-n 的循环报 1-3，报道 3 的出列，求最后一人的编号

问题描述：编号为 1-n 的循环报 1-3，报道 3 的出列，求最后一人的编号

标准的约瑟夫环问题。有 n 个人围成一个圈，从某个人开始报数，报到某个特定数字（本题中为 3 ）时该人出圈，直到只剩下一个人为止。

解决约瑟夫环问题，可以分两种情况：

1. 我们要求出最后留下的那个人的编号（本题要求）。
2. 求全过程，即要算出每轮出局的人。

有多种方法可以解决约瑟夫环问题，其中一种是使用递归的方式。

本题的约瑟夫环问题的公式为： **(f(n - 1, k) + k - 1) % n + 1** 。f(n,k) 表示 n 个人报数，每次报数报到 k 的人出局，最终最后一个人的编号。

假设 n 为 10，k 为 3 ，逆推过程如下：

- f(1, 3) = 1（当 n = 1 时，只有一个人，最后一人的编号就为 1）；
- f(2,3) =（f(1,3) + 3 -1）%2 + 1 = 3%2 + 1 = 2（当 n = 2 时，最后一人的编号为 2）；
- f(3,3) = (f(2,3) + 3 - 1))%3 + 1 = 4%3 + 1 = 2（当 n = 3 时，最后一人的编号为 2）；
- f(4,3) = (f(3,3) + 3 - 1) % 4 + 1 = 4%4 + 1 = 1（当 n = 4 时，最后一人的编号为 1）；
- ...
- f(10,3) = 3 （当 n = 10 时，最后一人的编号为 4）；

这个问题对应[剑指 Offer 62. 圆圈中最后剩下的数字](https://leetcode.cn/problems/yuan-quan-zhong-zui-hou-sheng-xia-de-shu-zi-lcof/) ，两者意思是类似的，比较简单。

```java
public class Josephus {

    // 定义递归函数
    public static int f(int n, int k) {
        // 如果只有一个人，则返回 1
        if (n == 1) {
            return 1;
        }
        return (f(n - 1, k) + k - 1) % n + 1;
    }

    public static void main(String[] args) {
        int n = 10;
        int k = 3;
        System.out.println("最后留下的那个人的编号是：" + f(n, k));
    }
}
```

输出：

```plain
最后留下的那个人的编号是：4
```

### 写两个线程打印 1-n，一个线程打印奇数，一个线程打印偶数

问题描述：写两个线程打印 1-100，一个线程打印奇数，一个线程打印偶数。

这道题的实现方式还是挺多的，线程的等待/通知机制（`wait()`和`notify()`）、信号量 `Semaphore`等都可以实现。

#### synchronized+wait/notify 实现

我们先定义一个类 `ParityPrinter` 用于打印奇数和偶数。

```java
public class ParityPrinter {
    private final int max;
    // 从1开始计数
    private int count = 1;
    private final Object lock = new Object();

    public ParityPrinter(int max) {
        this.max = max;
    }

    public void printOdd() {
        print(true);
    }

    public void printEven() {
        print(false);
    }

    private void print(boolean isOdd) {
        for (int i = 1; i <= max; i += 2) {
            // 确保同一时间只有一个线程可以执行内部代码块
            synchronized (lock) {
                // 等待直到轮到当前线程打印
                // count为奇数时奇数线程打印，count为偶数时偶数线程打印
                while (isOdd == (count % 2 == 0)) {
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return;
                    }
                }
                System.out.println(Thread.currentThread().getName() + " : " + count++);
                // 通知等待的线程
                lock.notify();
            }
        }
    }
}
```

`ParityPrinter`类中的变量和方法介绍：

- `max`: 最大打印数值，由构造函数传入。
- `count`: 从 1 开始的计数器，用于追踪当前打印到的数字。
- `lock`: 一个对象锁，用于线程间的同步控制。
- `printOdd()`和`printEven()`: 分别启动打印奇数和偶数的逻辑，实际上调用了私有的`print()`方法，并传入线程名称前缀和一个布尔值表示打印奇数(`true`)还是偶数(`false`)。

接着，我们创建两个线程，一个负责打印奇数，一个负责打印偶数。

```java
  // 打印 1-100
  ParityPrinter printer = new ParityPrinter(100);
  // 创建打印奇数和偶数的线程
  Thread t1 = new Thread(printer::printOdd, "Odd");
  Thread t2 = new Thread(printer::printEven, "Even");
  t1.start();
  t2.start();
```

输出：

```plain
Odd : 1
Even : 2
Odd : 3
Even : 4
Odd : 5
...
Odd : 95
Even : 96
Odd : 97
Even : 98
Odd : 99
Even : 100
```

#### Semaphore 实现

如果想要把上面的代码修改为基于 `Semaphore`实现也挺简单的。

```java
public class ParityPrinter {
    private final int max;
    private int count = 1;
					// 初始为1，奇数线程先获取
    private final Semaphore oddSemaphore = new Semaphore(1);
    // 初始为0，偶数线程等待
    private final Semaphore evenSemaphore = new Semaphore(0);

    public ParityPrinter(int max) {
        this.max = max;
    }

    public void printOdd() {
        print(oddSemaphore, evenSemaphore);
    }

    public void printEven() {
        print(evenSemaphore, oddSemaphore);
    }

    private void print(Semaphore currentSemaphore, Semaphore nextSemaphore) {
        for (int i = 1; i <= max; i += 2) {
            try {
                // 获取当前信号量
                currentSemaphore.acquire();
                System.out.println(Thread.currentThread().getName() + " : " + count++);
                // 释放下一个信号量
                nextSemaphore.release();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
    }
}
```

可以看到，我们这里使用两个信号量 `oddSemaphore` 和 `evenSemaphore` 来确保两个线程交替执行。`oddSemaphore` 信号量先获取，也就是先执行奇数输出。一个线程执行完之后，就释放下一个信号量。

## 技术问题

### GET 和 POST 的区别

这个问题在知乎上被讨论的挺火热的，地址：<https://www.zhihu.com/question/28586791> 。

![](https://static001.geekbang.org/infoq/04/0454a5fff1437c32754f1dfcc3881148.png)

GET 和 POST 是 HTTP 协议中两种常用的请求方法，它们在不同的场景和目的下有不同的特点和用法。一般来说，可以从以下几个方面来区分它们（重点搞清两者在语义上的区别即可）：

- 语义（主要区别）：GET 通常用于获取或查询资源，而 POST 通常用于创建或修改资源。
- 幂等：GET 请求是幂等的，即多次重复执行不会改变资源的状态，而 POST 请求是不幂等的，即每次执行可能会产生不同的结果或影响资源的状态。
- 格式：GET 请求的参数通常放在 URL 中，形成查询字符串（querystring），而 POST 请求的参数通常放在请求体（body）中，可以有多种编码格式，如 application/x-www-form-urlencoded、multipart/form-data、application/json 等。GET 请求的 URL 长度受到浏览器和服务器的限制，而 POST 请求的 body 大小则没有明确的限制。不过，实际上 GET 请求也可以用 body 传输数据，只是并不推荐这样做，因为这样可能会导致一些兼容性或者语义上的问题。
- 缓存：由于 GET 请求是幂等的，它可以被浏览器或其他中间节点（如代理、网关）缓存起来，以提高性能和效率。而 POST 请求则不适合被缓存，因为它可能有副作用，每次执行可能需要实时的响应。
- 安全性：GET 请求和 POST 请求如果使用 HTTP 协议的话，那都不安全，因为 HTTP 协议本身是明文传输的，必须使用 HTTPS 协议来加密传输数据。另外，GET 请求相比 POST 请求更容易泄露敏感数据，因为 GET 请求的参数通常放在 URL 中。

再次提示，重点搞清两者在语义上的区别即可，实际使用过程中，也是通过语义来区分使用 GET 还是 POST。不过，也有一些项目所有的请求都用 POST，这个并不是固定的，项目组达成共识即可。

### 如何优化 MySQL 查询

回答这个问题的核心是先提到开启慢查询日志和使用 EXPLAIN 进行执行计划分析。

慢查询日志捕获那些执行时间超过阈值的SQL语句，这是发现问题的起点。拿到慢SQL后，用 `EXPLAIN` 关键字分析这条SQL的执行计划，分析原因。

基于 `EXPLAIN` 的分析结果，进行针对性优化。比较常见的 SQL优化手段如下：

1. 索引优化（最常用）
2. 避免 `SELECT *`
3. 深度分页优化
4. 尽量避免多表做 join
5. 选择合适的字段类型
6. ......

[《Java 面试指北》](https://mp.weixin.qq.com/s/JNJIKnUMc0MU_i2VNXb50A)的技术面试题篇总结了常见的高并发面试问题，其中包含常见的 SQL 优化手段，内容非常全面。

![img](https://oss.javaguide.cn/javamianshizhibei/sql-optimization.png)

推荐顺带看看下面这两篇文章：

- [MySQL 高性能优化规范建议总结](https://javaguide.cn/database/mysql/mysql-high-performance-optimization-specification-recommendations.html)
- [MySQL 执行计划分析](https://javaguide.cn/database/mysql/mysql-query-execution-plan.html)

### 反射及应用场景

简单来说，Java 反射 (Reflection) 是一种**在程序运行时，动态地获取类的信息并操作类或对象（方法、属性）的能力**。

通常情况下，我们写的代码在编译时类型就已经确定了，要调用哪个方法、访问哪个字段都是明确的。但反射允许我们在**运行时**才去探知一个类有哪些方法、哪些属性、它的构造函数是怎样的，甚至可以动态地创建对象、调用方法或修改属性，哪怕这些方法或属性是私有的。

正是这种在运行时“反观自身”并进行操作的能力，使得反射成为许多**通用框架和库的基石**。它让代码更加灵活，能够处理在编译时未知的类型。

我们平时写业务代码可能很少直接跟 Java 的反射（Reflection）打交道。但你可能没意识到，你天天都在享受反射带来的便利！**很多流行的框架，比如 Spring/Spring Boot、MyBatis 等，底层都大量运用了反射机制**，这才让它们能够那么灵活和强大。

下面简单列举几个最场景的场景帮助大家理解。

**1.依赖注入与控制反转（IoC）**

以 Spring/Spring Boot 为代表的 IoC 框架，会在启动时扫描带有特定注解（如 `@Component`, `@Service`, `@Repository`, `@Controller`）的类，利用反射实例化对象（Bean），并通过反射注入依赖（如 `@Autowired`、构造器注入等）。

**2.注解处理**

注解本身只是个“标记”，得有人去读这个标记才知道要做什么。反射就是那个“读取器”。框架通过反射检查类、方法、字段上有没有特定的注解，然后根据注解信息执行相应的逻辑。比如，看到 `@Value`，就用反射读取注解内容，去配置文件找对应的值，再用反射把值设置给字段。

**3.动态代理与 AOP**

想在调用某个方法前后自动加点料（比如打日志、开事务、做权限检查）？AOP（面向切面编程）就是干这个的，而动态代理是实现 AOP 的常用手段。JDK 自带的动态代理（Proxy 和 InvocationHandler）就离不开反射。代理对象在内部调用真实对象的方法时，就是通过反射的 `Method.invoke` 来完成的。

```java
public class DebugInvocationHandler implements InvocationHandler {
    private final Object target; // 真实对象

    public DebugInvocationHandler(Object target) { this.target = target; }

    // proxy: 代理对象, method: 被调用的方法, args: 方法参数
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("切面逻辑：调用方法 " + method.getName() + " 之前");
        // 通过反射调用真实对象的同名方法
        Object result = method.invoke(target, args);
        System.out.println("切面逻辑：调用方法 " + method.getName() + " 之后");
        return result;
    }
}
```

**4.对象关系映射（ORM）**

像 MyBatis、Hibernate 这种框架，能帮你把数据库查出来的一行行数据，自动变成一个个 Java 对象。它是怎么知道数据库字段对应哪个 Java 属性的？还是靠反射。它通过反射获取 Java 类的属性列表，然后把查询结果按名字或配置对应起来，再用反射调用 setter 或直接修改字段值。反过来，保存对象到数据库时，也是用反射读取属性值来拼 SQL。