---
title: 向量检索与 ANN 索引
description: 海量数据的向量检索：从精确最近邻到 ANN 近似最近邻，HNSW / IVF / 乘积量化（PQ）等索引结构。
pubDate: 2026-09-03
updatedDate: 2026-09-06
category: 后端架构
tags: [向量检索, ANN 近似最近邻, HNSW 算法, 乘积量化 PQ, IVF 倒排索引, RAG 向量召回]
draft: false
sticky: 0
# image: ""
# series: ""
# seriesOrder: 1
---

传统关系型数据库的核心假设是数据具备可排序的全序关系，可用于构建 B+ 树索引；而 LSM 树面向写入优化，通过按键排序的批量合并（Compaction）来维护有序性，并不依赖全局全序。但无论采用哪种结构，建立索引的根本目的都是一致的：让查询不必遍历全表，避免退化为 O(N) 的全量扫描。

如果不建立索引，暴力检索每次检索都需要与数据库中全部 N 个向量计算点积并排序，复杂度为 O(N × D)。

绝对精确的最近邻搜索代价太高，实际业务允许少量误差，找到足够接近结果即可。

近似最近邻搜索（Approximate Nearest Neighbor，简称 ANN）放弃了 100% 绝对召回，换取查询效率。

ANN 索引历史上共衍生出四大流派，基于树、基于哈希、基于图和基于量化/倒排。前两者在高维空间中性能会急剧下降。现在生产落地主流派系是基于图和基于量化/倒排。

分层可导航小世界图（Hierarchical Navigable Small World graphs，简称 HNSW）。全量向量和图拓扑全量放内存，速度优先。

倒排文件索引（Inverted File Index，简称 IVF），对全量数据用 k-means 聚类生成 K 个聚类中心。每个向量分配给离它最近的中心，形成一个个倒排桶。检索时粗筛用查询向量与 K 个桶做比较，找出最接近的 N 个桶。精筛遍历这几个桶里的向量计算真实距离。但可能因聚类划分而漏掉桶边界处的数据。如果每个桶内存储的是全量原始向量，内存占用依旧较高。

乘积量化（Product Quantization，简称 PQ），采用分段压缩和预计算查表。把高维向量切成 M 个子向量（如把 128 维向量切成 16 段，每段 8 维）。对每段数据聚类，分别找出 K 个中心点（通常为 256 个，可以用一字节 uint8 储存）。将聚类结果拆为字典。下一步是有损压缩，将每段子向量与训练好的码本对比，用距离最近的代号取代真实的向量。

IVF + PQ 组合：纯 IVF 内存降不下来，纯 PQ 又因量化损失精度、影响召回率。可以用 IVF 进行粗筛，在选中的桶内，用 PQ 的压缩编码和查表方式快速排出 TOP-K。若对精度要求高，再把初筛出来的候选集从磁盘上取回未压缩的原始向量做一次精确重排。



> 参考链接：
>
> 1. [Hierarchical Navigable Small Worlds (HNSW) | Pinecone](https://www.pinecone.io/learn/series/faiss/hnsw/)
> 2. [document_style.md](https://raw.githubusercontent.com/ryanxingql/blog/refs/heads/main/posts/document_style.md)

