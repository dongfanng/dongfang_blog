---
title: "Dockerfile 多阶段构建（Multi-Stage Build）实战"
description: "不使用一个大而全的镜像来构建和运行，把构建产物交给运行阶段，以此减少镜像体积；附完整 Dockerfile 与逐条解析。"
pubDate: 2026-11-09
category: 开发工具
tags: [Docker, Dockerfile, 多阶段构建]
draft: false
sticky: 0
# image: ""
# series: ""
# seriesOrder: 1
---

不使用一个大而全的镜像来执行构建和运行服务，在构建阶段使用完整的环境来执行构建，将其产物交给运行阶段，以此减少运行阶段镜像的体积。

多阶段构建实例：先分别构建两个前端，再以 PostgreSQL 镜像为基础，加入 Python、Redis、Nginx、后端代码和依赖，最终形成一个应用镜像。

```powershell
docker build --platform linux/amd64 `
    --build-context "admin=$repo/ruoyi-fastapi-frontend" `
    --build-context "backend=$repo/ruoyi-fastapi-backend" `
    --build-context "userweb=$userWeb" `
```

```dockerfile
# syntax=docker/dockerfile:1.7
FROM node:22-bookworm-slim AS admin-build
WORKDIR /src
COPY --from=admin package.json package-lock.json ./
RUN npm ci
COPY --from=admin index.html vite.config.js .env.docker ./
COPY --from=admin vite ./vite
COPY --from=admin src ./src
COPY --from=admin public ./public
RUN NODE_OPTIONS=--max-old-space-size=4096 npm run build:docker

FROM node:22-bookworm-slim AS user-build
WORKDIR /src
COPY --from=userweb package.json package-lock.json ./
RUN npm ci
COPY --from=userweb index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY --from=userweb src ./src
COPY --from=userweb public ./public
RUN VITE_API_BASE_URL=/api npm run build

FROM python:3.12-slim-bookworm AS python-runtime
FROM pgvector/pgvector:0.8.3-pg17-bookworm
COPY --from=python-runtime /usr/local/ /usr/local/
RUN rm -f /etc/apt/sources.list.d/pgdg* \
    && apt-get -o Acquire::Retries=3 update \
    && apt-get -o Acquire::Retries=3 install -y --no-install-recommends nginx redis-server supervisor gcc \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=backend requirements-pg.txt pyproject.toml ./
COPY --from=backend cli ./cli
COPY --from=backend common ./common
COPY --from=backend config ./config
COPY --from=backend exceptions ./exceptions
COPY --from=backend middlewares ./middlewares
COPY --from=backend module_admin ./module_admin
COPY --from=backend module_ai ./module_ai
COPY --from=backend module_business ./module_business
COPY --from=backend module_business_web ./module_business_web
COPY --from=backend module_generator ./module_generator
COPY --from=backend module_needtech ./module_needtech
COPY --from=backend module_task ./module_task
COPY --from=backend sub_applications ./sub_applications
COPY --from=backend utils ./utils
COPY --from=backend assets ./assets
COPY --from=backend alembic ./alembic
COPY --from=backend alembic.ini app.py server.py ./
RUN sed '/^psycopg2==/d' requirements-pg.txt > /tmp/requirements-pg.txt \
    && pip install --no-cache-dir psycopg2-binary==2.9.11 -r /tmp/requirements-pg.txt
COPY --from=admin-build /src/dist /srv/admin
COPY --from=user-build /src/dist /srv/user
COPY deploy/offline/nginx.conf /etc/nginx/nginx.conf
COPY deploy/offline/supervisord.conf /etc/supervisor/conf.d/needtech.conf
COPY deploy/offline/start.sh /usr/local/bin/needtech-start
COPY deploy/offline/healthcheck.sh /usr/local/bin/needtech-health
COPY deploy/offline/restore.sh /usr/local/bin/needtech-restore
COPY deploy/offline/start-backend.sh /usr/local/bin/needtech-backend
COPY deploy/offline/ensure-crypto.py /usr/local/bin/needtech-ensure-crypto
RUN chmod 755 /usr/local/bin/needtech-start /usr/local/bin/needtech-health /usr/local/bin/needtech-restore /usr/local/bin/needtech-backend && mkdir -p /data/postgres /data/redis /app/vf_admin/upload_path && chown -R postgres:postgres /data/postgres && chown -R redis:redis /data/redis
ENV PATH="/usr/lib/postgresql/17/bin:${PATH}" TZ=Asia/Shanghai DB_TYPE=postgresql DB_HOST=127.0.0.1 DB_PORT=5432 DB_USERNAME=postgres DB_DATABASE=needtech REDIS_HOST=127.0.0.1 REDIS_PORT=6379 OLLAMA_HOST=http://host.docker.internal:11434 APP_RELOAD=false APP_ROOT_PATH=""
EXPOSE 8080 8081
HEALTHCHECK --interval=15s --timeout=5s --start-period=60s --retries=3 CMD ["/usr/local/bin/needtech-health"]
ENTRYPOINT ["/usr/local/bin/needtech-start"]
```

