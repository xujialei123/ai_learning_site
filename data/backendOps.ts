/** 服务器、网络、部署与运维——指挥 AI 上线必备（由 content.ts 合并进 backendGroups） */
export const backendOpsGroups = [
  {
    title: "Linux 服务器基础",
    intro: "云主机到手后你要会登录、看状态、改配置。指挥 AI 部署时，这些名词必须说得准。",
    items: [
      {
        name: "SSH 远程登录",
        desc: "用密钥或密码安全登录云服务器的标准方式。",
        oneLine: "本机 → 加密通道 → 远程 Linux，日常运维入口。",
        projectUse: "登录云主机装 Node、查日志、重启服务。",
        mistake: "别用 root 密码裸奔，优先密钥登录并禁用密码登录。",
        analogy: "像用专用钥匙进机房，密钥文件就是钥匙，丢了别人也能进。",
        keyPoints: [
          "ssh user@ip -i ~/.ssh/id_rsa",
          "公钥放服务器 ~/.ssh/authorized_keys，私钥留本机",
          "安全组/防火墙要放行 22 端口（可改成非标准端口）",
          "生产禁用 root 直登，用普通用户 + sudo"
        ],
        interviewQA: {
          question: "生产环境怎么安全登录服务器？",
          answer: "用 SSH 密钥认证，禁用密码登录；普通用户登录后 sudo；限制来源 IP 或加跳板机；定期轮换密钥，关掉不必要的开放端口。"
        },
        memoryTip: "公钥上服务器，私钥锁抽屉"
      },
      {
        name: "进程、端口与守护",
        desc: "服务跑在进程里，通过端口对外提供访问。",
        oneLine: "进程=正在跑的程序，端口=它对外的门牌号。",
        projectUse: "Next.js 占 3000，PostgreSQL 5432，Redis 6379，Nginx 80/443。",
        mistake: "端口被占用就起不来；别把数据库端口对公网全开。",
        keyPoints: [
          "查看：ps aux、ss -lntp / netstat -lntp、lsof -i :3000",
          "杀死：kill PID，顽固用 kill -9（慎用）",
          "守护进程：崩溃后自动拉起——PM2、systemd、Docker restart",
          "后台跑：nohup、systemd service、容器，别用裸 &"
        ],
        interviewQA: {
          question: "如何排查服务起不来？",
          answer: "看进程是否存在→端口是否监听→日志有无报错→依赖(DB/Redis)是否通→防火墙/安全组是否放行。常用 ss -lntp 和 journalctl/docker logs。"
        },
        memoryTip: "先看进程，再看端口，最后看日志"
      },
      {
        name: "文件系统与权限",
        desc: "Linux 文件归属、读写执行权限，部署脚本必懂。",
        oneLine: "谁拥有文件、谁能读/写/执行，配错了服务会挂或变不安全。",
        projectUse: "上传目录权限、.env 只能应用用户读、日志目录可写。",
        mistake: "chmod 777 图省事等于敞开大门。",
        keyPoints: [
          "rwx：读4 写2 执行1；如 644=所有者读写、其他人只读",
          "chown user:group file；chmod 600 .env",
          "目录要有 x 才能进入；脚本要有 x 才能执行",
          "上传目录与代码目录分离，应用用户最小权限"
        ],
        interviewQA: {
          question: "生产环境文件权限要注意什么？",
          answer: "密钥和 .env 用 600；代码目录属应用用户；禁止 777；上传目录单独挂载且不可执行脚本；容器内尽量非 root 用户运行。"
        },
        memoryTip: "密钥 600，代码属主对，千万别 777"
      },
      {
        name: "环境变量与配置",
        desc: "把密钥、数据库地址从代码里拆出去。",
        oneLine: "代码进 Git，秘密进环境变量或密钥管理。",
        projectUse: "DATABASE_URL、OPENAI_API_KEY、NODE_ENV=production。",
        mistake: "把 .env 提交到 Git；或本地和生产用同一套密钥。",
        keyPoints: [
          ".env.example 说明有哪些变量，.env 进 .gitignore",
          "启动时用 Zod 校验必填变量，缺了直接退出",
          "区分 development / staging / production",
          "云上用平台 Secrets（GitHub Secrets、K8s Secret、云厂商 KMS）"
        ],
        interviewQA: {
          question: "配置和密钥怎么管理？",
          answer: "环境变量注入，不进代码仓库；分环境配置；启动校验必填项；生产用密钥管理服务或 CI Secrets；日志禁止打印密钥全文。"
        },
        memoryTip: "代码公开，密钥私藏"
      },
      {
        name: "systemd / 服务管理",
        desc: "Linux 原生的服务启停与开机自启方式。",
        oneLine: "把 Node 应用注册成系统服务，开机自启、崩溃重启。",
        projectUse: "不用 Docker 时用 systemd 管 Node/PM2；Docker 本身也常由 systemd 拉起。",
        mistake: "只在 SSH 里手动 node 启动，一断线或重启服务就没了。",
        keyPoints: [
          "unit 文件：/etc/systemd/system/app.service",
          "systemctl start/stop/restart/status app",
          "enable 开机自启；journalctl -u app -f 看日志",
          "Restart=always + 环境变量 EnvironmentFile="
        ],
        interviewQA: {
          question: "不用 Docker 时怎么保证服务常驻？",
          answer: "写 systemd unit：WorkingDirectory、ExecStart、Restart=always、EnvironmentFile；enable 开机自启；用 journalctl 查日志。或用 PM2 + systemd 双保险。"
        },
        memoryTip: "systemctl 管生死，journalctl 看日志"
      },
      {
        name: "日志、磁盘与基础监控",
        desc: "磁盘满和日志爆是线上最常见的低级事故。",
        oneLine: "先保证磁盘不爆、日志能查、CPU/内存有曲线。",
        projectUse: "AI 日志、Nginx access、Docker 日志轮转。",
        mistake: "日志无限写满磁盘，整站 500。",
        keyPoints: [
          "df -h 看磁盘；du -sh * 找大目录",
          "logrotate 轮转；Docker 配 json-file max-size",
          "至少监控：CPU、内存、磁盘、进程存活",
          "云监控告警：磁盘 >85%、CPU 持续 >80%"
        ],
        interviewQA: {
          question: "线上突然 500，你先查什么？",
          answer: "健康检查与进程是否在→磁盘是否满→近期发布与错误日志→依赖 DB/Redis 是否通→流量是否突增。按「活着吗→资源够吗→依赖通吗→哪里报错」顺序排查。"
        },
        memoryTip: "磁盘先查，日志再挖，依赖最后确认"
      }
    ]
  },
  {
    title: "网络、域名与 HTTPS",
    intro: "用户怎么从浏览器找到你的服务：DNS、IP、端口、证书、反向代理。",
    items: [
      {
        name: "IP、端口、防火墙与安全组",
        desc: "机器的地址、服务的门牌、谁能进门。",
        oneLine: "IP 找机器，端口找服务，安全组决定谁能敲门。",
        projectUse: "云厂商安全组放行 80/443，数据库只允许内网或应用所在安全组。",
        mistake: "数据库 5432、Redis 6379 对 0.0.0.0/0 开放。",
        keyPoints: [
          "公网 IP vs 内网 IP；弹性公网 IP 可绑定解绑",
          "入站/出站规则：协议+端口+来源 CIDR",
          "最小开放：只开必要端口，DB 仅内网",
          "本机防火墙 ufw / firewalld 与云安全组要同时理解"
        ],
        interviewQA: {
          question: "云服务器安全组怎么配才安全？",
          answer: "80/443 对公网；SSH 限制运维 IP；数据库/Redis 不对公网，只放行应用安全组；出站按需；定期审计多余规则。"
        },
        memoryTip: "能不开就不开，DB 绝不对公网"
      },
      {
        name: "DNS 与域名解析",
        desc: "把域名转成 IP，用户才能访问你的站。",
        oneLine: "域名是绰号，DNS 告诉浏览器绰号对应哪台机器。",
        projectUse: "api.example.com → 负载均衡或 Nginx 公网 IP。",
        mistake: "改了解析立刻期望全球生效；TTL 未过会缓存旧 IP。",
        keyPoints: [
          "A 记录：域名→IPv4；AAAA→IPv6；CNAME→别名到另一域名",
          "TTL：缓存时间，改解析要等生效",
          "子域名：www / api / admin 可指向不同服务",
          "本地排查：dig、nslookup、ping"
        ],
        interviewQA: {
          question: "域名解析不生效怎么查？",
          answer: "查权威 DNS 记录是否正确→本机 dig/nslookup 看解析结果→确认 TTL→清本地/运营商缓存→确认源站 IP 与安全组。CDN 场景还要查回源配置。"
        },
        memoryTip: "A 指 IP，CNAME 指域名，TTL 决定等多久"
      },
      {
        name: "HTTPS 与 TLS 证书",
        desc: "加密传输，防窃听和中间人篡改。",
        oneLine: "HTTPS = HTTP + 证书加密；浏览器小锁靠它。",
        projectUse: "生产全站 HTTPS，Webhook/支付回调强制 HTTPS。",
        mistake: "证书过期没监控；混用 HTTP 资源导致不安全提示。",
        keyPoints: [
          "证书证明域名归属；Let's Encrypt 免费自动续期",
          "Nginx/Caddy/云负载均衡终止 TLS（卸证书）",
          "强制跳转 HTTP→HTTPS；开 HSTS",
          "到期前告警；通配符证书覆盖 *.example.com"
        ],
        interviewQA: {
          question: "HTTPS 是怎么工作的？证书放哪？",
          answer: "TLS 握手协商密钥后加密传输；证书由 CA 签发绑定域名。常见在 Nginx 或云 LB 终止 TLS，后端内网可走 HTTP。用 ACME 自动续期并监控过期。"
        },
        memoryTip: "证书挂在门口（Nginx/LB），内网可明文"
      },
      {
        name: "反向代理与正向代理",
        desc: "代理站在中间转发请求，方向不同用途不同。",
        oneLine: "反向代理藏后端；正向代理帮客户端出网。",
        projectUse: "Nginx 反向代理 Node；企业正向代理出网访问外网 API。",
        mistake: "把反向代理和负载均衡混为一谈——LB 常做在反向代理之上。",
        keyPoints: [
          "反向：用户→Nginx→多个应用实例",
          "正向：内网机器→代理→外网",
          "反向代理还能：SSL 终止、静态资源、限流、改 Header",
          "X-Forwarded-For / X-Real-IP 传递真实客户端 IP"
        ],
        interviewQA: {
          question: "为什么生产要用 Nginx 而不是直接暴露 Node？",
          answer: "Nginx 做 SSL、静态资源、负载均衡、缓冲、限流更成熟；Node 专注业务。直接暴露 Node 缺统一入口，证书和多实例难管。"
        },
        memoryTip: "反代挡在前，Node 藏后面"
      },
      {
        name: "CDN 与静态资源加速",
        desc: "把静态文件缓存在离用户近的节点。",
        oneLine: "图片/JS/CSS 走 CDN，源站少扛流量。",
        projectUse: "前端构建产物、知识库公开图片、文档附件下载。",
        mistake: "动态 API 也甩给 CDN 又不懂缓存键，会返回错用户的数据。",
        keyPoints: [
          "静态可长缓存；HTML 常短缓存或不缓存",
          "缓存刷新/版本号（文件名带 hash）更新资源",
          "回源：节点没有时回源站拉取",
          "动态接口默认不要 CDN 缓存，除非明确规则"
        ],
        interviewQA: {
          question: "静态资源和 API 的缓存策略有何不同？",
          answer: "静态资源用 CDN + 长 Cache-Control + 文件名 hash；API 默认 no-store 或不缓存，个性化响应绝对不能被共享缓存。HTML 入口文件通常短缓存以便发布生效。"
        },
        memoryTip: "静态进 CDN，动态慎缓存"
      },
      {
        name: "内网、VPC 与服务发现",
        desc: "云上网络隔离与服务怎么找到彼此。",
        oneLine: "VPC 是你的私有园区，服务用内网名通信更安全。",
        projectUse: "应用和数据库同一 VPC，只应用有公网入口。",
        mistake: "所有服务都绑公网 IP，攻击面巨大。",
        keyPoints: [
          "VPC / 子网 / 路由表 / 安全组构成云网络",
          "公有子网有公网出口，私有子网通过 NAT 出网",
          "服务发现：DNS 名、K8s Service、Docker Compose 服务名",
          "数据库只听内网地址"
        ],
        interviewQA: {
          question: "生产网络怎么分层？",
          answer: "公网只暴露负载均衡/Nginx；应用与 DB 在私有子网；DB 无公网；跨可用区部署提高容灾；安全组按角色最小放行。"
        },
        memoryTip: "公网只留大门，仓库在内院"
      }
    ]
  },
  {
    title: "Docker 与容器化",
    intro: "把应用和依赖打成镜像，在任何机器上一致运行——指挥 AI 写 Dockerfile 的基础。",
    items: [
      {
        name: "镜像、容器、仓库",
        desc: "Docker 三件套：Image / Container / Registry。",
        oneLine: "镜像是菜谱，容器是炒好的菜，仓库是外卖柜。",
        projectUse: "构建 app 镜像推到 Docker Hub 或云镜像仓库，服务器拉取运行。",
        mistake: "在容器里改数据却不挂卷，一删容器数据全没。",
        keyPoints: [
          "docker build → image；docker run → container",
          "docker push/pull 与 Registry（GHCR、阿里云 ACR）",
          "tag 用语义版本或 git sha，别只用 latest",
          "数据持久化用 Volume / 绑定挂载"
        ],
        interviewQA: {
          question: "镜像和容器有什么区别？",
          answer: "镜像是只读模板（代码+依赖+配置层）；容器是镜像的运行实例，有可写层。同一镜像可起多个容器。持久数据必须挂卷，不能只写容器内文件系统。"
        },
        memoryTip: "镜像只读，容器可跑，数据要挂卷"
      },
      {
        name: "Dockerfile 多阶段构建",
        desc: "用多阶段减小镜像、加快构建、少带构建工具。",
        oneLine: "编译阶段用大镜像，运行阶段只拷产物到瘦镜像。",
        projectUse: "Node 项目 builder 装依赖编译，runner 用 node:slim 只跑 dist。",
        mistake: "把 node_modules 开发依赖和 .env 打进最终镜像。",
        keyPoints: [
          "FROM node AS builder → 构建；FROM node:slim → 复制产物",
          ".dockerignore 排除 node_modules、.git、.env",
          "非 root USER；只暴露必要端口",
          "层缓存：先 copy package.json 再 npm i，再 copy 源码"
        ],
        interviewQA: {
          question: "怎么写一个生产级 Node Dockerfile？",
          answer: "多阶段构建；.dockerignore；生产只装 dependencies；非 root 运行；HEALTHCHECK；环境变量运行时注入；标签用 git sha；镜像尽量基于 slim/alpine 并修漏洞。"
        },
        memoryTip: "先装依赖再拷代码，最终镜像要瘦"
      },
      {
        name: "docker compose 本地编排",
        desc: "一文件启动 app + postgres + redis 等整套依赖。",
        oneLine: "开发环境一条命令拉起整栈。",
        projectUse: "docker compose up 起本站依赖的 PostgreSQL、Redis、MinIO。",
        mistake: "把 compose 当生产编排（小项目可以，复杂要用 K8s/云服务）。",
        keyPoints: [
          "services / networks / volumes 三段",
          "服务名即 DNS 名：postgres:5432",
          "depends_on 只保证启动顺序，不保证就绪——要 healthcheck",
          "env_file 与 ports 映射"
        ],
        interviewQA: {
          question: "docker compose 和 Kubernetes 怎么选？",
          answer: "单机/本地/小团队用 compose 足够；要多机调度、自愈、滚动发布、配额用 K8s 或云托管容器服务。别为了用 K8s 而用 K8s。"
        },
        memoryTip: "本地 compose，上规模再 K8s"
      },
      {
        name: "容器网络与数据卷",
        desc: "容器怎么互联、数据怎么持久。",
        oneLine: "同网络用服务名互访；要留住的数据必须挂卷。",
        projectUse: "app 容器连 postgres 容器；上传文件挂到主机目录或对象存储。",
        mistake: "数据库数据写在容器可写层，升级容器丢库。",
        keyPoints: [
          "bridge 网络默认；服务名解析",
          "命名卷 vs 绑定挂载（开发常用绑定）",
          "数据库、上传目录必须卷或外部存储",
          "权限：容器内 UID 与宿主机卷权限要对齐"
        ],
        interviewQA: {
          question: "容器里数据库数据怎么保证不丢？",
          answer: "Postgres 数据目录挂命名卷或云盘；定期备份；生产更推荐托管数据库（RDS），容器只跑无状态应用。"
        },
        memoryTip: "无状态进容器，有状态进卷或云 DB"
      },
      {
        name: "健康检查与重启策略",
        desc: "容器挂了自动拉起，不健康就别接流量。",
        oneLine: "HEALTHCHECK 探活，restart 策略决定崩了怎么办。",
        projectUse: "Docker HEALTHCHECK curl /health；restart: unless-stopped。",
        mistake: "健康检查打太重的业务 SQL，拖垮数据库。",
        keyPoints: [
          "HEALTHCHECK CMD curl -f http://localhost:3000/health",
          "restart: always / unless-stopped / on-failure",
          "与编排层 readiness 配合，不健康不进负载",
          "探活要轻、要超时、要失败阈值"
        ],
        interviewQA: {
          question: "容器健康检查怎么设计？",
          answer: "轻量 HTTP /health；区分 liveness（活着）与 readiness（能接流量）；检查依赖要超时；失败若干次再重启；避免重查询。编排层据此摘流量。"
        },
        memoryTip: "探活要轻，重启要稳"
      }
    ]
  },
  {
    title: "Nginx 与流量入口",
    intro: "生产最常见的流量大门：反向代理、负载均衡、静态站点、HTTPS。",
    items: [
      {
        name: "Nginx 反向代理实战",
        desc: "把 80/443 流量转给后面的 Node/容器。",
        oneLine: "用户打到 Nginx，Nginx 再 proxy_pass 到 127.0.0.1:3000。",
        projectUse: "api.xxx.com → Node API；www → 静态或 Next。",
        mistake: "忘记配 client_max_body_size，大文件上传 413。",
        keyPoints: [
          "server { listen 80; server_name; location / { proxy_pass } }",
          "必传 Host、X-Real-IP、X-Forwarded-For、X-Forwarded-Proto",
          "上传调大 client_max_body_size",
          "SSE 要关 proxy_buffering、拉长超时"
        ],
        interviewQA: {
          question: "Nginx 反代 Node 要注意哪些配置？",
          answer: "正确转发 Header；WebSocket 要 Upgrade；SSE 关缓冲并加长 read timeout；上传调 body size；上游用 upstream 做多实例；错误页与访问日志分开。"
        },
        memoryTip: "Header 要传全，上传要放大，流式关缓冲"
      },
      {
        name: "负载均衡 upstream",
        desc: "多个应用实例轮流接请求。",
        oneLine: "upstream 里挂多个后端，挂一个其余顶上。",
        projectUse: "3 个 Node 容器 :3001/:3002/:3003 轮询。",
        mistake: "无健康检查，挂掉的实例还在进流量 → 大量 502。",
        keyPoints: [
          "upstream app { server 127.0.0.1:3001; server ... }",
          "策略：轮询、权重、least_conn、ip_hash",
          "max_fails + fail_timeout 摘除坏节点",
          "应用必须无状态，会话放 Redis"
        ],
        interviewQA: {
          question: "Nginx 负载均衡如何摘除故障节点？",
          answer: "upstream 配 max_fails 与 fail_timeout；或主动健康检查模块；应用提供 /health；配合无状态设计。云 LB 用健康检查路径自动摘除。"
        },
        memoryTip: "多实例 + 健康检查，才叫真负载均衡"
      },
      {
        name: "静态站点与缓存头",
        desc: "Nginx 直接托管前端构建产物。",
        oneLine: "root/alias 指到 dist，配 gzip 与缓存头。",
        projectUse: "SPA 的 try_files 回退 index.html；带 hash 的 JS 长缓存。",
        mistake: "所有文件都 no-cache，或 HTML 也缓存一年导致用户看不到新版本。",
        keyPoints: [
          "try_files $uri /index.html 支持前端路由",
          "gzip / brotli 压缩文本",
          "带 hash 资源 Cache-Control: max-age=31536000, immutable",
          "index.html 短缓存或协商缓存"
        ],
        interviewQA: {
          question: "前端发版后用户还是旧页面怎么办？",
          answer: "构建产物文件名带 content hash；HTML 不长期缓存；必要时 CDN 刷新；Service Worker 要有更新策略。根因通常是 HTML 或 SW 缓存过猛。"
        },
        memoryTip: "HTML 短缓存，带 hash 的资源长缓存"
      },
      {
        name: "限流、防盗链与基础防护",
        desc: "在入口挡掉一部分滥用流量。",
        oneLine: "Nginx 也能限速、挡盗链，减轻应用压力。",
        projectUse: "登录接口限速；防别的站盗用图片带宽。",
        mistake: "只靠 Nginx 限流就以为安全——应用层还要鉴权与业务限流。",
        keyPoints: [
          "limit_req_zone 按 IP 限 QPS",
          "valid_referers 防盗链（可绕过，仅减损）",
          "隐藏版本号；限制方法；挡常见扫描路径",
          "真正安全靠应用鉴权 + WAF + 业务限流"
        ],
        interviewQA: {
          question: "入口层和应用层限流如何配合？",
          answer: "Nginx/网关挡恶意洪峰与全局限速；应用层按用户/租户/接口精细限流（Redis）。入口粗、应用细，两层都要，并返回 429。"
        },
        memoryTip: "入口挡洪水，应用管账号"
      }
    ]
  },
  {
    title: "云部署与发布流程",
    intro: "从本地能跑到公网可访问：选云、买机、发版、回滚、看监控。",
    items: [
      {
        name: "部署形态选型",
        desc: "Vercel / 云主机 / 容器服务 / Serverless 怎么选。",
        oneLine: "简单前端走平台；要控进程和队列，上云主机或容器。",
        projectUse: "Next 静态+SSR 可用 Vercel；带 Worker/长连接更适合 Docker 上云主机或 K8s。",
        mistake: "所有东西都 Serverless，长任务和 WebSocket 踩坑。",
        keyPoints: [
          "PaaS（Vercel/Railway）：快，少运维，定制少",
          "云主机 + Docker：可控，适合中小后端",
          "容器服务 / K8s：规模化、多服务",
          "Serverless 函数：事件驱动、短请求；冷启动与超时要懂"
        ],
        interviewQA: {
          question: "全栈 AI 项目怎么选部署方式？",
          answer: "前端+轻 API 可用 Vercel；RAG Worker、队列、长 SSE 建议容器或云主机常驻进程；数据库用托管 RDS；对象存储用 OSS/S3。按「有没有长任务/常驻进程」决定。"
        },
        memoryTip: "有 Worker 就别纯 Serverless"
      },
      {
        name: "环境分层与发布流水线",
        desc: "dev → test → staging → prod，流水线自动推进。",
        oneLine: "代码合入后自动测，测过再部署，生产最好人工点一下。",
        projectUse: "GitHub Actions：lint→test→build image→deploy staging。",
        mistake: "开发直接推生产；没有回滚镜像 tag。",
        keyPoints: [
          "分支策略：main 保护，PR 必过 CI",
          "镜像 tag = git sha，随时回滚",
          "secret 分环境；生产审批",
          "迁移：先兼容性 DB 变更，再发应用"
        ],
        interviewQA: {
          question: "一套最小可用的 CI/CD 长什么样？",
          answer: "PR 跑 lint+测试；合并后构建镜像并推仓库；自动部署测试环境；生产手动/审批部署；失败通知；保留上一版本镜像可一键回滚。"
        },
        memoryTip: "CI 保质量，CD 保交付，tag 保回滚"
      },
      {
        name: "零停机与回滚",
        desc: "发版用户无感，出问题快速撤回。",
        oneLine: "先起新再切流量，不行立刻切回旧版本。",
        projectUse: "滚动更新两个容器；DNS/上游切换；数据库向前兼容。",
        mistake: "先停旧再起新造成空窗；不兼容的 DB 变更导致无法回滚。",
        keyPoints: [
          "滚动/蓝绿/金丝雀三种思路",
          "回滚=重新部署旧镜像 tag",
          "DB 变更要可前进兼容（expand/contract）",
          "发版时盯错误率与延迟面板"
        ],
        interviewQA: {
          question: "如何做到发版可回滚？",
          answer: "应用无状态+镜像不可变；DB 先加后删（扩展/收缩模式）；配置可回滚；监控对比；回滚演练过。禁止只在服务器上手工改文件。"
        },
        memoryTip: "镜像可回滚，库表要兼容"
      },
      {
        name: "托管数据库与对象存储",
        desc: "生产数据优先用云托管，而不是自己在容器里硬撑。",
        oneLine: "RDS 管备份高可用，OSS 管文件，应用保持无状态。",
        projectUse: "阿里云 RDS PostgreSQL + OSS；或 AWS RDS + S3。",
        mistake: "生产数据库跑在同一台应用机的 Docker 里且无备份。",
        keyPoints: [
          "托管 DB：自动备份、监控、主从",
          "连接串走内网；强密码；限制来源",
          "对象存储：私有读 + 签名 URL",
          "定期恢复演练，验证备份可用"
        ],
        interviewQA: {
          question: "为什么生产推荐托管数据库？",
          answer: "备份、补丁、故障切换、监控由云厂商承担，降低运维风险。应用无状态可随意扩缩，数据层专业托管更稳。自建库要有专人负责备份与高可用。"
        },
        memoryTip: "应用可扔，数据要托管"
      },
      {
        name: "Kubernetes 核心概念（入门）",
        desc: "容器编排主流：Pod、Deployment、Service、Ingress。",
        oneLine: "K8s 负责多机上跑容器、重启、扩缩、暴露服务。",
        projectUse: "大团队多服务部署；小项目懂概念即可，不必强上。",
        mistake: "三人小团队一上来全套 K8s，运维成本高于业务。",
        keyPoints: [
          "Pod：最小调度单位；Deployment：声明副本与更新",
          "Service：稳定虚拟 IP 访 Pod；Ingress：HTTP 入口",
          "ConfigMap/Secret 配置；PVC 存数据",
          "HPA 按 CPU/QPS 自动扩缩"
        ],
        interviewQA: {
          question: "Deployment 和 Service 分别干什么？",
          answer: "Deployment 管理 Pod 副本数与滚动更新；Service 给一组 Pod 提供稳定访问地址与负载均衡；Ingress 在入口做域名/路径路由和 TLS。三者配合完成对外服务。"
        },
        memoryTip: "Pod 跑实例，Deploy 管副本，Service 给地址"
      },
      {
        name: "可观测上线清单",
        desc: "没日志、没指标、没告警的上线等于裸奔。",
        oneLine: "上线当天就要能：看到错、看到慢、收到吵。",
        projectUse: "错误日志 + QPS/延迟面板 + 磁盘/CPU 告警 + 值班人。",
        mistake: "上线后才想「出了事找谁、看哪」。",
        keyPoints: [
          "日志：结构化 + requestId",
          "指标：错误率、P99、队列积压、Token 成本",
          "告警：分页到人，避免噪音",
          "runbook：常见故障处理步骤"
        ],
        interviewQA: {
          question: "服务上线你要准备哪些可观测性？",
          answer: "结构化日志与链路 ID；黄金指标仪表盘；关键业务告警；健康检查；错误预算或至少值班响应；故障手册。上线验收包含「人造故障能否在 5 分钟内定位」。"
        },
        memoryTip: "能看见、能告警、有人管"
      }
    ]
  },
  {
    title: "后端通信与架构名词",
    intro: "和 AI 说话时高频出现的架构词：同步异步、RPC、消息、网关、BFF……",
    items: [
      {
        name: "同步 vs 异步 vs 并发",
        desc: "调用方式与执行重叠的基本语言。",
        oneLine: "同步干完再返回；异步先收条再慢慢做；并发是同时推进多个。",
        projectUse: "上传接口同步返回「已接受」，解析异步进队列。",
        mistake: "把「异步」当成「多线程」；Node 并发主要靠事件循环。",
        keyPoints: [
          "同步：调用方等待结果",
          "异步：立即返回，完成后再通知（回调/Promise/消息）",
          "并发：同一时段多个任务在推进；并行：多核同时算",
          "IO 密集适合并发异步；CPU 密集要真并行（多进程）"
        ],
        interviewQA: {
          question: "接口为什么经常做成异步？",
          answer: "慢任务（解析、Embedding、发邮件）放队列，接口快速返回任务 ID，避免超时和阻塞连接。用户可轮询或 Webhook/SSE 拿结果。要配套幂等、重试和状态查询。"
        },
        memoryTip: "接口快返回，慢活进队列"
      },
      {
        name: "RPC / gRPC",
        desc: "服务之间像调本地函数一样调远程方法。",
        oneLine: "REST 面向资源；RPC 面向「调用哪个方法」。",
        projectUse: "内部微服务高性能通信；对外仍常用 REST/JSON。",
        mistake: "对浏览器直接暴露 gRPC（需 gRPC-Web 或网关）。",
        keyPoints: [
          "gRPC 基于 HTTP/2 + Protobuf，性能好、强类型",
          "适合服务间；公网 API 仍多 REST",
          "要做超时、重试、负载均衡、鉴权",
          "合同（.proto）即接口文档"
        ],
        interviewQA: {
          question: "REST 和 gRPC 怎么选？",
          answer: "对外、浏览器、第三方用 REST/JSON；内部高 QPS、强类型、流式用 gRPC。团队熟悉度和生态也是因素。BFF 常 REST 对外、gRPC 对内。"
        },
        memoryTip: "对外 REST，对内可 gRPC"
      },
      {
        name: "GraphQL 基础",
        desc: "客户端按需取字段，减少过取与欠取。",
        oneLine: "一个端点，查询长什么样数据就长什么样。",
        projectUse: "复杂管理后台多视图聚合；移动端省流量。",
        mistake: "简单 CRUD 强上 GraphQL，缓存与权限更复杂。",
        keyPoints: [
          "Query 读、Mutation 写、Subscription 订阅",
          "Schema 强类型；N+1 要用 DataLoader",
          "权限要到字段级；防恶意深层查询",
          "与 REST 可共存，不是非此即彼"
        ],
        interviewQA: {
          question: "GraphQL 的主要坑是什么？",
          answer: "N+1 查询、复杂权限、缓存难、查询复杂度攻击。适合多端差异大的读模型；简单资源型 API 用 REST 更直接。"
        },
        memoryTip: "按需取数爽，权限缓存要想好"
      },
      {
        name: "API 网关与 BFF",
        desc: "统一入口与「为前端定制的后端」。",
        oneLine: "网关管流量与鉴权；BFF 为某个前端聚合数据。",
        projectUse: "网关做限流鉴权；管理台 BFF 聚合多个内部服务。",
        mistake: "把所有业务逻辑堆进网关，变成难测的大泥球。",
        keyPoints: [
          "网关：路由、SSL、鉴权、限流、日志",
          "BFF：Backend for Frontend，按端定制 API",
          "网关保持薄；业务在服务里",
          "Next.js Route Handlers 常充当轻量 BFF"
        ],
        interviewQA: {
          question: "什么是 BFF？和 API 网关区别？",
          answer: "BFF 是为特定前端（Web/App）定制的聚合层，减少前端拼装。网关是通用入口治理。BFF 有业务聚合；网关偏横向能力。Next API 路由经常扮演 BFF。"
        },
        memoryTip: "网关管大门，BFF 为前端定制菜单"
      },
      {
        name: "消息驱动与事件驱动",
        desc: "用消息/事件解耦服务，而不是同步硬调。",
        oneLine: "我发一件事到总线，谁关心谁自己处理。",
        projectUse: "文档上传完成 → 发事件 → 解析 Worker 与通知服务各自消费。",
        mistake: "当成远程过程调用却不处理重复与乱序。",
        keyPoints: [
          "队列：任务分发；发布订阅：多消费者通知",
          "至少一次投递 → 消费者必须幂等",
          "事件命名过去式：DocUploaded",
          "最终一致性：接受短暂不同步"
        ],
        interviewQA: {
          question: "事件驱动要注意什么？",
          answer: "幂等消费、顺序（分区键）、死信、监控积压、schema 演进。不要假设只送达一次。复杂事务用 Outbox/Saga，而不是分布式强一致硬刚。"
        },
        memoryTip: "发事件解耦，收事件幂等"
      },
      {
        name: "单体、模块化单体与微服务",
        desc: "架构拆分程度的选择，不是越碎越好。",
        oneLine: "先做好模块化单体，真痛了再拆服务。",
        projectUse: "AI 客服早期单体；流量大了再拆「检索服务」「对话服务」。",
        mistake: "三人团队上十个微服务，调试与部署拖垮节奏。",
        keyPoints: [
          "单体：简单、事务好做、部署一个包",
          "模块化单体：目录按领域拆，进程仍一个",
          "微服务：独立部署扩展，代价是分布式复杂",
          "拆分信号：团队边界、独立扩展、发布频率冲突"
        ],
        interviewQA: {
          question: "什么时候该拆微服务？",
          answer: "模块边界清晰、有独立扩展/发布需求、团队能承担分布式成本时。默认模块化单体。拆前先定义数据边界与同步方式，忌为简历而拆。"
        },
        memoryTip: "默认单体模块化，痛了再拆"
      }
    ]
  },
  {
    title: "指挥 AI 写后端：说法对照",
    intro: "把你的自然语言需求，映射成 AI 听得懂的后端术语——指挥效率直接取决于你会不会「点名」。",
    items: [
      {
        name: "先定接口契约",
        desc: "动手写代码前，先让 AI 输出路径、字段、错误码。",
        oneLine: "先契约后实现：Method、路径、请求体、响应、错误码。",
        projectUse: "「先写 OpenAPI/DTO，我确认后再实现 Controller」。",
        mistake: "直接说「帮我写个上传」——AI 会猜字段，后期大改。",
        keyPoints: [
          "说清：资源名、鉴权否、分页否、幂等否",
          "要求：Zod schema + 示例 JSON",
          "约定统一响应 { code, message, data, requestId }",
          "确认后再生成分层代码"
        ],
        memoryTip: "契约确认前，不写业务代码",
        interviewQA: {
          question: "为什么强调接口契约？",
          answer: "契约是前后端与 AI 的共同语言。先定 DTO/OpenAPI 能减少返工，也方便生成测试与文档。生产协作同样是契约优先。"
        }
      },
      {
        name: "点名分层与文件位置",
        desc: "告诉 AI 改哪一层，避免一团逻辑塞进 route.ts。",
        oneLine: "Controller 接参，Service 做事，Repository 访库——请按这三层改。",
        projectUse: "「校验放 DTO，事务在 Service，别在 Controller 写 SQL」。",
        mistake: "只说「实现这个功能」不说分层，AI 常写成意大利面。",
        keyPoints: [
          "明确：不要把业务写进 Controller",
          "外部服务走 Provider 接口",
          "多租户查询必须带 merchant_id",
          "指出目录：src/modules/knowledge/..."
        ],
        memoryTip: "点名层级 + 点名目录 = 少返工",
        interviewQA: {
          question: "如何让 AI 生成可维护的后端代码？",
          answer: "提供分层约定、目录结构、统一错误与响应、示例代码风格；要求补测试与日志字段；禁止密钥进代码。评审 diff 再合并。"
        }
      },
      {
        name: "点名非功能需求",
        desc: "性能、安全、可观测往往要你主动提，AI 不会默认做全。",
        oneLine: "限流、超时、幂等、日志、权限——要写进指令里。",
        projectUse: "「AI 接口每用户 20 次/分钟；超时 60s；失败记 error 日志带 requestId」。",
        mistake: "只描述功能，上线才发现没限流被刷爆。",
        keyPoints: [
          "安全：鉴权、RBAC、防注入、脱敏",
          "稳定：超时、重试、熔断、幂等",
          "成本：AI 调用限流与用量日志",
          "可观测：结构化日志字段列表"
        ],
        memoryTip: "功能是骨架，非功能是钢筋",
        interviewQA: {
          question: "后端需求除了功能还要说清什么？",
          answer: "QPS/延迟目标、鉴权模型、幂等、限流、数据隔离、日志与指标、失败降级。这些决定能不能上线，面试也爱问。"
        }
      },
      {
        name: "点名部署与运行环境",
        desc: "让 AI 输出能落地的 Dockerfile/Compose/Nginx，而不是只给本地脚本。",
        oneLine: "说清：Docker 还是 PM2、有无 Nginx、环境变量列表、健康检查路径。",
        projectUse: "「补 Dockerfile 多阶段 + compose（app/postgres/redis）+ Nginx 反代示例」。",
        mistake: "默认 AI 知道你的云厂商和域名——要你补充。",
        keyPoints: [
          "目标平台：云主机 / Vercel / K8s",
          "需要哪些服务：DB/Redis/OSS",
          "域名与 HTTPS 谁终止",
          "要求：.env.example 与部署 README"
        ],
        memoryTip: "部署指令越具体，生成物越能跑",
        interviewQA: {
          question: "交付后端时部署文档应包含什么？",
          answer: "环境变量、依赖服务、构建运行命令、健康检查、反向代理要点、回滚方式、日志位置。最好附 compose 或流水线示例。"
        }
      },
      {
        name: "验收标准怎么写给 AI",
        desc: "用可检查的条件代替「做好一点」。",
        oneLine: "完成标准要可测：测例、状态码、边界、禁止事项。",
        projectUse: "「未登录 401；跨租户 403；重复提交不建双份；单测覆盖 Service」。",
        mistake: "「优化一下性能」——没有指标 AI 无法收敛。",
        keyPoints: [
          "Given/When/Then 或测试用例列表",
          "明确不做：不改无关模块、不升级大版本依赖",
          "要求跑通的命令：npm test / curl 示例",
          "让 AI 自检后再提交 diff"
        ],
        memoryTip: "可测的才叫完成",
        interviewQA: {
          question: "如何验收一个后端接口？",
          answer: "正常路径、鉴权失败、参数错误、权限/越权、幂等重复、依赖失败降级；看状态码与响应体；看日志字段；有自动化测试更佳。"
        }
      }
    ]
  }
];

