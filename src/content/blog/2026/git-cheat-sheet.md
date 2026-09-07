---
title: "Git 常用命令速查"
description: "常用 Git 命令的速查笔记，覆盖基本流程、分支管理、版本回退、远程仓库、冲突处理等高频操作。"
pubDate: 2026-09-07
# updatedDate: 2026-09-07
category: 开发工具
tags: [Git, 版本控制, 速查]
draft: false
sticky: 0
# image: ""
# series: ""
# seriesOrder: 1
---

## 基本流程

**将存储库克隆到新目录：**

`git clone <repo> [<directory>]` 

会自动将远程仓库的地址添加为默认的远程地址，并将其命名为"origin"，`git remote add <name> <url>` 

**新建分支并设定追踪：**

`git switch -c dev origin/dev` 创建时建立联系

设置当前分支跟踪远程分支origin/dev `(--set-upstream)`

`git branch -u origin/dev` 

**add && commit：**

`git add file1 [file2]` 将指定文件添加到暂存区

`git commit -m "message"` 将暂存区内容提交到本地仓库

`git commit <file1> <file2> -m "message"` 只提交指定文件（仍须先 `git add`，并跳过其他已暂存内容）

**拉取分支：**

`git pull <remote> <branch>` 

从远程仓库（如 `origin`）拉取 `<branch>` 分支的更新，并将其合并到你当前的分支。

**推送分支：**

若已经指定了上游分支

`git push`

推送到远程新建分支

`git push <remote_name> <local_branch_name>:<new_remote_branch_name>`



**本地仓库推送到远程新建仓库步骤**

**在平台创建远程仓库**

**关联本地仓库和远程仓库：**

`git remote add origin <remote_repository_url>`

**初始提交：**

`git add .`
`git commit -m "Initial commit"`

**改个名：**

`git branch -M main`

**推送本地内容到远程仓库：**

`git push -u origin local_branch_name:remote_branch_name`

**完成推送**



## Git工作区、暂存区和版本库

