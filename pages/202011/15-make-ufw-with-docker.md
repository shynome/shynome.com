---
title: make ufw work with docker
---

## 起

无意中翻到 `ufw` 这个简单好用的防火墙工具, 就想着我那台搬瓦工的机子还在裸奔中,
就想着能不能给它上个防火墙, 这样我就能放开一些端口到内网中方便管理了

## 转

事情当然不会这么顺利的, 要不然我写这个干啥呢.  
我设置好规则, 开启 ufw, 然后外网访问 nginx 端口, 发现居然是通的, 这不对劲, 应该不能访问才对的  
于是搜索`ufw docker`果然出现了很多类似问题, 但因为过于陈旧, 信息过多过于嘈杂导致我没有找到解决方案,
于是我放弃了, 毕竟又不是不能用, 正好肚子饿了, 去吃个饭先

## 承

但吃饭等待的时候, 我想着饭还没上来, 不如再看看, 如果最近一年内都没有人解决的话就算了吧, 于是把搜索时间限制在一年内再搜了下.
果然有一篇文章讲了他如何解决这个问题, 我吃好饭回去试了下, 果然可行, 于是把解决方法也摘抄一份在这

> 文章地址: https://p1ngouin.com/posts/how-to-manage-iptables-rules-with-ufw-and-docker

## 合(解)

首先安装 `ufw`

```sh
apt install ufw
```

设置下列规则:

```sh
# 允许 ssh 端口, 避免等会无法连接到ssh主机, 如果你的 ssh 端口不是 22 的话自行替换
ufw allow 22/tcp
# 默认规则禁止入站流量
ufw default deny
# 允许 80, 443 端口等需要使用的端口
ufw allow 80/tcp
ufw allow 443/tcp
```

重点来了, 首先在 `/etc/ufw/after.rules` 文件末尾中追加如下内容, 其中 `$INTERFACE` 换成 docker 使用的外网网卡, 例如 `eth0` `eth1` 之类的

```sh
# docker ufw
*filter
:DOCKER-USER - [0:0]
:ufw-user-input - [0:0]
:ufw-after-logging-forward - [0:0]

-A DOCKER-USER -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
-A DOCKER-USER -m conntrack --ctstate INVALID -j DROP
-A DOCKER-USER -i $INTERFACE -j ufw-user-input
-A DOCKER-USER -i $INTERFACE -j ufw-after-logging-forward
-A DOCKER-USER -i $INTERFACE -j DROP

COMMIT
```

然后把 `/etc/ufw/before.init` 中的 `stop` 块替换成下面的 `stop` 块, 并给它可执行权限 `chmod +x /etc/ufw/before.init`

```sh
set -xe

case "$1" in
start)
    # typically required
    ;;
stop)
    iptables -F DOCKER-USER || true
    iptables -A DOCKER-USER -j RETURN || true
    iptables -X ufw-user-input || true
    # typically required
    ;;
status)
    # optional
    ;;
flush-all)
    # optional
    ;;
*)
    echo "'$1' not supported"
    echo "Usage: before.init {start|stop|flush-all|status}"
    ;;
esac
```

最后开启 ufw 防火墙和设置开机自启

```sh
# 开启防火墙
ufw enable
# 开机自启
systemctl enable ufw
```