## 解析

### From 设置从基础镜像开始

```dockerfile
FROM node:22-bookworm-slim AS admin-build
```

- From 表示开始一个构建阶段，并指定它使用的镜像
- node 镜像名称
- 22-bookworm-slim 镜像标签
- AS admin-build 命名这个阶段

### WORKDIR 设置当前工作目录

```dockerfile
WORKDIR /src
```

- 设置当前工作目录为 src，如果不存在会自动创建，后面的相对路径都以这个路径为基准
- 例如 `COPY --from=admin src ./src` 中的 target ./src 在当前阶段代表 /src/src

### COPY 复制文件或目录

```dockerfile
COPY --from=admin package.json package-lock.json ./
```

- 多个 source 时，target 必须是目录，最后一个参数为 target
- `--from=...` 的意思是"从指定来源复制"，来源可以是命名构建阶段，也可以是构建时传入的命名上下文

### RUN 构建运行时指令

```dockerfile
RUN npm ci
```

- RUN 发生在构建镜像时。 它不是每次启动容器时都重新执行。

```dockerfile
FROM python:3.12-slim-bookworm AS python-runtime
FROM pgvector/pgvector:0.8.3-pg17-bookworm
COPY --from=python-runtime /usr/local/ /usr/local/
RUN rm -f /etc/apt/sources.list.d/pgdg* \
    && apt-get -o Acquire::Retries=3 update \
    && apt-get -o Acquire::Retries=3 install -y --no-install-recommends nginx redis-server supervisor gcc \
    && rm -rf /var/lib/apt/lists/*
```

- 通过 `COPY --from=python-runtime /usr/local/ /usr/local/` 将 Python 运行时“缝合”到阶段 2 中。避免了在最终镜像里重新用 `apt-get install python3` 或编译安装 Python，既保证了 Python 版本的纯净，又大大减小了最终镜像的体积
- 删除镜像内特定的 PostgreSQL 软件源配置。
- 更新软件包列表后再安装软件。
- 安装 Redis、Nginx、supervisor、gcc
- 安装完成后删除软件包列表缓存，减少镜像占用。
- `supervisor` 管理容器中的多个服务，包括 PostgreSQL、Redis、后端和 Nginx。

```dockerfile
RUN chmod 755 /usr/local/bin/needtech-start \
              /usr/local/bin/needtech-health \
              /usr/local/bin/needtech-restore \
              /usr/local/bin/needtech-backend \
    && mkdir -p /data/postgres /data/redis /app/vf_admin/upload_path \
    && chown -R postgres:postgres /data/postgres \
    && chown -R redis:redis /data/redis
```

- 设置脚本权限
- 创建数据目录（--parents），
- `chown`：修改文件或目录的所属用户和用户组。
- `-R`：递归应用到该目录及其内部内容。
- `postgres:postgres`：冒号前是所属用户，冒号后是所属用户组。
- 把 `/data/postgres` 交给 `postgres` 用户及其用户组管理。因为容器里的 PostgreSQL 服务以 `postgres` 用户运行，它需要有权限读写自己的数据目录。
- redis 同上

### ENV 设置环境变量

```dockerfile
ENV PATH="/usr/lib/postgresql/17/bin:${PATH}" \
    TZ=Asia/Shanghai \
    DB_TYPE=postgresql \
    DB_HOST=127.0.0.1 \
    DB_PORT=5432 \
    DB_USERNAME=postgres \
    DB_DATABASE=needtech \
    REDIS_HOST=127.0.0.1 \
    REDIS_PORT=6379 \
    OLLAMA_HOST=http://host.docker.internal:11434 \
    APP_RELOAD=false \
    APP_ROOT_PATH=""
```

- 在 Linux/Unix 系统中，`PATH` 环境变量里面的多个路径之间，必须用英文冒号隔开，`${PATH}`：引用当前环境变量 `PATH` 原本的值

### ENTRYPOINT 声明容器启动时运行什么

```dockerfile
ENTRYPOINT ["/usr/local/bin/needtech-start"]
```

- Dockerfile 中的 `RUN` 和启动脚本 `start.sh` 中的命令，都包含创建数据目录和设置目录所属用户的操作。 Dockerfile 中的命令在构建镜像时执行，用于准备镜像内的目录；`start.sh` 中的命令在容器启动、数据卷挂载后执行，用于确保挂载后的目录存在并设置其所属用户。

```text
构建镜像时：
    准备好镜像内部的 /data/postgres

启动容器时：
    数据卷挂载到 /data/postgres
    ↓
    再设置挂载后目录本身的所属用户
```

## 参考链接

> 1. [Docker 的 Dockerfile 多阶段构建（Multi-Stage Build）实战：镜像体积瞬间缩小 80% 的秘密 - 知乎](https://zhuanlan.zhihu.com/p/1976604851686380657)