/** 服务器 / 部署 / 架构 术语速查（补充进 glossary） */
export const backendOpsGlossary: { term: string; desc: string }[] = [
  { term: "SSH", desc: "Secure Shell，加密远程登录服务器的协议。日常用 ssh user@ip 登录云主机。" },
  { term: "安全组", desc: "云厂商的虚拟防火墙，按端口和 IP 控制进出流量。数据库不要对 0.0.0.0/0 开放。" },
  { term: "VPC", desc: "Virtual Private Cloud，云上的私有隔离网络。应用和数据库通常放同一 VPC 内网互通。" },
  { term: "公网 IP / 内网 IP", desc: "公网可被互联网访问；内网仅 VPC 内互通。数据库优先只绑内网 IP。" },
  { term: "DNS", desc: "域名系统，把 example.com 解析成 IP。常见记录：A、AAAA、CNAME。" },
  { term: "TTL", desc: "DNS 缓存时间。TTL 越长解析变更生效越慢。" },
  { term: "TLS / SSL", desc: "传输层加密协议。HTTPS 就是 HTTP over TLS。证书由 CA 签发。" },
  { term: "CA", desc: "证书颁发机构。Let's Encrypt 提供免费证书并支持自动续期。" },
  { term: "反向代理", desc: "代理服务器接收公网请求再转给内部应用。Nginx 最常见。" },
  { term: "正向代理", desc: "代理客户端访问外网，常见于公司出口。与反向代理方向相反。" },
  { term: "负载均衡", desc: "把流量分到多台实例。可用 Nginx upstream 或云负载均衡器（ALB/CLB/SLB）。" },
  { term: "CDN", desc: "内容分发网络，把静态资源缓存到边缘节点，加速访问、减轻源站压力。" },
  { term: "回源", desc: "CDN 节点没有缓存时，回源站拉取资源的过程。" },
  { term: "镜像 Image", desc: "Docker 中只读的应用打包模板，含代码、运行时与依赖。" },
  { term: "容器 Container", desc: "镜像的运行实例。可起停删除；持久数据需挂卷。" },
  { term: "Registry", desc: "镜像仓库，如 Docker Hub、GHCR、阿里云 ACR。用于 push/pull 镜像。" },
  { term: "Volume", desc: "Docker 数据卷，让容器数据落在宿主机或云盘，避免删容器丢数据。" },
  { term: "Dockerfile", desc: "描述如何构建镜像的脚本。生产常用多阶段构建减小体积。" },
  { term: "docker compose", desc: "用 YAML 定义多容器应用，一条命令启动 app+db+redis。" },
  { term: "HEALTHCHECK", desc: "容器健康检查指令。不健康时可配合编排摘流量或重启。" },
  { term: "systemd", desc: "Linux 服务管理器。systemctl 启停服务，journalctl 看日志。" },
  { term: "守护进程 Daemon", desc: "在后台长期运行的进程。生产服务都应被 systemd/PM2/容器托管。" },
  { term: "端口 Port", desc: "主机上区分服务的数字门牌。HTTP 80、HTTPS 443、PostgreSQL 5432。" },
  { term: "进程 Process", desc: "操作系统中正在运行的程序实例。用 ps、top 查看。" },
  { term: "inode / 磁盘配额", desc: "文件数量与空间限制。日志打满磁盘会导致服务全面失败。" },
  { term: "logrotate", desc: "Linux 日志轮转工具，按大小/时间切割并压缩旧日志，防止撑满磁盘。" },
  { term: "PM2", desc: "Node.js 进程管理器，支持集群模式、崩溃重启、日志。适合单机部署。" },
  { term: "Nginx", desc: "高性能 Web 服务器/反向代理。常做 SSL 终止、静态资源、负载均衡。" },
  { term: "upstream", desc: "Nginx 中后端服务器组配置，用于反向代理与负载均衡。" },
  { term: "proxy_pass", desc: "Nginx 把请求转发到上游的指令。" },
  { term: "X-Forwarded-For", desc: "反代传递真实客户端 IP 的请求头。应用取用户 IP 时要信任的代理链。" },
  { term: "WebSocket Upgrade", desc: "HTTP 升级为 WebSocket 的握手。经 Nginx 时需配置 Upgrade 头。" },
  { term: "零停机部署", desc: "发版过程中服务不中断。靠滚动更新、健康检查与无状态设计实现。" },
  { term: "蓝绿部署", desc: "两套环境（蓝/绿），新版本在绿环境验证后切换流量，可快速回切。" },
  { term: "金丝雀发布", desc: "先放少量流量给新版本，观察指标再逐步放量。也称金丝雀/灰度。" },
  { term: "回滚 Rollback", desc: "出问题恢复到上一可用版本。镜像 tag 固定是前提。" },
  { term: "expand/contract 迁移", desc: "数据库变更先扩展（加列）再收缩（删列），保证新旧代码并存时可回滚。" },
  { term: "RDS", desc: "云托管关系数据库。自动备份、监控、高可用，生产优先于自建容器库。" },
  { term: "对象存储 OSS/S3", desc: "存文件的云服务。数据库只存元数据与 URL，文件本体放对象存储。" },
  { term: "签名 URL", desc: "带时效的临时访问链接，用于私有对象的安全下载/上传。" },
  { term: "Pod", desc: "Kubernetes 最小调度单元，内含一个或多个容器。" },
  { term: "Deployment", desc: "K8s 中声明副本数与更新策略，管理一组相同 Pod。" },
  { term: "Service (K8s)", desc: "给 Pod 提供稳定虚拟 IP 与服务发现的抽象。" },
  { term: "Ingress", desc: "K8s 的 HTTP 入口，按域名/路径路由到 Service，常配合 TLS。" },
  { term: "HPA", desc: "Horizontal Pod Autoscaler，按 CPU/QPS 等指标自动增减 Pod 副本。" },
  { term: "ConfigMap / Secret", desc: "K8s 配置与密钥对象。Secret 存敏感信息，勿写入镜像。" },
  { term: "Serverless", desc: "按请求计费的函数/平台运行时。有冷启动与执行时长限制，不适合长任务。" },
  { term: "冷启动", desc: "Serverless 实例从零拉起的延迟。高频服务需保活或选常驻容器。" },
  { term: "BFF", desc: "Backend for Frontend，为特定前端定制的聚合后端层。" },
  { term: "API 网关", desc: "统一入口：路由、鉴权、限流、日志。业务逻辑仍应在下游服务。" },
  { term: "RPC", desc: "远程过程调用。gRPC 是流行实现，基于 HTTP/2 + Protobuf。" },
  { term: "Protobuf", desc: "gRPC 使用的二进制序列化格式，体积小、需 .proto 契约。" },
  { term: "GraphQL", desc: "按需查询字段的 API 查询语言。一个端点，客户端决定形状。" },
  { term: "DataLoader", desc: "解决 GraphQL/ORM N+1 查询的批量加载与缓存工具。" },
  { term: "N+1 查询", desc: "查列表后再循环查关联，产生 1+N 次 SQL。应用 include/join 或 DataLoader 解决。" },
  { term: "消息队列", desc: "异步传递任务的中间件（Redis List、RabbitMQ、Kafka）。削峰、解耦、重试。" },
  { term: "发布订阅 Pub/Sub", desc: "一条消息多个订阅者消费。适合通知；任务分发常用队列竞争消费。" },
  { term: "至少一次投递", desc: "消息可能重复，消费者必须幂等。恰好一次很难，工程上常用至少一次+幂等。" },
  { term: "Outbox 模式", desc: "业务库与发消息同事务写入 outbox 表，再异步投递，保证最终一致。" },
  { term: "Saga", desc: "长流程分布式事务用一串本地事务+补偿动作，代替两阶段提交。" },
  { term: "最终一致性", desc: "允许短暂不一致，经过同步后达到一致。分布式系统常态。" },
  { term: "强一致性", desc: "写入后立即对所有人可见同一结果。成本高，跨服务难做。" },
  { term: "CAP", desc: "分布式理论：一致性、可用性、分区容忍。分区时在 C/A 间取舍。" },
  { term: "BASE", desc: "Basically Available、Soft state、Eventually consistent。对 CAP 的工程补充。" },
  { term: "QPS / TPS", desc: "每秒请求数 / 每秒事务数。容量规划与压测核心指标。" },
  { term: "并发数", desc: "同一时刻正在处理的请求数。与 QPS、平均耗时相关：并发 ≈ QPS × 耗时。" },
  { term: "P95 / P99", desc: "延迟分位数。P99 表示 99% 请求快于该值，比平均值更能反映体验。" },
  { term: "连接池", desc: "复用 DB/Redis/HTTP 连接，避免每次新建。池耗尽会导致雪崩。" },
  { term: "线程池 / 工作池", desc: "限制并行执行数量，保护 CPU 与下游。Bull concurrency 即此类。" },
  { term: "背压 Backpressure", desc: "下游处理不过来时向上游施压减速，防止内存爆。Stream.pipe 自带。" },
  { term: "熔断 Circuit Breaker", desc: "下游连续失败后短时间快速失败，避免拖垮自己。半开探测恢复。" },
  { term: "降级 Fallback", desc: "核心依赖失败时返回次级方案：缓存、默认值、转人工。" },
  { term: "限流 Rate Limit", desc: "限制单位时间请求次数。保护系统与控制 AI 成本。常返回 429。" },
  { term: "令牌桶 / 漏桶", desc: "两种限流算法。令牌桶允许突发；漏桶强制平滑。" },
  { term: "滑动窗口", desc: "比固定窗口更平滑的计数限流。Redis ZSET 可实现。" },
  { term: "幂等 Idempotent", desc: "同一请求执行多次效果相同。支付、回调、队列重试必备。" },
  { term: "乐观锁", desc: "用版本号更新，冲突则失败重试。适合冲突少的并发写。" },
  { term: "悲观锁", desc: "先锁行再改，冲突多时用。注意死锁与持锁时间。" },
  { term: "脏读 / 不可重复读 / 幻读", desc: "事务隔离问题三类。由隔离级别控制。" },
  { term: "ACID", desc: "事务四要素：原子性、一致性、隔离性、持久性。" },
  { term: "WAL", desc: "Write-Ahead Logging，先写日志再改数据，保障崩溃恢复。" },
  { term: "主从复制", desc: "主库写、从库读复制。可读写分离，但有复制延迟。" },
  { term: "读写分离", desc: "写主读从，扩展读能力。注意延迟导致的读旧。" },
  { term: "分库分表", desc: "数据量极大时按键拆分存储。复杂度高，不到必要时不上。" },
  { term: "连接耗尽", desc: "DB 连接池被占满。常见于慢查询、没超时、突增并发。" },
  { term: "慢查询", desc: "执行时间超过阈值的 SQL。要 EXPLAIN、加索引、优化语句。" },
  { term: "索引选择性", desc: "字段区分度。区分度低的列单独建索引效果差。" },
  { term: "覆盖索引", desc: "查询所需列都在索引中，无需回表，更快。" },
  { term: "回表", desc: "二级索引找到主键后再回主键索引取完整行。" },
  { term: "MVCC", desc: "多版本并发控制，读写并行的基础。PostgreSQL/MySQL InnoDB 使用。" },
  { term: "连接泄漏", desc: "借了连接不归还。最终池空导致服务假死。" },
  { term: "OOM", desc: "Out Of Memory，内存耗尽被系统杀掉。Node 要查泄漏与大对象。" },
  { term: "FD 耗尽", desc: "文件描述符用尽（连接/文件太多）。需提 ulimit 并查泄漏连接。" },
  { term: "优雅停机 Graceful Shutdown", desc: "停机前停止接新流量、处理完手头请求再退出。" },
  { term: "SIGTERM / SIGKILL", desc: "TERM 可捕获做清理；KILL 强制杀不可捕获。编排先 TERM 再 KILL。" },
  { term: "滚动发布", desc: "逐个替换实例，始终保持有实例在服务。" },
  { term: "特性开关 Feature Flag", desc: "用配置控制功能开闭与灰度，发版与放量解耦。" },
  { term: "runbook", desc: "故障处理手册：现象、确认步骤、止血命令、升级路径。" },
  { term: "On-call", desc: "值班响应告警的人。告警必须落到具体负责人。" },
  { term: "SLO / SLA / SLI", desc: "服务水平目标/协议/指标。如可用性 99.9%、P99 < 300ms。" },
  { term: "错误预算", desc: "SLO 允许的故障额度。预算耗尽则放缓发版保稳定。" },
  { term: "Postmortem", desc: "故障复盘文档：时间线、根因、改进项。对事不对人。" },
  { term: "IaC", desc: "Infrastructure as Code，用 Terraform/Pulumi 管理云资源，可评审可回滚。" },
  { term: "GitOps", desc: "以 Git 为真相源声明集群状态，自动同步部署。" },
  { term: "十二要素 Twelve-Factor", desc: "现代应用方法论：配置进环境变量、无状态进程、日志打 stdout 等。" },
  { term: "12-Factor 配置", desc: "配置与代码分离，按环境注入。十二要素核心实践之一。" },
  { term: "副作用 Side Effect", desc: "函数除返回值外还改外部状态（写库、发消息）。测试与幂等要特别小心。" },
  { term: "纯函数", desc: "相同输入必得相同输出且无副作用。便于单测，业务核心逻辑尽量提炼成纯函数。" },
  { term: "DTO", desc: "Data Transfer Object，跨层传输的数据结构，常配合校验库。" },
  { term: "DAO / Repository", desc: "数据访问对象，封装 SQL/ORM，隔离持久化细节。" },
  { term: "ORM", desc: "对象关系映射。Prisma/TypeORM/Drizzle 把表映射为对象。" },
  { term: "迁移 Migration", desc: "用版本化脚本管理数据库结构变更。生产禁止手工乱改表。" },
  { term: "种子数据 Seed", desc: "初始化演示/测试数据的脚本，与迁移分开。" },
  { term: "软删除", desc: "用 deleted_at 标记删除而非物理删除，便于恢复与审计。" },
  { term: "UUID / ULID / Snowflake", desc: "分布式友好的 ID 方案。避免自增 ID 在多分片下冲突。" },
  { term: "连接串 Connection String", desc: "DATABASE_URL 这类包含主机、库名、账号的连接配置。属机密。" },
  { term: "连接池耗尽", desc: "同「连接耗尽」。出现时要查慢 SQL、泄漏、突发流量与池大小。" },
  { term: "只读副本", desc: "只接受读查询的从库。用于报表与读扩展。" },
  { term: "备份 RPO / RTO", desc: "RPO 最多丢多久数据；RTO 最多多久恢复。定备份与演练目标。" },
  { term: "灾备", desc: "异地备份与故障切换能力。比单机备份更高一级。" },
  { term: "堡垒机 / 跳板机", desc: "运维先登录跳板再进生产网，收敛 SSH 入口与审计。" },
  { term: "最小权限原则", desc: "只给完成工作所需的最少权限。账号、安全组、IAM、RBAC 通用。" },
  { term: "IAM", desc: "云上身份与访问管理。给程序角色临时凭证，避免长期密钥散落。" },
  { term: "密钥轮换", desc: "定期更换 API Key/数据库密码，降低泄漏影响窗口。" },
  { term: "CORS", desc: "浏览器跨域资源共享机制。由服务端声明哪些源可访问。" },
  { term: "CSRF", desc: "跨站请求伪造。用 SameSite Cookie、CSRF Token 防护。" },
  { term: "XSS", desc: "跨站脚本攻击。输入转义、CSP、httpOnly Cookie 是基本防护。" },
  { term: "SQL 注入", desc: "把恶意 SQL 拼进查询。用参数化/ORM，禁止字符串拼接 SQL。" },
  { term: "SSRF", desc: "服务端请求伪造，诱导服务器访问内网地址。处理用户 URL 时要校验。" },
  { term: "RCE", desc: "远程代码执行。来自反序列化、命令拼接、上传可执行文件等。" },
  { term: "OWASP", desc: "开放全球应用安全项目。其 API Top 10 是后端安全清单。" },
  { term: "WAF", desc: "Web 应用防火墙，在入口过滤常见攻击流量。" },
  { term: "零信任", desc: "默认不信任内外网，每次访问都鉴权。云原生安全趋势。" },
  { term: "可观测性三支柱", desc: "日志 Logs、指标 Metrics、链路 Tracing。缺一不可定位复杂故障。" },
  { term: "OpenTelemetry", desc: "可观测性开放标准，一套 SDK 产出 trace/metric/log。" },
  { term: "结构化日志", desc: "JSON 等固定字段日志，便于检索与告警，代替 console.log 字符串。" },
  { term: "requestId / traceId", desc: "一次请求的全局唯一 ID，贯穿网关、服务、日志与 AI 调用。" },
  { term: "Stdout 日志", desc: "容器时代把日志打到标准输出，由采集器收集，而不是自管文件。" },
  { term: "APM", desc: "Application Performance Monitoring，应用性能监控产品类别。" },
  { term: "压测", desc: "模拟高负载找容量与瓶颈。工具如 k6、autocannon、JMeter。" },
  { term: "容量规划", desc: "按峰值 QPS×冗余÷单机容量估算实例数。" },
  { term: "热点 Key", desc: "被超高频率访问的缓存键，易成击穿点，需本地缓存或隔离。" },
  { term: "缓存穿透", desc: "查不存在的数据绕过缓存打 DB。用空值缓存或布隆过滤器。" },
  { term: "缓存击穿", desc: "热点 key 过期瞬间并发打 DB。用互斥重建或逻辑过期。" },
  { term: "缓存雪崩", desc: "大量 key 同时失效或缓存整体不可用。TTL 随机化+多级+降级。" },
  { term: "Cache Aside", desc: "旁路缓存：读旁路填缓存，写更新 DB 后删缓存。最常用。" },
  { term: "布隆过滤器", desc: "判断「一定不存在 / 可能存在」的概率结构，用于防穿透。" },
  { term: "分布式锁", desc: "多实例互斥。Redis SET NX EX 常用；要设过期与持有者校验。" },
  { term: "红锁 Redlock", desc: "Redis 多节点分布式锁算法，争议较多，理解场景再选用。" },
  { term: "Leader Election", desc: "多实例选主，保证定时任务只跑一份。可用锁或 K8s lease。" },
  { term: "Cron", desc: "定时表达式与调度。分布式下要加锁防重复执行。" },
  { term: "幂等键 Idempotency-Key", desc: "客户端生成的唯一键，服务端去重，保证写接口幂等。" },
  { term: "Webhook", desc: "对方服务器主动 HTTP 推事件给你。要验签、快响、幂等。" },
  { term: "轮询 Polling", desc: "客户端定期问结果。简单但费资源；可升级为长轮询/SSE。" },
  { term: "长轮询", desc: "服务端持有请求直到有数据或超时，比短轮询实时。" },
  { term: "SSE", desc: "Server-Sent Events，服务端单向推流。AI 打字机输出首选。" },
  { term: "WebSocket", desc: "全双工长连接。聊天、协作适合；比 SSE 重，需心跳与代理支持。" },
  { term: "心跳 Heartbeat", desc: "定时 ping/pong 检测连接存活，防止被中间设备踢掉。" },
  { term: "粘性会话 Sticky Session", desc: "同一用户固定到同一实例。无状态设计下应尽量避免依赖它。" },
  { term: "会话 Session", desc: "服务端保存的登录状态。分布式需存 Redis 等共享存储。" },
  { term: "JWT", desc: "JSON Web Token，自包含的身份令牌。需处理过期、刷新与撤销。" },
  { term: "OAuth 2.0", desc: "授权框架，让第三方有限访问用户资源。登录常用授权码模式。" },
  { term: "OIDC", desc: "OpenID Connect，基于 OAuth 的认证层，拿到「你是谁」。" },
  { term: "RBAC", desc: "基于角色的访问控制：用户→角色→权限。" },
  { term: "ABAC", desc: "基于属性的访问控制，如「仅资源所有者可编辑」。" },
  { term: "鉴权 Authentication", desc: "确认你是谁（登录）。" },
  { term: "授权 Authorization", desc: "确认你能做什么（权限）。与鉴权常被混称，需分开设计。" },
  { term: "多租户 Tenant", desc: "一套系统服务多家客户，数据用 tenant/merchant_id 隔离。" },
  { term: "越权 BOLA/IDOR", desc: "改资源 ID 访问到别人数据。查询必须带当前用户/租户条件。" },
  { term: "审计日志", desc: "记录谁在何时对何资源做了什么，合规与追责用。" },
  { term: "PII", desc: "个人身份信息。日志与模型输入需脱敏。" },
  { term: "GDPR", desc: "欧盟数据保护法规。涉及删除权、同意与跨境传输。" },
  { term: "等保", desc: "中国网络安全等级保护。按级别要求安全与审计能力。" },
  { term: "契约测试", desc: "验证服务间接口约定未被破坏。适合微服务。" },
  { term: "契约优先 Contract First", desc: "先定 OpenAPI/.proto 再实现。指挥 AI 开发的推荐方式。" },
  { term: "BFF 聚合", desc: "一次前端请求在 BFF 里并行调多个下游再组装，减少瀑布请求。" },
  { term: "防腐层 ACL", desc: "隔离外部系统模型，避免外部脏模型污染核心领域。" },
  { term: "领域驱动 DDD", desc: "按业务领域建模。聚合、实体、值对象、领域服务等概念。" },
  { term: "贫血模型", desc: "对象只有数据没有行为，逻辑全在 Service。简单项目常见，复杂域宜充实模型。" },
  { term: "CQRS", desc: "命令查询职责分离。写模型与读模型分开，复杂查询可走专门读库。" },
  { term: "事件溯源", desc: "存事件流而非只存最终状态。可重放，但复杂度高。" },
  { term: "单体 Modular Monolith", desc: "单进程内部按模块严格边界。微服务前的推荐形态。" },
  { term: "分布式事务", desc: "跨库/跨服务的原子性。优先避免；否则 Saga/Outbox。" },
  { term: "两阶段提交 2PC", desc: "经典分布式事务协议，阻塞且不适合高并发互联网场景。" },
  { term: "补偿事务", desc: "后续步骤失败时执行撤销动作。Saga 的核心。" },
  { term: "幂等消费者", desc: "消息重复到达也不重复产生副作用的消费者实现。" },
  { term: "死信队列 DLQ", desc: "多次失败的消息去处，供人工处理或延后重放。" },
  { term: "积压 Backlog", desc: "队列中等待处理的消息数。持续上涨说明消费能力不足。" },
  { term: "消费者组", desc: "Kafka 中一组消费者共同消费主题，组内分摊分区。" },
  { term: "分区 Partition", desc: "Kafka 并行与顺序的基本单位。同分区有序。" },
  { term: "Exactly-once", desc: "恰好一次语义。实现成本高，多数业务用至少一次+幂等即可。" },
  { term: "Schema 演进", desc: "消息/API 字段变更要兼容：只增可选字段、废弃再删。" },
  { term: "向后兼容", desc: "新服务能处理旧客户端请求。API 版本管理目标之一。" },
  { term: "向前兼容", desc: "旧服务能容忍新客户端多传的字段。消息与配置常见。" },
  { term: "语义化版本 SemVer", desc: "主.次.修订。破坏变更升主版本。镜像与库常用。" },
  { term: "冻结窗口", desc: "大促等时期禁止发版，降低风险。" },
  { term: "变更管理", desc: "谁改了什么、何时、如何回滚。生产稳定性核心流程。" },
  { term: "基础设施即代码", desc: "见 IaC。避免点控制台手改导致环境不可复现。" },
  { term: "不可变基础设施", desc: "不改现有服务器，用新镜像实例替换。容器实践与此一致。" },
  { term: "宠物 vs 牛群", desc: "服务器如牛：坏了杀掉换新，不精修单机。云原生心智模型。" },
  { term: "边车 Sidecar", desc: "与主容器同 Pod 的辅助容器（代理、日志）。Service Mesh 常见。" },
  { term: "Service Mesh", desc: "服务间通信基础设施层（mTLS、重试、观测）。如 Istio。中小团队慎上。" },
  { term: "服务发现", desc: "运行时找到服务实例地址。DNS、K8s Service、注册中心等。" },
  { term: "配置中心", desc: "集中动态配置（Nacos/Apollo）。可热更新开关与限流阈值。" },
  { term: "熔断半开", desc: "熔断后放过少量探测请求，成功则关闭熔断。" },
  { term: "舱壁隔离 Bulkhead", desc: "隔离线程池/连接池，避免一个慢依赖占满全部资源。" },
  { term: "超时传播", desc: "整条调用链共享截止时间，避免下游超时总和超过上游。" },
  { term: "重试风暴", desc: "多层同时重试放大流量。要抖动、限额、只在边缘重试。" },
  { term: "抖动 Jitter", desc: "重试等待加随机，避免雷同客户端同时打爆。" },
  { term: "指数退避", desc: "重试间隔 1s、2s、4s… 逐渐加长。" },
  { term: "对账", desc: "定期核对两边数据是否一致，补偿漏单。支付与同步常见。" },
  { term: "灰度比例", desc: "新版本流量百分比。按比例/用户/地区切分。" },
  { term: "影子流量", desc: "把生产流量复制到新系统不返回用户，用于验证。" },
  { term: "混沌工程", desc: "主动注入故障验证系统韧性。中小团队可在测试环境演练。" },
  { term: "演练 GameDay", desc: "有计划的故障演习日，验证预案与值班。" },
  { term: "MTTR", desc: "Mean Time To Repair，平均修复时间。稳定性核心指标。" },
  { term: "MTTD", desc: "Mean Time To Detect，平均发现时间。靠监控与告警缩短。" },
  { term: "变更失败率", desc: "导致事故的变更占比。DORA 指标之一。" },
  { term: "DORA 指标", desc: "部署频率、变更前置时间、变更失败率、恢复时间。衡量交付效能。" },
  { term: "技术债", desc: "为求快留下的后续成本。要登记、还债，别无限积累。" },
  { term: "Runbook 自动化", desc: "把常见止血步骤做成脚本/按钮，缩短 MTTR。" },
  { term: "发布列车", desc: "固定节奏发版，功能赶不上就下一班。降低巨型发布风险。" },
  { term: "特性分支", desc: "按功能开分支。长期分支易冲突，宜短生命周期+开关。" },
  { term: "主干开发 Trunk Based", desc: "短分支频繁合主干，配合特性开关。持续交付友好。" },
  { term: "代码评审 Code Review", desc: "合并前他人审查。重点看安全、边界、可回滚性。" },
  { term: "静态扫描 SAST", desc: "不运行代码找漏洞与坏味道。CI 可集成。" },
  { term: "依赖扫描 SCA", desc: "检查第三方包已知漏洞。定期升级。" },
  { term: "SBOM", desc: "软件物料清单，列出依赖组件。供应链安全用。" },
  { term: "供应链攻击", desc: "投毒 npm 包等。锁版本、审依赖、核实包名防 AI 幻觉包。" },
  { term: "幻觉包名", desc: "AI 编造不存在的依赖名。安装前必须核实 registry。" },
  { term: "语义检索 vs 关键词检索", desc: "向量懂意思，关键词懂编号。RAG 常用混合。" },
  { term: "连接超时 vs 读超时", desc: "连不上 vs 连上后等响应过久。要分别配置。" },
  { term: "网关超时 504", desc: "上游在网关等待时间内未响应。常要加长或优化上游。" },
  { term: "502 Bad Gateway", desc: "网关上游不可用或协议错。常是进程挂了或端口错。" },
  { term: "503 Service Unavailable", desc: "服务暂时不可用。可表示过载或主动维护。" },
  { term: "429 Too Many Requests", desc: "触发限流。响应宜带 Retry-After。" },
  { term: "413 Payload Too Large", desc: "请求体过大。调 Nginx client_max_body_size 与应用限制。" },
  { term: "CORS 预检 OPTIONS", desc: "浏览器复杂跨域前先问服务器是否允许。需正确响应。" },
  { term: "同源策略", desc: "浏览器安全基石：协议+域名+端口皆同才算同源。" },
  { term: "Cookie SameSite", desc: "限制跨站携带 Cookie。Lax/Strict 防 CSRF 的重要配置。" },
  { term: "httpOnly", desc: "Cookie 标志，禁止 JS 读取，降低 XSS 偷 Token 风险。" },
  { term: "Secure Cookie", desc: "仅 HTTPS 传输 Cookie。生产必开。" },
  { term: "双因素 2FA", desc: "密码外再加一层（TOTP/短信/Passkey）。管理员建议强制。" },
  { term: "Passkey / WebAuthn", desc: "基于公钥的无密码登录，钓鱼抗性更强。" },
  { term: "HMAC", desc: "基于哈希的消息认证码。Webhook 验签常用。" },
  { term: "加盐 Hash Salt", desc: "密码哈希前加随机盐，防彩虹表。bcrypt 内置盐。" },
  { term: "慢哈希", desc: "bcrypt/argon2 等有意算得慢的哈希，提高暴力破解成本。" },
  { term: "对称加密 vs 非对称", desc: "对称共用一钥（AES）；非对称公私钥（RSA/ECC）。TLS 两者结合。" },
  { term: "KMS", desc: "密钥管理服务，云上加密与密钥轮换的中心。" },
  { term: "信封加密", desc: "数据密钥加密数据，主密钥加密数据密钥。KMS 常见模式。" }
];
