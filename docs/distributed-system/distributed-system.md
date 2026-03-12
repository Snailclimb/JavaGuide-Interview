---
title: 分布式系统常见面试题总结
category: 分布式
description: 分布式系统常见面试题总结：涵盖CAP/BASE理论、分布式锁、分布式ID、分布式事务、配置中心、API网关、RPC框架、ZooKeeper、分布式算法（Paxos/Raft/ZAB/Gossip）等核心知识点。
tag:
  - 分布式
head:
  - - meta
    - name: keywords
      content: 分布式系统,CAP定理,BASE理论,分布式锁,分布式ID,分布式事务,配置中心,API网关,RPC,Dubbo,ZooKeeper,Paxos,Raft,ZAB,Gossip,分布式面试题

---

<!-- @include: @small-advertisement.snippet.md -->

这部分内容摘自 [JavaGuide](https://javaguide.cn/) 下面几篇文章的重点：

分布式理论&算法&协议：

- [CAP 理论和 BASE 理论解读](https://javaguide.cn/distributed-system/protocol/cap-and-base-theorem.html)
- [Paxos 算法解读](https://javaguide.cn/distributed-system/protocol/paxos-algorithm.html)
- [Raft 算法解读](https://javaguide.cn/distributed-system/protocol/raft-algorithm.html)
- [ZAB 协议详解](https://javaguide.cn/distributed-system/protocol/zab.html) 
- [Gossip 协议详解](https://javaguide.cn/distributed-system/protocol/gossip-protocol.html)
- [一致性哈希算法详解](https://javaguide.cn/distributed-system/protocol/consistent-hashing.html)

RPC：

- [RPC 基础常见面试题总结](https://javaguide.cn/distributed-system/rpc/rpc-intro.html)
- [Dubbo 常见面试题总结](https://javaguide.cn/distributed-system/rpc/dubbo.html)

分布式 ID：

- [分布式ID介绍&实现方案总结](https://javaguide.cn/distributed-system/distributed-id.html)
- [分布式 ID 设计指南](https://javaguide.cn/distributed-system/distributed-id-design.html)

API网关：

- [API 网关基础知识总结](https://javaguide.cn/distributed-system/api-gateway.html)
- [Spring Cloud Gateway 常见问题总结](https://javaguide.cn/distributed-system/spring-cloud-gateway-questions.html)

分布式锁：

- [分布式锁介绍](https://javaguide.cn/distributed-system/distributed-lock.html)
- [分布式锁常见实现方案总结](https://javaguide.cn/distributed-system/distributed-lock-implementations.html)

## 分布式基础理论

### ⭐️什么是 CAP 定理？

CAP 定理讨论 Consistency（一致性）、Availability（可用性）和 Partition Tolerance（分区容错）。

> **重要说明**：下文使用「偏 CP / 偏 AP」仅作直觉描述。严格按 CAP 定义（C=Linearizability，A=每个非故障节点都必须响应）时，许多系统并不能被干净归类——同一系统内不同操作的一致性/可用性特征不同，很多系统既不满足 CAP-C 也不满足 CAP-A。

![](https://oss.javaguide.cn/2020-11/cap.png)

CAP 理论的提出者布鲁尔在提出 CAP 猜想的时候，并没有对 **Consistency**、**Availability**、**Partition Tolerance** 给出严格定义。

因此，对于 CAP 的民间解读有很多，比较常见、也更推荐的一种解读如下。

在理论计算机科学中，CAP 定理（CAP theorem）指出对于一个分布式系统来说，当设计读写操作时，只能同时满足以下三点中的两个：

- **一致性（Consistency）**：在 Gilbert/Lynch（2002）的证明语境里，CAP 的一致性 C 指的是 **Atomic Consistency**，通常等同于 **Linearizability（线性一致性）**。即所有操作按实时顺序线性化，即写操作一旦完成，后续所有读操作都必须返回该写入的值（或更新的值）。**注意：** 这里的 Consistency 与数据库 ACID 中的 Consistency（一致性约束）含义不同，后者指事务执行前后数据库状态满足完整性约束。
- **可用性（Availability）**：非故障的节点必须对每个请求返回响应（不讨论响应快慢）。**注意**：这是 CAP 理论中的严格定义，不包含工程中的延迟/SLA 指标（如「1s 内返回」）。
- **分区容错性（Partition Tolerance）**：CAP 里的 P 本质上是在假设异步网络（可能延迟/丢包/分区），不是一个你「选择要不要」的功能。真正的权衡是：当分区发生时，你必须在**线性一致（CAP 的 Consistency=Linearizability）**与**CAP-Availability（任何非故障节点都要对请求给非错误响应）**之间做选择。

**什么是网络分区？**

分布式系统中，多个节点之间的网络本来是连通的，但是因为某些故障（比如部分节点网络出了问题）某些节点之间不连通了，整个网络就分成了几块区域，这就叫 **网络分区**。

![partition-tolerance](https://oss.javaguide.cn/2020-11/partition-tolerance.png)

### CAP 是 3 选 2 吗？

这是一个常见的误区。实际上：

1. **P 是必选的**：分布式系统中网络分区是必然发生的，无法避免
2. **真正的选择是 CA**：当分区发生时，在一致性和可用性之间权衡
3. **同一系统内不同操作可以有不同的选择**：如 Nacos 支持在 CP 和 AP 之间切换

对于分布式系统来说，P 是必须要有的，因为网络既然会存在分区问题（网络延迟、丢包、中断等），分区容错性也就成为了必然的选择。如果是单机系统，就没有分区的问题，也就没有 P 这回事了，这时候可以同时满足 CA。

### PACELC 理论是什么？

PACELC 是 CAP 的扩展，更贴近实际系统设计：

- **如果存在分区（P）**：必须在可用性（A）和一致性（C）之间选择
- **否则（E）**：必须在延迟（L）和一致性（C）之间选择

**实际意义**：即使没有网络分区，系统仍需在低延迟和强一致性之间权衡。例如，同步复制可以保证强一致性但会增加延迟，异步复制可以降低延迟但会牺牲一致性。

### ⭐️什么是 BASE 理论？

BASE 理论是对 CAP 中 AP 方案的延伸，是对 ACID 强一致性的替代方案。

**BASE 含义：**

- **Basically Available（基本可用）**：系统出现故障时，允许损失部分可用性（如响应时间增加、功能降级）。比如在双十一秒杀活动中，为了保证系统的稳定性，部分用户可能会被引导到降级页面。
- **Soft-state（软状态）**：允许系统存在中间状态，该状态不影响整体可用性。这里的中间状态是指数据在复制过程中可能存在短暂的不一致。
- **Eventually Consistent（最终一致性）**：系统保证在一段时间内达到数据一致，而非实时一致。实际上，ACID 和 BASE 并非完全对立，ACID 是强一致性，而 BASE 是最终一致性，两者都是保证数据一致性的策略。

**BASE vs ACID：**

| 特性     | ACID       | BASE       |
| -------- | ---------- | ---------- |
| 一致性   | 强一致     | 最终一致   |
| 可用性   | 较低       | 较高       |
| 性能     | 较低       | 较高       |
| 适用场景 | 传统数据库 | 分布式系统 |

### 最终一致性的修复方式有哪些？

**业界比较推崇最终一致性级别，但是某些对数据一致要求十分严格的场景比如银行转账还是要保证强一致性。**

那实现最终一致性的具体方式是什么呢？

- **读时修复（Read Repair）**：在读取数据时，检测数据的不一致，进行修复。适合读多写少场景。
- **写时修复（Hinted Handoff）**：在写入数据时，如果目标节点不可用，将数据缓存下来，待节点恢复后重传。**写时修复** 优化了写入延迟，但增加了读取时的不一致风险（数据可能还在缓存队列中未落盘到目标节点）。
- **异步修复（Anti-Entropy/反熵）**：通过后台比对副本数据差异并修复。工程实现中关键挑战是**高效检测数据差异**——暴力逐条比对（O(n)）在大规模数据集下不可行，生产系统采用**默克尔树（Merkle Tree）**实现低开销差异定位。

### 为什么很多人把 BASE 当作 CAP 的补充？

这是一个**部分正确但表述不够精确**的说法。更准确的理解是：

1. **BASE 首先是 ACID 的替代品**：从论文标题[《Base: An ACID Alternative》](https://spawn-queue.acm.org/doi/10.1145/1394127.1394128)可以看出，BASE 理论的初衷是解决分布式事务场景下 ACID 过于严格的问题。

2. **BASE 与 CAP 的 AP 架构存在内在联系**：

   - 选择 AP 架构意味着放弃强一致性（C）
   - 放弃强一致性后，系统如何达到收敛？答案是**最终一致性**
   - 因此，BASE 理论（特别是最终一致性）是 AP 架构在工程实践中**必须采用**的指导原则

3. **误解产生的根源**：很多人把"BASE 与 AP 相关"误解为"BASE 是 CAP 的补充"。实际上：
   - **BASE 不是对 CAP 理论的补充或修正**
   - **BASE 是 AP 架构选择的工程实践指南**——当你选择了 AP，BASE 告诉你如何在工程实践中让系统最终达到一致

**正确的理解**：

```mermaid
flowchart TB
    %% 核心语义配色
    classDef cap fill:#E99151,color:#FFFFFF,stroke:none,rx:10,ry:10
    classDef base fill:#27AE60,color:#FFFFFF,stroke:none,rx:10,ry:10
    classDef acid fill:#3498DB,color:#FFFFFF,stroke:none,rx:10,ry:10
    classDef relation fill:#9B59B6,color:#FFFFFF,stroke:none,rx:10,ry:10

    CAP[CAP 理论<br/>分布式存储系统设计约束]:::cap
    ACID[ACID 理论<br/>数据库事务完整性]:::acid
    BASE[BASE 理论<br/>ACID 的分布式替代品]:::base

    CAP -->|AP 架构放弃强一致性| BASE
    ACID -->|分布式场景放宽| BASE

    CAP -->|约束：不能同时满足 C+A| R1[实践意义]:::relation
    BASE -->|实现：如何达到最终一致| R1

    R1 --> Result[CAP 告诉我们限制<br/>BASE 告诉我们做法]:::relation

    linkStyle default stroke-width:2px,stroke:#333333,opacity:0.8
```

| 维度       | CAP 理论                 | BASE 理论                                        |
| ---------- | ------------------------ | ------------------------------------------------ |
| 关注领域   | 分布式存储系统（带副本） | 所有分布式系统                                   |
| 一致性含义 | 数据一致性（副本同步）   | 状态一致性（事务终态）                           |
| 可用性含义 | 节点故障时系统可用       | 部分节点故障时部分功能可用                       |
| 核心关系   | -                        | ① ACID 的分布式替代品<br>② AP 架构的工程实践指南 |

> **实践意义**：CAP 告诉我们在 AP 架构下无法保证强一致性，BASE 告诉我们在 AP 架构下如何通过最终一致性让系统达到收敛——两者是**约束与实现**的关系，而非补充关系。

如果说 CAP 是分布式存储系统的设计约束（告诉我们不能做什么），那么 BASE 就是分布式系统（尤其是业务系统）的实践指导（告诉我们如何做）——它告诉我们：**绝大多数应用场景不需要强一致性，通过接受中间态并最终达到一致性，是更务实的选择。**

## 分布式算法

### ⭐️什么是共识算法？

共识算法的核心目标，就是**让一群机器看起来像一台机器**。只要集群里超过半数的机器还活着，整个系统就能正常接客。

这通常是通过**复制状态机**来实现的：给每个节点发一本一模一样的账本（日志）。只要大家按照同样的顺序去执行账本上的命令，最后得到的结果自然完全一样。所以，共识算法本质上干的就是一件事——**保证所有节点的账本绝对一致**。共识是可容错系统中的一个基本问题：即使面对故障，服务器也可以在共享状态上达成一致。

![共识算法架构](https://oss.javaguide.cn/github/javaguide/paxos-rsm-architecture.png)

### Basic Paxos 算法中存在哪些角色？

Paxos 是最早被广泛认可的分布式共识算法（1990 年 Lamport 提出）。

Basic Paxos 中存在 3 个重要的角色：

1. **提议者（Proposer）**：也可以叫做协调者（coordinator），负责接受客户端请求并发起提案。提案信息通常包括提案编号（proposal ID）和提议的值（value）。
2. **接受者（Acceptor）**：也可以叫做投票员（voter），负责对提案进行投票，同时需要记住自己的投票历史。
3. **学习者（Learner）**：负责学习（learn）已被选定的值。在复制状态机（RSM）实现中，该值通常对应一条待执行的命令，由状态机按序 apply 后再由对外服务层返回结果。

![Basic Paxos中的角色](https://oss.javaguide.cn/github/javaguide/distributed-system/protocol/up-890fa3212e8bf72886a595a34654918486c.png)

**角色交互关系图**：

```mermaid
flowchart LR
    subgraph Roles["Paxos 三个核心角色"]
        direction LR
        Prop[Proposer<br/>提议者<br/>发起提案]
        Acc[Acceptor<br/>接受者<br/>投票表决]
        Lear[Learner<br/>学习者<br/>获取结果]
    end

    Prop -->|Prepare| Acc
    Acc -->|Promise| Prop
    Prop -->|Accept| Acc
    Acc -->|Accepted| Prop
    Prop -->|通知选定| Lear

    style Roles fill:#F5F7FA,color:#333,stroke:#005D7B,stroke-width:2px
    classDef role fill:#E99151,color:#FFFFFF,stroke:none,rx:10,ry:10

    class Prop,Acc,Lear role
```

为了减少实现该算法所需的节点数，一个节点可以身兼多个角色。并且，一个提案被选定需要被半数以上的 Acceptor 接受。这样的话，Basic Paxos 算法还具备容错性，在少于一半的节点出现故障时，集群仍能正常工作。

**适用场景**：非拜占庭环境（无恶意节点）

### Basic Paxos 的两阶段流程？

**Phase 1: Prepare/Promise（准备阶段）**

1. Proposer 选择提案编号 n，向多数 Acceptor 发送 Prepare(n)
2. Acceptor 收到 Prepare(n) 后，承诺不再接受编号小于 n 的提案，并返回已接受的编号最大的提案（如有）

**Phase 2: Accept/Accepted（接受阶段）**

1. Proposer 收到多数 Promise 后，发送 Accept(n, v)，v 是收到的最大编号提案的值，或自己提议的值
2. Acceptor 收到 Accept(n, v) 后，接受提案（除非已承诺更大的编号）

**关键点**：必须获得**多数（Quorum）** 的 Accept 才算提案被选定。

### Multi-Paxos 的 Basic Paxos 有什么区别？

Basic Paxos 算法仅能就单个值达成共识，为了能够对一系列的值达成共识，我们需要用到 Multi-Paxos 思想。

Multi-Paxos 的核心优化思想是**复用 Leader**：通过 Basic Paxos 选出一个稳定的 Proposer 作为 Leader，后续提案直接由该 Leader 发起，跳过 Phase 1 的 Prepare/Promise 阶段。

### ⭐️Raft 算法与 Paxos 的关系？

- Raft 不是 Paxos 的变体，但借鉴了 Multi-Paxos 思想
- Raft 设计目标是**易于理解**
- 将共识问题拆解为三个子问题：**Leader 选举**、**日志复制**、**安全性**

### Raft 的三种节点状态？

一个 Raft 集群包括若干服务器，以典型的 5 服务器集群举例。在任意的时间，每个服务器一定会处于以下三个状态中的一个：

- **Leader（领导者）**：大当家。全权负责接待客户端、写账本、并把账本同步给小弟。为了防止别人篡位，他必须不断地向全员发送心跳，宣告“我还活着”。
- **Follower（跟随者）**：安分守己的小弟。平时绝对不主动发起请求，只被动接收老大的心跳和账本同步。
- **Candidate（候选人）**：临时状态。如果小弟迟迟等不到老大的心跳，就会觉得自己行了，变身候选人开始拉票。

在正常的情况下，只有一个服务器是 Leader，剩下的服务器是 Follower。Follower 是被动的，它们不会发送任何请求，只是响应来自 Leader 和 Candidate 的请求。

![Raft 服务器状态转换示意图](https://oss.javaguide.cn/github/javaguide/paxos-server-state.png)

### ⭐️Raft 的 Leader 选举流程？

1. Follower 在选举超时（election timeout）内未收到心跳，变为 Candidate
2. Candidate 自增 term，向所有节点发起 RequestVote
3. 收到多数选票则成为 Leader
4. 使用**随机选举超时**避免同时竞选（Split Vote）

![Raft Leader 选举流程](https://oss.javaguide.cn/github/javaguide/distributed-system/protocol/raft-election.png)

**随机选举超时**：每个节点的选举超时时间是随机的（如 150-300ms），这样可以减少多个节点同时发起选举的概率。

### ZAB 协议的两种广播模式？

**ZAB（ZooKeeper Atomic Broadcast）** **正确的理解**是 ZooKeeper 专用的原子广播协议。

**两种模式**：

- **消息广播模式**：正常处理写请求，类似简化版 2PC。Leader 将请求转化为事务提案，发送给所有 Follower，收到半数以上 ACK 后提交。
- **崩溃恢复模式**：Leader 选举 + 数据同步。当 Leader 宕机或重启时，集群进入恢复模式。

![ZAB 消息广播模式](https://oss.javaguide.cn/github/javaguide/distributed-system/protocol/zab-message-broadcast-flow.png)

![zab-crash-recovery-flow](https://oss.javaguide.cn/github/javaguide/distributed-system/protocol/zab-crash-recovery-flow.png)

### ZAB 的 ZXID 结构？

为了保证分布式环境下消息的绝对顺序性，ZAB 协议引入了一个全局单调递增的事务 ID——**ZXID**。

ZXID 是一个 64 位的长整型（long）：

- **高 32 位（Epoch 纪元）：** 代表当前 Leader 的任期年代。当选出一个新的 Leader 时，Epoch 就会在前一个的基础上加 1。这相当于朝代更替。
- **低 32 位（事务 ID）：** 一个简单的递增计数器。针对客户端的每一个写请求，计数器都会加 1。新 Leader 上位时，这个低 32 位会被清零重置。

![ZXID 结构](https://oss.javaguide.cn/github/javaguide/distributed-system/protocol/zab-zxid-structure.png)

### ⭐️ZAB 的 Leader 选举规则？

按顺序比较：**Epoch > ZXID > myid**

1. 首先比较 Epoch，Epoch 大的胜出
2. Epoch 相同，比较 ZXID，ZXID 大的胜出（数据更新）
3. 都相同，比较 myid（服务器 ID），myid 大的胜出

获得过半选票的节点成为 Leader。

### Gossip 协议是什么？

**Gossip（闲话协议）**也称 **Epidemic 协议**（流行病协议），是一种**去中心化**的信息传播协议：

- 每个节点周期性随机选择若干节点交换信息
- 像病毒传播一样扩散至整个网络
- 在非拜占庭且不存在永久网络分区的前提下，达到**最终一致性**

**关键特性**：

- **去中心化**：无中心节点，所有节点地位平等
- **容错性强**：容忍节点宕机、网络分区、动态增删节点
- **概率收敛**：传播轮次期望为 O(log N)
- **消息冗余**：同一消息可能被多次接收，需去重机制

**典型应用**：Redis Cluster 节点通信、Cassandra 数据同步

### Gossip 的两种传播模式？

| 要点     | 反熵（Anti-Entropy）    | 谣言传播（Rumor-Mongering） |
| -------- | ----------------------- | --------------------------- |
| 传播内容 | 完整数据（或摘要）      | 仅新增数据（Delta）         |
| 适用场景 | 节点数量适中            | 节点数量较多/动态变化       |
| 消息开销 | 较大                    | 较小                        |
| 实现方式 | Push / Pull / Push-Pull | 节点收到更新后周期性传播    |

![反熵机制：Push-Pull 交互时序图 (Anti-Entropy)](https://oss.javaguide.cn/github/javaguide/distributed-system/protocol/gossip-anti-entropy-pushpull.png)

![Gossip 传播示意图](https://oss.javaguide.cn/github/javaguide/distributed-system/protocol/gossip-rumor-mongering.gif)

> **生产级优化**：在大规模分布式存储（如 Cassandra、DynamoDB）中，使用 **Merkle Tree（默克尔树）** 进行增量差异比对，仅传输增量数据。

### ⭐️一致性哈希算法解决什么问题？

解决传统哈希取模在节点增减时导致**大量数据迁移**的问题。

**普通哈希**：`hash(key) % N`，节点数 N 变化时，平均有 (N-1)/N 比例的数据需要迁移，这个比例**趋近于 100%**。

**一致性哈希**：节点变化时，只影响相邻节点的数据，影响范围非常小。

![哈希取模](https://oss.javaguide.cn/github/javaguide/distributed-system/protocol/consistent-hashing/hashqumo.png)

### 一致性哈希的原理？

1. 将哈希空间组织成**环形结构**（0 ~ 2^32-1）
2. 数据和节点都映射到环上：`hash(key) % 2^32`、`hash(服务器IP) % 2^32`
3. 数据顺时针找到的第一个节点就是其所属节点

![哈希环](https://oss.javaguide.cn/github/javaguide/distributed-system/protocol/consistent-hashing/consistent-hashing-circle.png)

### 一致性哈希的数据倾斜问题如何解决？

引入**虚拟节点**：

- 每个物理节点对应多个虚拟节点（100-200 个，如 Nginx 选择 160 个）
- 虚拟节点均匀分布在环上，使数据分布更均衡
- 节点宕机时，流量会**均匀分散**到多个物理节点，而不是集中到一个邻居节点

**引入虚拟节点的好处**：

1. **数据均衡**：从根本上解决了数据倾斜问题
2. **容错性增强**：当一个物理节点宕机，其多个虚拟节点同时下线，数据和流量会均匀分散到其他多个物理节点

![虚拟节点](https://oss.javaguide.cn/github/javaguide/distributed-system/protocol/consistent-hashing/consistent-hashing-circle-virtual-node.png)

## 分布式锁

### ⭐️为什么需要分布式锁？

**本地锁的局限性**：

在多线程环境中，如果多个线程同时访问共享资源（例如商品库存、外卖订单），会发生数据竞争，可能会导致出现脏数据或者系统问题，威胁到程序的正常运行。

![共享资源未互斥访问导致出现问题](https://oss.javaguide.cn/github/javaguide/distributed-system/distributed-lock/oversold-without-locking.png)

对于单机多线程来说，在 Java 中，我们通常使用 `ReentrantLock` 类、`synchronized` 关键字这类 JDK 自带的 **本地锁** 来控制一个 JVM 进程内的多个线程对本地共享资源的访问。

![本地锁](https://oss.javaguide.cn/github/javaguide/distributed-system/distributed-lock/jvm-local-lock.png)

**分布式场景下的问题**：

分布式系统下，不同的服务/客户端通常运行在独立的 JVM 进程上。如果多个 JVM 进程共享同一份资源的话，使用本地锁就没办法实现资源的互斥访问了。

举个例子：系统的订单服务一共部署了 3 份，都对外提供服务。用户下订单之前需要检查库存，为了防止超卖，这里需要加锁以实现对检查库存操作的同步访问。由于订单服务位于不同的 JVM 进程中，本地锁在这种情况下就没办法正常工作了。我们需要用到分布式锁，这样的话，即使多个线程不在同一个 JVM 进程中也能获取到同一把锁，进而实现共享资源的互斥访问。

![分布式锁](https://oss.javaguide.cn/github/javaguide/distributed-system/distributed-lock/distributed-lock.png)

**典型应用场景**：

- 秒杀活动防止超卖
- 库存扣减保证原子性
- 订单处理防止重复

### 分布式锁应具备哪些条件？

一个最基本的分布式锁需要满足：

- **互斥**：任意一个时刻，锁只能被一个线程持有。
- **高可用**：锁服务是高可用的，当一个锁服务出现问题，能够自动切换到另外一个锁服务。并且，即使客户端的释放锁的代码逻辑出现问题，锁最终一定还是会被释放，不会影响其他线程对共享资源的访问。这一般是通过超时机制实现的。
- **可重入**：一个节点获取了锁之后，还可以再次获取锁。

除了上面这三个基本条件之外，一个好的分布式锁还需要满足下面这些条件：

- **高性能**：获取和释放锁的操作应该快速完成，并且不应该对整个系统的性能造成过大影响。
- **非阻塞**：如果获取不到锁，不能无限期等待，避免对系统正常运行造成影响。

### 分布式锁的常见实现方式有哪些？

常见分布式锁实现方案如下：

- 基于关系型数据库比如 MySQL 实现分布式锁。
- 基于分布式协调服务 ZooKeeper 实现分布式锁。
- 基于分布式键值存储系统比如 Redis 、Etcd 实现分布式锁。

关系型数据库的方式一般是通过唯一索引或者排他锁实现。不过，一般不会使用这种方式，问题太多比如性能太差、不具备锁失效机制。

基于 ZooKeeper 或者 Redis 实现分布式锁这两种实现方式要用的更多一些。

### ⭐️如何基于 Redis 实现分布式锁？

**最简实现（SETNX）**：

```bash
# 加锁
SET lockKey uniqueValue NX EX 30
# NX: key不存在才设置  EX: 设置过期时间30秒

# 释放锁（使用Lua脚本保证原子性）
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
```

**为什么需要 Lua 脚本释放锁？**

释放锁需要先判断 value 是否一致再删除，这两步操作需要保证原子性，否则可能出现误删其他客户端锁的情况。

**具体流程**：

1. 加锁时使用 `SET key value NX PX expireTime` 命令，保证原子性
2. value 必须是唯一标识（如 UUID），用于识别锁的持有者
3. 释放锁时先判断 value 是否一致，再执行删除，使用 Lua 脚本保证原子性

![Redis 实现简易分布式锁](https://oss.javaguide.cn/github/javaguide/distributed-system/distributed-lock/distributed-lock-setnx.png)

**为什么要给锁设置一个过期时间？**

为了避免锁无法被释放，我们可以想到的一个解决办法就是：**给这个 key（也就是锁） 设置一个过期时间** 。

```bash
127.0.0.1:6379> SET lockKey uniqueValue EX 3 NX
OK
```

- **lockKey**：加锁的锁名；
- **uniqueValue**：能够唯一标识锁的随机字符串；
- **NX**：只有当 lockKey 对应的 key 值不存在的时候才能 SET 成功；
- **EX**：过期时间设置（秒为单位）EX 3 标示这个锁有一个 3 秒的自动过期时间。与 EX 对应的是 PX（毫秒为单位），这两个都是过期时间设置。

**一定要保证设置指定 key 的值和过期时间是一个原子操作！！！** 不然的话，依然可能会出现锁无法被释放的问题。

这样确实可以解决问题，不过，这种解决办法同样存在漏洞：**如果操作共享资源的时间大于过期时间，就会出现锁提前过期的问题，进而导致分布式锁直接失效。如果锁的超时时间设置过长，又会影响到性能。**

你或许在想：**如果操作共享资源的操作还未完成，锁过期时间能够自己续期就好了！**

对于 Java 开发的小伙伴来说，已经有了现成的解决方案：**[Redisson](https://github.com/redisson/redisson)** 。其他语言的解决方案，可以在 Redis 官方文档中找到，地址：<https://redis.io/topics/distlock> 。

![Distributed locks with Redis](https://oss.javaguide.cn/github/javaguide/redis-distributed-lock.png)

Redisson 是一个开源的 Java 语言 Redis 客户端，提供了很多开箱即用的功能，不仅仅包括多种分布式锁的实现。并且，Redisson 还支持 Redis 单机、Redis Sentinel、Redis Cluster 等多种部署架构。

Redisson 中的分布式锁自带自动续期机制，使用起来非常简单，原理也比较简单，其提供了一个专门用来监控和续期锁的 **Watch Dog（ 看门狗）**，如果操作共享资源的线程还未执行完成的话，Watch Dog 会不断地延长锁的过期时间，进而保证锁不会因为超时而被释放。

![Redisson 看门狗自动续期](https://oss.javaguide.cn/github/javaguide/distributed-system/distributed-lock/distributed-lock-redisson-renew-expiration.png)

看门狗名字的由来于 `getLockWatchdogTimeout()` 方法，这个方法返回的是看门狗给锁续期的过期时间，默认为 30 秒（[redisson-3.17.6](https://github.com/redisson/redisson/releases/tag/redisson-3.17.6)）。

```java
//默认 30秒，支持修改
private long lockWatchdogTimeout = 30 * 1000;

public Config setLockWatchdogTimeout(long lockWatchdogTimeout) {
    this.lockWatchdogTimeout = lockWatchdogTimeout;
    return this;
}
public long getLockWatchdogTimeout() {
   return lockWatchdogTimeout;
}
```

`renewExpiration()` 方法包含了看门狗的主要逻辑：

```java
private void renewExpiration() {
         //......
        Timeout task = commandExecutor.getConnectionManager().newTimeout(new TimerTask() {
            @Override
            public void run(Timeout timeout) throws Exception {
                //......
                // 异步续期，基于 Lua 脚本
                CompletionStage<Boolean> future = renewExpirationAsync(threadId);
                future.whenComplete((res, e) -> {
                    if (e != null) {
                        // 无法续期
                        log.error("Can't update lock " + getRawName() + " expiration", e);
                        EXPIRATION_RENEWAL_MAP.remove(getEntryName());
                        return;
                    }

                    if (res) {
                        // 递归调用实现续期
                        renewExpiration();
                    } else {
                        // 取消续期
                        cancelExpirationRenewal(null);
                    }
                });
            }
         // 延迟 internalLockLeaseTime/3（默认 10s，也就是 30/3） 再调用
        }, internalLockLeaseTime / 3, TimeUnit.MILLISECONDS);

        ee.setTimeout(task);
    }
```

默认情况下，每过 10 秒，看门狗就会执行续期操作，将锁的超时时间设置为 30 秒。看门狗续期前也会先判断是否需要执行续期操作，需要才会执行续期，否则取消续期操作。

Watch Dog 通过调用 `renewExpirationAsync()` 方法实现锁的异步续期：

```java
protected CompletionStage<Boolean> renewExpirationAsync(long threadId) {
    return evalWriteAsync(getRawName(), LongCodec.INSTANCE, RedisCommands.EVAL_BOOLEAN,
            // 判断是否为持锁线程，如果是就执行续期操作，就锁的过期时间设置为 30s（默认）
            "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
                    "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                    "return 1; " +
                    "end; " +
                    "return 0;",
            Collections.singletonList(getRawName()),
            internalLockLeaseTime, getLockName(threadId));
}
```

可以看出， `renewExpirationAsync` 方法其实是调用 Lua 脚本实现的续期，这样做主要是为了保证续期操作的原子性。

我这里以 Redisson 的分布式可重入锁 `RLock` 为例来说明如何使用 Redisson 实现分布式锁：

```java
// 1.获取指定的分布式锁对象
RLock lock = redisson.getLock("lock");
// 2.拿锁且不设置锁超时时间，具备 Watch Dog 自动续期机制
lock.lock();
// 3.执行业务
...
// 4.释放锁
lock.unlock();
```

只有未指定锁超时时间，才会使用到 Watch Dog 自动续期机制。

```java
// 手动给锁设置过期时间，不具备 Watch Dog 自动续期机制
lock.lock(10, TimeUnit.SECONDS);
```

如果使用 Redis 来实现分布式锁的话，还是比较推荐直接基于 Redisson 来做的。

### ⭐️如何实现可重入锁？

所谓可重入锁指的是在一个线程中可以多次获取同一把锁，比如一个线程在执行一个带锁的方法，该方法中又调用了另一个需要相同锁的方法，则该线程可以直接执行调用的方法即可重入 ，而无需重新获得锁。像 Java 中的 `synchronized` 和 `ReentrantLock` 都属于可重入锁。

**不可重入的分布式锁基本可以满足绝大部分业务场景了，一些特殊的场景可能会需要使用可重入的分布式锁。**

可重入分布式锁的实现核心思路是线程在获取锁的时候判断是否为自己的锁，如果是的话，就不用再重新获取了。为此，我们可以为每个锁关联一个可重入计数器和一个占有它的线程。当可重入计数器大于 0 时，则锁被占有，需要判断占有该锁的线程和请求获取锁的线程是否为同一个。

实际项目中，我们不需要自己手动实现，推荐使用我们上面提到的 **Redisson** ，其内置了多种类型的锁比如可重入锁（Reentrant Lock）、自旋锁（Spin Lock）、公平锁（Fair Lock）、多重锁（MultiLock）、 红锁（RedLock）、 读写锁（ReadWriteLock）。

![](https://oss.javaguide.cn/github/javaguide/distributed-system/distributed-lock/redisson-readme-locks.png)

### Redis 如何解决集群情况下分布式锁的可靠性？

为了避免单点故障，生产环境下的 Redis 服务通常是集群化部署的。

Redis 集群下，上面介绍到的分布式锁的实现会存在一些问题。由于 Redis 集群数据同步到各个节点时是异步的，如果在 Redis 主节点获取到锁后，在没有同步到其他节点时，Redis 主节点宕机了，此时新的 Redis 主节点依然可以获取锁，所以多个应用服务就可以同时获取到锁。

![](https://oss.javaguide.cn/github/javaguide/distributed-system/distributed-lock/redis-master-slave-distributed-lock.png)

针对这个问题，Redis 之父 antirez 设计了 [Redlock 算法](https://redis.io/topics/distlock) 来解决。

![](https://oss.javaguide.cn/github/javaguide/distributed-system/distributed-lock/distributed-lock-redis.io-realock.png)

Redlock 算法的思想是让客户端向 Redis 集群中的多个独立的 Redis 实例依次请求申请加锁，如果客户端能够和半数以上的实例成功地完成加锁操作，那么我们就认为，客户端成功地获得分布式锁，否则加锁失败。

即使部分 Redis 节点出现问题，只要保证 Redis 集群中有半数以上的 Redis 节点可用，分布式锁服务就是正常的。

Redlock 是直接操作 Redis 节点的，并不是通过 Redis 集群操作的，这样才可以避免 Redis 集群主从切换导致的锁丢失问题。

Redlock 实现比较复杂，性能比较差，发生时钟变迁的情况下还存在安全性隐患。《数据密集型应用系统设计》一书的作者 Martin Kleppmann 曾经专门发文（[How to do distributed locking - Martin Kleppmann - 2016](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)）怼过 Redlock，他认为这是一个很差的分布式锁实现。感兴趣的朋友可以看看[Redis 锁从面试连环炮聊到神仙打架](https://mp.weixin.qq.com/s?__biz=Mzg3NjU3NTkwMQ==&mid=2247505097&idx=1&sn=5c03cb769c4458350f4d4a321ad51f5a&source=41#wechat_redirect)这篇文章，有详细介绍到 antirez 和 Martin Kleppmann 关于 Redlock 的激烈辩论。

实际项目中不建议使用 Redlock 算法，成本和收益不成正比，可以考虑基于 Redis 主从复制+哨兵模式实现分布式锁。

### ⭐️基于 ZooKeeper 实现分布式锁的原理？

**实现方式**：基于**临时顺序节点**和 **Watcher 机制**

**流程**：

1. 客户端在锁节点下创建临时顺序节点
2. 判断自己是否是最小序号节点，是则获取锁成功
3. 否则监听前一个节点的删除事件
4. 前一个节点删除后，收到通知再次检查是否为最小节点

**为什么使用临时顺序节点？**

- **临时节点**：会话消失则节点消失，避免客户端宕机导致死锁
- **顺序节点**：只需监听前一个节点，避免羊群效应（所有节点监听同一节点），提升性能

**羊群效应说明**：如果所有客户端都监听同一个节点，当该节点被删除时，所有客户端都会被唤醒去竞争锁，这对 ZooKeeper 服务器造成很大压力。使用顺序节点后，每个客户端只需要监听自己前一个节点，大大减少了通知的次数。

### Redis 和 ZooKeeper 分布式锁如何选择？

| 对比项     | Redis                          | ZooKeeper                |
| ---------- | ------------------------------ | ------------------------ |
| 性能       | 高                             | 较低                     |
| 可靠性     | 依赖主从复制，极端情况可能丢锁 | 临时节点机制，更可靠     |
| 实现复杂度 | 中等（需要处理续期、Lua脚本）  | 较低（Curator 封装完善） |
| 部署       | 简单                           | 较复杂                   |

**选择建议**：

- 追求性能：选择 Redis + Redisson
- 追求可靠性：选择 ZooKeeper + Curator
- 不建议仅为分布式锁引入 ZooKeeper

## 分布式ID

### ⭐️什么是分布式ID？需要满足哪些要求？

分布式 ID 是分布式系统下的 ID。分布式 ID 不存在与现实生活中，属于计算机系统中的一个概念。

我简单举一个分库分表的例子。

我司的一个项目，使用的是单机 MySQL 。但是，没想到的是，项目上线一个月之后，随着使用人数越来越多，整个系统的数据量将越来越大。单机 MySQL 已经没办法支撑了，需要进行分库分表（推荐 Sharding-JDBC）。

在分库之后， 数据遍布在不同服务器上的数据库，数据库的自增主键已经没办法满足生成的主键唯一了。**我们如何为不同的数据节点生成全局唯一主键呢？**

这个时候就需要生成**分布式 ID**了。

![](https://oss.javaguide.cn/github/javaguide/system-design/distributed-system/id-after-the-sub-table-not-conflict.png)

分布式 ID 作为分布式系统中必不可少的一环，很多地方都要用到分布式 ID。

一个最基本的分布式 ID 需要满足下面这些要求：

- **全局唯一**：ID 的全局唯一性肯定是首先要满足的！
- **高性能**：分布式 ID 的生成速度要快，对本地资源消耗要小。
- **高可用**：生成分布式 ID 的服务要保证可用性无限接近于 100%。
- **方便易用**：拿来即用，使用方便，快速接入！

除了这些之外，一个比较好的分布式 ID 还应保证：

- **安全**：ID 中不包含敏感信息。
- **有序递增**：如果要把 ID 存放在数据库的话，ID 的有序性可以提升数据库写入速度。并且，很多时候 ，我们还很有可能会直接通过 ID 来进行排序。
- **有具体的业务含义**：生成的 ID 如果能有具体的业务含义，可以让定位问题以及开发更透明化（通过 ID 就能确定是哪个业务）。
- **独立部署**：也就是分布式系统单独有一个发号器服务，专门用来生成分布式 ID。这样就生成 ID 的服务可以和业务相关的服务解耦。不过，这样同样带来了网络调用消耗增加的问题。总的来说，如果需要用到分布式 ID 的场景比较多的话，独立部署的发号器服务还是很有必要的。

### ⭐️常见分布式ID生成方案对比？

| **方案**       | **性能** | **有序性** | **运维成本** | **适用场景**                            |
| -------------- | -------- | ---------- | ------------ | --------------------------------------- |
| **数据库自增** | 低       | 严格递增   | 低           | 业务量小、单机架构、后台系统            |
| **号段模式**   | 高       | 趋势递增   | 中           | 高并发、追求极致吞吐量的互联网业务      |
| **Redis 方案** | 很高     | 严格递增   | 中           | 已有 Redis 集群，能容忍极小概率 ID 回退 |
| **Snowflake**  | 高       | 趋势递增   | 低/中        | 大中型分布式系统、Java 生态（最主流）   |
| **UUID v7**    | 高       | 趋势递增   | 极低         | 云原生、无中心化集群、追求开箱即用      |

### ⭐️Snowflake 雪花算法的组成结构？

Snowflake 是 Twitter 开源的分布式 ID 生成算法。Snowflake 由 64 bit 的二进制数字组成，这 64bit 的二进制被分成了几部分，每一部分存储的数据都有特定的含义：

```
0 - 41位时间戳 - 10位机器ID - 12位序列号
```

**结构详解**：

| 部分   | 位数    | 说明                                               |
| ------ | ------- | -------------------------------------------------- |
| 符号位 | 1 bit   | 始终为 0，代表生成的 ID 为正数                     |
| 时间戳 | 41 bits | 相对时间戳（距自定义基点的毫秒数），可支撑约 69 年 |
| 机器ID | 10 bits | 5 位机房 ID + 5 位机器 ID（支持 1024 台机器）      |
| 序列号 | 12 bits | 单机每毫秒最多生成 4096 个 ID                      |

**理论峰值**：单机每毫秒 4096 个 ID，即单机每秒约 400 万 ID。

> **⚠️ 高并发警示**：如果某一毫秒内的并发请求超过 4096 个，算法会**阻塞等待直到下一毫秒**。这可能导致在高并发瞬间（如秒杀、大促）出现响应延迟毛刺。

### Snowflake 有什么问题？如何解决？

**1. 时钟回拨问题**

原因：NTP 同步、人工调整时间、硬件时钟漂移可能导致时间倒退

解决方案对比：

| 方案           | 优点           | 缺点                     | 适用场景               |
| -------------- | -------------- | ------------------------ | ---------------------- |
| 拒绝服务       | 实现简单       | 时钟回拨期间完全不可用   | 对可用性要求不高的场景 |
| 等待追回       | 保证 ID 唯一性 | 可能长时间阻塞           | 时钟稳定的内网环境     |
| 备用 Worker ID | 高可用         | 实现复杂，需考虑 ZK 脑裂 | 生产环境推荐           |

**2. Worker ID 分配问题**

原因：容器化部署（Kubernetes）环境下，Pod 的 IP 和名称是动态的，无法像物理机一样预先配置固定的 Worker ID

解决方案：

- ZooKeeper 注册：服务启动时在 ZK 创建临时节点，节点序号作为 Worker ID
- Redis SETNX 分配：使用 `SETNX` + 过期时间实现 Worker ID 申领
- 数据库分配：启动时从数据库分配并持久化到本地文件

**推荐**：使用美团 Leaf 或滴滴 Tinyid，已内置这些问题处理。

## ⭐️分布式事务

分布式相关的问题非常重要，建议阅读这篇文章：[分布式事务常见解决方案总结](https://javaguide.cn/distributed-system/distributed-transaction.html)。

## 分布式配置中心

### ⭐️为什么需要配置中心？

**传统配置文件的问题**：

微服务架构下，业务发展通常会导致服务数量增加，进而导致程序配置（服务地址、数据库参数、功能开关等）增多。传统配置文件方式存在以下问题：

- **无法动态更新**：配置放在代码库中，每次修改都需要重新发布新版本才能生效。
- **安全性不足**：敏感配置（数据库密码、API Key）直接写在代码库中容易泄露。
- **时效性差**：即使能修改配置文件，通常也需要重启服务才能生效。
- **缺乏权限控制**：无法对配置的查看、修改、发布等操作进行细粒度权限管控。
- **配置分散难管理**：多环境（开发/测试/生产）、多集群的配置分散在各处，难以统一维护。

**配置中心的优势**：

- **版本管理**：记录每次配置变更的修改人、修改时间、修改内容，支持一键回滚。
- **灰度发布**：先将配置推送给部分实例验证，降低变更风险（Apollo、Nacos 1.1.0+ 支持）。
- **权限控制**：配置的查看、修改、发布需分级授权。

![Applo 配置中心](https://oss.javaguide.cn/github/javaguide/config-center/view-release-history.png)

### 常见配置中心有哪些？如何选择

| 功能         | Apollo           | Nacos              | Spring Cloud Config |
| ------------ | ---------------- | ------------------ | ------------------- |
| 配置界面     | 支持（功能完善） | 支持               | 无（通过 Git 操作） |
| 配置实时生效 | 长轮询（1s内）   | gRPC长连接（1s内） | 需触发 refresh      |
| 灰度发布     | 完善             | 基础支持           | 不支持              |
| 权限管理     | 细粒度           | 支持               | 依赖 Git 平台       |
| 版本管理     | 原生支持         | 原生支持           | 依赖 Git            |
| 部署复杂度   | 较高             | 简单               | 最简单              |

**选型建议**：

- 只需配置中心 → **Apollo**（功能最完善）或 **Nacos**（上手更简单）
- 需要配置中心 + 服务发现 → **Nacos**
- Spring Cloud 体系且追求简单 → **Spring Cloud Config**
- Kubernetes 环境 → **K8s ConfigMap 挂载 + 应用层文件监听**（由于 Kubelet 同步 Volume 存在 1~2 分钟延迟，需引入 inotify 或 Spring Cloud Kubernetes 实现热重载）

### 配置推送的三种模式？

| 模式   | 实时性          | 服务端压力       | 说明           |
| ------ | --------------- | ---------------- | -------------- |
| 推模式 | 高（毫秒级）    | 高（需维护连接） | 服务端主动推送 |
| 拉模式 | 低（秒~分钟级） | 高（无效轮询）   | 客户端定时拉取 |
| 长轮询 | 中高（1~30s）   | 中等             | 主流方案       |

**长轮询原理**：

- **Apollo**：采用 HTTP 长轮询。客户端发起请求，服务端若有变更立即返回；无变更则挂起请求（默认 30s），期间一旦有变更立即响应。
- **Nacos 2.x**：采用 gRPC 长连接双向流。相比 1.x 的 HTTP 长轮询，gRPC 连接更轻量，配置变更可毫秒级主动 Push 至客户端。

> **注意**：长轮询虽然比短轮询节省 CPU 和网络开销，但当客户端规模达到十万级时，服务端需维持海量挂起的 HTTP 请求，对内存和连接数上限仍有较大压力。

## API网关

### ⭐️什么是 API 网关？为什么需要网关？

API 网关（API Gateway）是位于客户端与后端服务之间的**统一入口**，所有客户端请求先经过网关，再由网关路由到具体的目标服务。

在微服务架构下，一个系统被拆分为多个服务。像**安全认证、流量控制、日志、监控**等功能是每个服务都需要的。如果没有网关，我们需要在每个服务中单独实现这些功能，导致：

- **代码重复**：相同逻辑在多个服务中冗余实现
- **管理分散**：缺乏统一的配置和监控视图
- **维护成本高**：功能变更需要修改所有服务

![网关示意图](https://oss.javaguide.cn/github/javaguide/system-design/distributed-system/api-gateway-overview.png)

### 网关的核心职责？

网关的功能虽然繁多，但核心可以概括为两件事：

| 职责         | 说明                                | 典型功能                               |
| ------------ | ----------------------------------- | -------------------------------------- |
| **请求转发** | 将客户端请求路由到正确的目标服务    | 动态路由、负载均衡、协议转换           |
| **请求过滤** | 在请求到达后端服务前/后进行拦截处理 | 身份认证、权限校验、限流熔断、日志记录 |

网关可以提供请求转发、安全认证（身份/权限认证）、流量控制、负载均衡、降级熔断、日志、监控、参数校验、协议转换等功能。

**网关在微服务架构中的位置**：所有客户端请求先到达网关，网关负责统一的认证鉴权、流量控制、路由分发，后端服务专注于业务逻辑处理。

### 常见网关系统对比？如何选择？

| 特性           | Zuul 1.x | Zuul 2.x       | Spring Cloud Gateway      | Kong                          | APISIX           | Shenyu          |
| -------------- | -------- | -------------- | ------------------------- | ----------------------------- | ---------------- | --------------- |
| **IO 模型**    | 同步阻塞 | 异步非阻塞     | 异步非阻塞                | 异步非阻塞                    | 异步非阻塞       | 异步非阻塞      |
| **底层技术**   | Servlet  | Netty          | WebFlux + Netty           | OpenResty (Nginx + Lua)       | OpenResty + etcd | WebFlux + Netty |
| **性能**       | 低       | 高             | 高                        | 很高                          | 很高             | 高              |
| **动态配置**   | 需重启   | 支持           | 支持                      | 支持                          | 支持（热更新）   | 支持            |
| **配置存储**   | 内存     | 内存           | 内存                      | 数据库 / YAML / K8s CRD       | etcd（分布式）   | 内存/数据库     |
| **限流熔断**   | 需集成   | 需集成         | 内置（集成 Resilience4j） | 插件                          | 插件             | 插件            |
| **生态系统**   | Netflix  | Netflix        | Spring Cloud              | CNCF / Kong                   | Apache           | Apache          |
| **运维复杂度** | 低       | 中             | 低                        | 中（DB-less） / 高（DB Mode） | 中               | 中              |
| **学习曲线**   | 平缓     | 平缓           | 平缓                      | 陡峭（Lua）                   | 陡峭（Lua）      | 平缓（Java）    |
| **适用场景**   | 遗留系统 | Netflix 技术栈 | Spring Cloud 生态         | 云原生、多语言                | 云原生、高性能   | Java 生态       |

选择 API 网关需要综合考虑技术栈、性能要求、团队能力和运维成本。

| 场景                  | 推荐方案                                                   | 理由                                                         |
| --------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| **Spring Cloud 生态** | Spring Cloud Gateway                                       | 与 Spring Boot/Spring Cloud 无缝集成，配置简单               |
| **高性能 / 云原生**   | APISIX                                                     | 基于 etcd 的热更新、性能优异、云原生架构                     |
| **多语言生态**        | Kong                                                       | 插件丰富、支持多语言开发、社区成熟                           |
| **Netflix 技术栈**    | Zuul 2.x                                                   | 与 Eureka、Ribbon、Hystrix 等组件无缝配合                    |
| **双层架构（推荐）**  | Kong/APISIX（流量网关） + Spring Cloud Gateway（业务网关） | 流量网关处理 SSL、WAF、全局限流；业务网关处理微服务鉴权、参数聚合 |

## RPC框架

### ⭐️什么是 RPC？

**RPC（Remote Procedure Call）远程过程调用**：调用远程方法像调用本地方法一样简单。

**为什么要 RPC？** 因为，两个不同的服务器上的服务提供的方法不在一个内存空间，所以，需要通过网络编程才能传递方法调用所需要的参数。并且，方法调用的结果也需要通过网络编程来接收。

**RPC 能帮助我们做什么呢？** 简单来说，通过 RPC 可以帮助我们调用远程计算机上某个服务的方法，这个过程就像调用本地方法一样简单。并且！我们不需要了解底层网络编程的具体细节。

一言蔽之：**RPC 的出现就是为了让你调用远程方法像调用本地方法一样简单。**

### RPC 的核心原理？

为了能够帮助小伙伴们理解 RPC 原理，我们可以将整个 RPC 的 核心功能看作是下面 5 个部分实现的：

1. **客户端（服务消费端）**：调用远程方法的一端。
2. **客户端 Stub（桩）**：这其实就是一代理类。代理类主要做的事情很简单，就是把你调用方法、类、方法参数等信息传递到服务端。
3. **网络传输**：网络传输就是你要把你调用的方法的信息比如说参数啊这些东西传输到服务端，然后服务端执行完之后再把返回结果通过网络传输给你传输回来。网络传输的实现方式有很多种比如最基本的 Socket 或者性能以及封装更加优秀的 Netty（推荐）。
4. **服务端 Stub（桩）**：这里的服务端 Stub 实际指的就是接收到客户端执行方法的请求后，去执行对应的方法然后返回结果给客户端的类。
5. **服务端（服务提供端）**：提供远程方法的一端。

**调用流程**：

1. 服务消费端（client）以本地调用的方式调用远程服务；
2. 客户端 Stub（client stub） 接收到调用后负责将方法、参数等组装成能够进行网络传输的消息体（序列化）：`RpcRequest`；
3. 客户端 Stub（client stub） 找到远程服务的地址，并将消息发送到服务提供端；
4. 服务端 Stub（桩）收到消息将消息反序列化为 Java 对象: `RpcRequest`；
5. 服务端 Stub（桩）根据`RpcRequest`中的类、方法、方法参数等信息调用本地的方法；
6. 服务端 Stub（桩）得到方法执行结果并将组装成能够进行网络传输的消息体：`RpcResponse`（序列化）发送至消费方；
7. 客户端 Stub（client stub）接收到消息并将消息反序列化为 Java 对象:`RpcResponse` ，这样也就得到了最终结果。

### ⭐️HTTP 和 RPC 有什么区别？

| 对比项   | HTTP                    | RPC                        |
| -------- | ----------------------- | -------------------------- |
| 本质     | 应用层协议              | 调用方式（可基于任意协议） |
| 传输内容 | JSON/XML，冗余多        | Protobuf，更紧凑           |
| 连接复用 | HTTP1.1 支持 keep-alive | 通常有连接池               |
| 服务发现 | 依赖 DNS                | 使用注册中心               |
| 性能     | 较低                    | 较高                       |

**注意**：gRPC 就基于 HTTP/2 实现，说明 RPC 和 HTTP 不是对立关系。

### Dubbo 的核心架构角色？

- **Container**：服务运行容器
- **Provider**：服务提供方，向注册中心注册服务
- **Consumer**：服务消费方，向注册中心订阅服务
- **Registry**：注册中心（Nacos、ZooKeeper）
- **Monitor**：监控中心

### Dubbo 的负载均衡策略？

| 策略                      | 说明                               |
| ------------------------- | ---------------------------------- |
| RandomLoadBalance         | 加权随机（默认）                   |
| RoundRobinLoadBalance     | 加权轮询                           |
| LeastActiveLoadBalance    | 最小活跃数（性能好者优先）         |
| ConsistentHashLoadBalance | 一致性哈希（相同参数到同一提供者） |

### 常见 RPC 框架对比？

| 框架       | 特点                          | 适用场景            |
| ---------- | ----------------------------- | ------------------- |
| **Dubbo**  | 功能完善、生态丰富、社区活跃  | Java 后端技术栈首选 |
| **gRPC**   | 跨语言、基于 HTTP/2、Protobuf | 多语言场景          |
| **Thrift** | 跨语言、Facebook 开源         | 多语言场景          |
| **Motan**  | 微博开源、精简版 Dubbo        | 不推荐使用          |

## ZooKeeper

ZooKeeper 目前面试考察不多，如果你的项目用到了再准备，否则的话，可以考虑跳过：

- [ZooKeeper相关概念总结(入门)](https://javaguide.cn/distributed-system/distributed-process-coordination/zookeeper/zookeeper-intro.html)
- [ZooKeeper相关概念总结(进阶)](https://javaguide.cn/distributed-system/distributed-process-coordination/zookeeper/zookeeper-plus.html)

<!-- @include: @article-footer.snippet.md -->