![git_repo_layout](https://cdn.jsdelivr.net/gh/<your-github-username>/img_for_picGo@main/img/202404252357990.png)

- Workspace：工作区
- Index / Stage：暂存区
- Repository：版本库（或本地仓库）
- Remote：远程仓库

1. 工作区：就是你在电脑上看到的目录，比如目录下testgit里的文件(.git隐藏目录版本库除外)。或者以后需要再新建的目录文件等等都属于工作区范畴。

2. 版本库(Repository)：工作区有一个隐藏目录.git,这个不属于工作区，这是版本库。其中版本库里面存了很多东西，其中最重要的就是stage(暂存区)，还有Git为我们自动创建了第一个**分支**master,以及指向master的一个**指针HEAD**。
3. 我们前面说过使用Git提交文件到版本库有两步：
   1. 是使用 git add 把文件添加进去，实际上就是把文件添加到暂存区。
   2. 使用git commit提交更改，实际上就是把暂存区的所有内容提交到**当前分支**上。



## 创建仓库

**初始化仓库：**

`git init` 将这个目录变成Git可以管理的仓库

 **从现有Git仓库中拷贝项目(到指定目录)：**

`git clone <repo> [<directory>]` 

使用`git clone` 命令克隆一个项目时，Git会自动将远程仓库的地址添加为默认的远程地址，并将其命名为"origin"。这样做是为了方便你在将来与远程仓库进行交互，例如推送和拉取代码变更。克隆时自动将创建好的`main`分支追踪`origin/main`分支

## git config

`git config --global user.name "Your Name"`
`git config --global user.email "your.email@example.com"`



## 查看仓库状态

`git status` 显示当前工作目录下的文件状态，包括已修改、已暂存、未跟踪等情况。

- 已修改（modified）：文件已被修改，但还未被添加到暂存区。
- 已暂存（staged）：文件已被添加到暂存区，等待被提交到版本库。
- 未跟踪（untracked）：文件存在于工作目录中，但还未被 Git 跟踪。
- 无修改（nothing to commit）：工作目录中的文件与上次提交的版本相同，没有新的修改。

## 比较文件不同

+ `git diff ` **尚未缓存的改动** 当前工作区与暂存区
+ `git diff --cached` **已缓存的改动** 暂存区与最新提交（HEAD）
+ `git diff <commit>` 未缓存与指定提交
+ `git diff <commit> <commit>` 两个提交之间的差异
+ `git diff --stat` 显示改动摘要（文件列表 + 增减行数）
+ `git diff <file> ` 指定文件尚未缓存的改动 当前工作区与暂存区

## 添加文件到暂存区

`git add .` 将所有文件添加到暂存区

`git add file1 file2` 将指定文件添加到暂存区

`git add -A` 将工作区所有变更（含修改、新增、**删除**）添加到暂存区

## 提交暂存区内容到本地仓库

`git commit -m "message"` 将暂存区内容提交到本地仓库

`git commit <file1> <file2> -m "message"` 只提交指定文件（仍须先 `git add`，并跳过其他已暂存内容）

+ `-m "<message>"` 在命令行中直接提供提交信息
+ `-a` 自动暂存所有**已被跟踪**文件的修改与删除（不包含新增文件）后提交，等价于先 `git add -u` 再 commit
+ `-S` 提交时使用 GPG 签名
+ `-C <commit>`  使用指定信息提交 `git commit -C HEAD^` 

## Git撤销修改和删除文件操作

**直接修改**

+ 直接手动更改去掉那些需要的文件，然后add添加到暂存区，最后commit掉。

**恢复到暂存区的状态**

+ `git checkout -- readme.md` 将工作区的修改**丢弃**，恢复到**暂存区**中记录的版本（若文件未被修改且已提交过，则等价于恢复到最后一次提交的版本）。

> 提示：Git 2.23+ 更推荐用 `git restore readme.md` 替代 `git checkout -- readme.md`，语义更清晰（`--staged` 可同时丢弃暂存区的修改）。

**撤销已经提交内容**

+ 版本回退到指定版本 `git reset --hard HEAD^`（⚠️ 仅适用于**尚未推送到远程**的提交；若已推送且为共享分支，强制回退需 `git push --force-with-lease`，切忌对共享分支随意 reset）

**恢复删除内容**

+ 已提交：版本回退，因为 commit 会提交删除的结果
+ 未提交：假如已经删除了 b.txt 但尚未提交，`git checkout -- b.txt` b.txt 就回来了。

  ⚠️ 前提：b.txt 在被删除前**已加入过暂存区或已提交过**（即工作区的内容有历史可恢复）；若从未被 git 跟踪过，则无法用 git 找回，只能靠回收站或备份。

## 版本回退

**显示日志**

> 列出当前分支的提交历史，包括每个提交的哈希值、作者、提交日期、提交信息等信息。

+ `git log ` 显示详细的提交历史。
+ `git log --pretty=oneline` 以一行简洁的格式显示提交历史。
+ `git log --oneline` 更简洁

**查看版本号**

> 用于查看引用日志。用于恢复意外的操作、查找丢失的提交、了解引用的变更情况等。

+ `git reflog`：显示引用日志，包括 HEAD 的移动。

**版本回退**

+ `git reset --hard HEAD^` | `git reset --hard HEAD~1`
+ `git reset --hard <版本号>`

> 补充：`git reset` 默认是 `--mixed`，只重置 `HEAD` 和暂存区，工作区修改会保留；`--hard` 才连工作区一起丢掉。回退本地已提交但未推送的提交，也可用 `git reset --soft`（仅撤销 commit、保留修改）或 `--mixed` 避免误删工作区内容。



## 远程仓库

> SSH 链接提供了更高的安全性，特别是在需要对仓库进行写操作时，而 HTTP(S) 链接更加简单方便，适用于需要读取代码的场景。

**SSH方式**

**生成密钥**

密钥默认保存在 `~/.ssh` 目录（Windows 为 `C:\Users\<用户名>\.ssh`），文件名为**取决于算法**：ED25519 → `id_ed25519`（私钥，保密）/ `id_ed25519.pub`（公钥）；RSA → `id_rsa` / `id_rsa.pub`

`ssh-keygen -t ed25519 -C "your_email@example.com"`  ED25519类型密钥

```bash
$ ssh -T git@github.com
Hi <your-github-username>! You've successfully authenticated, but GitHub does not provide shell access.
```

**关联远程仓库**

`git remote` 是用来管理远程仓库的名称列表的命令。它允许你查看、添加、删除和重命名远程仓库。

+ `git remote add <name> <url>`：添加一个新的远程仓库，指定名称和 URL。

+ `git remote -v`：显示当前仓库中配置的所有远程仓库的详细信息，包括名称和 URL。
+ `git remote remove <name>`：移除指定名称的远程仓库。
+ `git remote rename <old-name> <new-name>`：将指定的远程仓库重命名。
+ `git remote set-url` 命令用于更改现有远程仓库的 URL。你可以使用它来更新远程仓库的 URL，例如，从 HTTPS 切换到 SSH 或者反之。

**具体操作：**

+ `git remote add origin git@github.com:<username>/testgit.git` 将你的本地 Git 仓库与远程 GitHub 仓库建立关联。origin 是你给远程仓库起的一个别名
+ `git remote set-url origin git@github.com:<username>/testgit.git` 将名为 `origin` 的远程仓库的 URL 从 HTTPS 更改为 SSH
+ `git branch -M main` 本地分支名字从默认的 master 改为 main

**推送到远程仓库**

`git push origin local_branch_name:remote_branch_name` :

若不指定远程仓库分支，那么 Git 将会将本地的 `local_branch_name` 分支推送到远程仓库的同名分支

**从远程仓库拉取**

`git pull <remote> <branch>` :

首先确认当前所在分支，其次确保与远程仓库相关联，最后运行git pull。其中 `<remote>` 是远程仓库的名称，`<branch>` 是要拉取的分支名称。

```bash
git pull origin main 
#从 origin 仓库拉取 main 分支的最新代码，并将其合并到你当前所在的分支中。
```



**2.使用https**

避免频繁输入账号密码，可使用个人访问令牌替代密码。

Git Credential Manager（GCM）可以在本地存储令牌，这样在之后的操作中无需重复输入。安装 GCM 后，当你第一次使用令牌时，它会提示你输入令牌并将其存储在安全的凭证存储中。

在 Git Bash 中运行以下命令以配置 Git 使用 GCM 作为凭证帮助器：

`git config --global credential.helper manager`



## 创建、合并与删除分支

1. `git branch` 查看所有分支
2. `git branch dev` 创建dev分支
3. `git branch -d dev` 删除dev分支
4. `git switch dev` 切换到dev分支，Git版本>2.23。等于 `git checkout dev`
5. `git merge dev` 合并指定分支到当前分支上。
6. 解决冲突：合并发生冲突时，选择保留的更改并删除冲突标记。

**具体操作：**

+ `git merge --no-ff -m "merge with no-ff" dev` 通常合并分支时，git 一般使用 “Fast forward” 模式，在这种模式下，删除分支后，会丢掉分支信息，现在我们来使用带参数 --no-ff 来禁用 “Fast forward” 模式。

+ `git checkout -b dev`  创建分支并切换到新分支上 等同于 `git switch -c dev`
+ `git checkout -b dev origin/dev` 这个命令创建了一个名为 `dev` 的新分支，并将其设置为跟踪远程仓库的 `origin/dev` 分支。



## 本地分支和远程分支建立追踪关系

> 如果不设置追踪关系，那么在使用 `git push` 和 `git pull` 命令时，你就需要显式地指定本地分支和远程分支的名称。

`git branch [-r][-a]` -r 显示远程分支，-a 所有

`git branch -u origin/dev` : 设置当前分支跟踪远程分支origin/dev `(--set-upstream)`

`git branch -vv` ：查看本地分支和远程分支的跟踪关系

`git checkout -b dev origin/dev` 创建时建立联系

`git push -u origin local_branch_name` 推送时建立跟踪关系



## 远程仓库的特定分支克隆到本地并进行跟踪

1. **克隆指定分支：**
   - 使用 `git clone -b <branch_name> <remote_repository_url>` 命令可以直接克隆远程仓库的指定分支到本地。
   - 这种方法会在本地创建一个新的分支，该分支名称与远程分支相同，并且该分支将与远程分支建立追踪关系。
   - 适用于只关心特定分支的情况，且不需要创建额外的本地分支。
2. **克隆默认分支后新建分支并设置追踪分支：**
   - `git clone <remote_repository_url>` 默认只把**远程默认分支**（如 main）检出为本地分支，但通过 `git branch -a` 可以看到所有远程分支。
   - 之后可用 `git checkout -b <local_branch_name> origin/<remote_branch_name>` 创建新本地分支并跟踪对应远程分支。
   - 这种方法可以自由命名本地分支，不一定要与远程分支同名。
3. **直接 pull 远程分支并创建跟踪分支：**
   - 在已经克隆了整个仓库的情况下，你可以使用 `git checkout -b <local_branch_name> origin/<remote_branch_name>` 命令直接从远程分支创建并切换到一个新的本地分支，同时设置其跟踪远程分支。
   - 这种方法适用于已经克隆了整个仓库，但只想创建并跟踪某个特定分支的情况。



## 拉取分支

> 拉取远程分支到本地

`git pull <remote> <branch>` ：

这会从远程仓库（如 `origin`）拉取 `<branch>` 分支的更新，并将其合并到你当前的分支。

`git fetch origin branch_name` ：

这会将远程仓库 `origin` 中的 `branch_name` 分支拉取到本地，并不自动合并到工作目录。使用`git diff origin/dev dev ` 比较后，使用merge 合并。



## 推送分支

> 推送本地分支到远程仓库

`git push origin local_branch_name:remote_branch_name` 

如果本地分支名与远程分支名相同，则可以省略冒号。

## Bug分支

> 在开发中，会经常碰到bug问题，那么有了bug就需要修复，在Git中，分支是很强大的，每个bug都可以通过一个临时分支来修复，修复完成后，合并分支，然后将临时的分支删除掉。
>
> 比如我在开发中接到一个 404 bug 时，我们可以创建一个 `issue-404` 临时分支来修复它，但是当前 `dev` 分支上的工作还没完成、无法提交（比如新功能还要 2 天做完，而 bug 需要 5 小时内修好）。这时可以用 `git stash` 把当前工作现场“隐藏起来”，等修完 bug 后再恢复现场继续开发。

1. `git stash` 隐藏工作现场，工作区回到干净状态（nothing to commit, working directory clean）
2. `git switch main`（或要修 bug 的分支）并 `git checkout -b issue-404` 创建临时分支解决问题
3. 修改 bug，add，commit
4. `git switch main`，`git merge --no-ff -m "merge bug fix 404" issue-404` 切换到主分支完成合并
5. 合并后主分支内容和 issue-404 一致，在 main 分支上删除 issue-404 分支
6. `git switch dev` 回到原分支，`git stash list` 查看之前隐藏的工作现场
7. `git stash pop` 恢复现场并自动删除该条 stash；若用 `git stash apply` 则保留 stash，需再用 `git stash drop` 手动删除（一次删一条）

## 合并与解决冲突

> 当你从远程库克隆时候，实际上Git自动把本地的main分支和远程的main分支对应起来了，并且远程库的默认名称是origin。查看远程库信息 `git remote -v` -v 参数 显示详细信息

**抓取分支**

1. 抓取分支：多人协作时，大家都会往main分支上推送各自的修改。现在我们可以模拟另外一个同事，可以在另一台电脑上（注意要把SSH key添加到GitHub上）或者同一台电脑上另外一个目录克隆，新建一个目录名字叫testgit2
2. `git clone https://github.com/username/testgit` 克隆整个项目
3. 使用`git clone`命令克隆一个项目时，Git会自动将远程仓库的地址添加为默认的远程地址，并将其命名为"origin"。这样做是为了方便你在将来与远程仓库进行交互，例如推送和拉取代码变更。
4. `git checkout -b dev origin/dev`  要在dev分支上做开发，就必须把远程的origin的dev分支到本地来，于是可以使用命令创建本地dev分支。

**推送冲突**

> 小伙伴已经向origin/dev分支上推送了提交，而我在我的目录文件下也对同样的文件同个地方作了修改，也试图推送到远程库时，就会发生冲突。

 1. `git push origin dev` >> `hint: Updates were rejected because the remote contains work that you do...` 发现冲突
  2. `git pull origin dev` >> `CONFLICT (content): Merge conflict in push.txt` pull 不能自动合并
  3. 手动解决冲突（编辑冲突标记 `<<<<<<<` / `=======` / `>>>>>>>` 后保留需要的内容），然后 `git add`、`git commit`
  4. `git push origin dev` 大功告成

+ `git push origin <local_branch_name>:<remote_branch_name>` 若不指定远程仓库分支，那么 Git 将会将本地的 `dev` 分支推送到远程仓库的同名分支
+ 当你执行 `git pull` 命令时，Git 会将远程仓库的最新更改拉取到你本地的仓库中。这个命令相当于 `git fetch` 和 `git merge` 的组合，它会先获取远程仓库的最新更改，然后将其合并到你当前所在的分支中。这样，你就可以保持你的本地仓库与远程仓库同步，并获取最新的代码更改。
+ `git fetch` 用于从远程仓库获取最新提交，更新本地仓库的远程跟踪分支，但不会自动合并到当前工作分支。

因此：多人协作工作模式一般是这样的：

- 首先，可以试图用 `git push origin branch_name` 推送自己的修改
- 如果推送失败，则是因为远程分支比你的本地更新，需要先用 `git pull` 尝试合并
- 如果合并有冲突，则需要解决冲突并在本地提交，再用 `git push origin branch_name` 推送

## 异同

**fetch 与 clone**

`clone` 是用来在本地创建一个远程仓库的拷贝。当你使用 `clone` 命令时，Git 会将整个远程仓库的历史记录、分支等信息都克隆到你的本地机器上。这个命令通常在你**第一次**获取某个项目的代码时使用。

`fetch` 是用来将远程仓库的**更新**拉取到你的本地仓库，但并不会自动合并到你的当前分支。它会将远程仓库中的所有分支更新到本地，并让你可以在本地查看远程仓库的最新状态。`fetch` **不会修改**你的**工作目录**或当前工作分支。



## 仓库出现异常

检查仓库完整性

`git fsck --full`



## Fork

**添加上游仓库（原始仓库）**

将原始仓库（上游仓库）添加为远程仓库，通常命名为 `upstream`：

```
git remote add upstream https://github.com/original-owner/repository-name.git
```

**获取上游仓库的更新**

定期从上游仓库获取最新的更新，以便你的 fork 仓库保持同步：

```
git fetch upstream
```

**切换到本地分支**

确保你在要更新的本地分支上操作：

```
git checkout your-branch-name
```

**合并或重新基于上游分支**

如果你的本地分支与上游分支有共同的历史，可以使用合并操作：

```
git merge upstream/main
```



假设现在你已经完成了上述步骤，并且想要将你的本地更改推送到你的 fork 的远程分支：

```
git push origin main
```

这将把你的本地 `main` 分支的更改推送到你 fork 的仓库中。前提是你之前已经使用过 `git push -u origin main` 或类似命令来设置远程分支的跟踪。



| `git reset --soft`  | 仅移动 `HEAD`，保留暂存区和工作区 | 撤销 `commit` 但保留修改 |
| ------------------- | --------------------------------- | ------------------------ |
| `git reset --mixed`（默认） | 重置 `HEAD` 和暂存区，保留工作区 | 撤销 `add`/`commit`，但保留工作区改动 |
| `git reset --hard`  | 彻底重置 `HEAD`、暂存区和工作区（丢失所有未提交修改） | 完全放弃当前更改 |

> `--merge` 模式主要用于 reset 目标与当前提交有差异时，保留工作区中与两侧无关的本地修改（较少用）；“合并冲突后安全回退”更常用的是 `git merge --abort`（放弃本次合并、恢复到合并前）。



## 场景：代码迁移

将代码从一个仓库提交到另一个仓库（尤其是不同远程仓库）通常涉及 **代码迁移、分支推送或子模块管理**。以下是几种常见场景和解决方案：

### 方法 1：直接推送分支到新仓库（保留历史）

**适用场景**：将代码从一个仓库的某个分支完整迁移到另一个新仓库，并保留提交历史。
​**​步骤​**​：

1. **克隆旧仓库**：

   ```
   git clone <旧仓库URL>
   cd <旧仓库目录>
   ```

2. **添加新仓库为远程地址**：

   ```
   git remote add new-origin <新仓库URL>
   ```

3. **推送分支到新仓库**：

   ```
   git push new-origin <分支名>  # 例如 git push new-origin main
   ```

------

### 方法 2：仅迁移代码（不保留历史）

**适用场景**：只需复制代码文件，不需要提交历史。
​**​步骤​**​：

1. **克隆旧仓库**：

   ```
   git clone <旧仓库URL>
   cd <旧仓库目录>
   ```

2. **删除旧仓库的.git文件夹**（清除Git关联）：

   ```
   rm -rf .git  # Windows系统用 rmdir /s /q .git
   ```

3. **初始化新仓库并提交**：

   ```
   git init
   git add .
   git commit -m "迁移代码到新仓库"
   ```

4. **关联新仓库并推送**：

   ```
   git remote add origin <新仓库URL>
   git push -u origin main
   ```



## 场景：移除文件跟踪但保留本地文件

```bash
git rm --cached ruoyi-fastapi-backend/.env.dev
```

作用
- 从 Git 版本控制中移除指定文件的跟踪
- 保留本地文件不被删除

适用场景

- 移除本应忽略的文件（如配置文件、环境变量文件）
- 需要保留本地配置但停止版本跟踪

后续操作
1. 提交变更：`git commit -m "停止跟踪.env.dev文件"`
2. 添加到.gitignore防止再次提交：



## 场景：未完成修改

场景：在本地main分支上有未完成的修改，想要把这些半成品推到云端的新分支，方便换电脑继续写，最后再把完整成果合入main

在旧电脑上：
git switch -c dev-feature
创建并切换到新分支，未完成的修改还在工作区

git add .
git commit -m "WIP: 开发中，待完善"
git push -u origin dev-feature
暂存、提交、推送新分支到云端并建立追踪

在新电脑上：
git fetch origin
git switch dev-feature

开发完成后使用 Squash 合并合入main：
1. 切换回 main 分支并拉取最新代码
  git switch main
    git pull origin main
2. 合并 dev-feature,但将所有提交压缩成一个干净的新提交
  git merge --squash dev-feature
    作用是压缩目标分支相对于共同祖先的新增提交
3. 提交这个最终完成的完整功能
git commit -m "feat: 完成某某功能开发"
4. 推送到云端 main
git push origin main

