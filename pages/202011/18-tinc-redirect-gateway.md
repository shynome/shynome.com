---
title: 使用tinc vpn让没有公网ip的节点也能联网
---

## 简介

使用 tinc redict gateway 让不能访问网络的内网机器通过可访问的机器访问网络

并无太大的实际用途, 因为 tinc 是单核的, 转发能力有限是 300M 左右

## tinc 介绍

tinc 目录结构

```
/etc/tinc/myvpn/
├── hosts
│   ├── server
│   ├── server-down
│   ├── server-up
│   └── client
├── rsa_key.priv
├── tinc.conf
├── tinc-down
└── tinc-up
```

`myvpn` 目录名是 tinc 网络名称, 可随意更换  
`hosts/` 目录下面是节点信息文件  
`server-up`和`server-down ` 是 `server` 连接成功和断开连接后执行的脚本, 一般情况下不会添加, 但这次要通过其他 tinc 节点上网, 所以会用到  
`tinc-up`和`tinc-down`脚本设置路由, 蛮重要的, 没设置的话就和没组网一样  
`tinc.conf` tinc 配置文件, 设置连接哪些节点, 网卡叫什么名字, 自己叫啥

这里假定内网里有两台机器 `192.168.0.10`(可联网) 和 `192.168.0.11`(不联网)  
我们设定 myvpn 网段为 `10.10.10.0/24`, 网关服务器的 myvpn 地址选为 `10.10.10.1/32` 称为`server`, 待联网机器地址选为`10.10.10.2/32` 称为`client`, 便有了如下节点信息:

```conf
# /etc/tinc/myvpn/hosts/server
Subnet = 10.10.10.1/32
Address = 192.168.0.10
# 下面这个配置是作为网关转发所必需的
Subnet = 0.0.0.0/0
```

```conf
# /etc/tinc/myvpn/hosts/client
Subnet = 10.10.10.2/32
Address = 192.168.0.11
```

## tinc 组网

1. `mkdir -p /etc/tinc/myvpn/hosts && cd /etc/tinc/myvpn/`
1. `nano tinc.conf` 记得把`server`换成当前节点的名称
   ```conf
   Name = server
   Interface = myvpn
   # client节点需要设置主动连接的节点, server节点不用
   # ConnectTo = server
   ```
1. `nano hosts/server` 记得把`10.10.10.1/32`换成当前节点的 ip
   ```conf
   Subnet = 10.10.10.1/32
   Address = 192.168.0.10
   # 下面这个配置是作为网关转发所必需的
   Subnet = 0.0.0.0/0
   ```
1. `tincd -n myvpn -K 4096` 生成节点密钥 `rsa_key.priv` 和追加公钥到 `hosts/server` 中
1. `nano tinc-up` 记得把`10.10.10.1/32`换成当前节点的 ip

   ```sh
   #!/bin/sh
   ip link set $INTERFACE up
   ip addr add 10.10.10.1/32 dev $INTERFACE
   ip route add 10.10.10.0/24 dev $INTERFACE
   # 下面两条是作为网关转发所需的, 不做网关转发的话去掉
   echo 1 >/proc/sys/net/ipv4/ip_forward
   iptables -t nat -A POSTROUTING -j MASQUERADE
   ```

1. `nano tinc-down`
   ```sh
   #!/bin/sh
   ip link set $INTERFACE down
   ```
1. `chmod +x tinc-*` 赋予脚本可执行权限
1. client 也按上面步骤设置好了后, 和 server 交换 `hosts/` 目录下的节点信息, 交换好之后的目录
   两台服务器的目录都应该像这样:
   ```log
   /etc/tinc/myvpn/
   ├── hosts
   │   ├── server
   │   └── client
   ├── rsa_key.priv
   ├── tinc.conf
   ├── tinc-down
   └── tinc-up
   ```

### 测试 tinc 连通性

1. 在`server`节点执行 `tincd -n myvpn -D -d 2`  
   `-D` 是保持前台运行  
   `-d 2` 是日志等级
1. 在`client`节点执行 `tincd -n myvpn`
1. 查看`server`节点是否有`client connectted`之类的连接信息出现  
   没有的话, 检查`client`节点的`tinc.conf`文件的`ConnectTo = server`是否被注释掉了
1. 在`client`节点执行`ping 10.10.10.1`看组网是否成功, 不通的话  
   检查`tinc-up`脚本是否有可执行权限, 路由配置内容是否正确, 不正确的话修改正确后重启`tinc`  
   重启命令: 杀死当前运行的进程:`tincd -n myvpn -k`, 再启动:`tincd -n myvpn`

ping 通之后, 退出当前运行的`tinc`进程, 让`systemd`来管理`tinc`服务  
退出方式: `server`节点`ctrl+c`, `client`节点`tincd -n myvpn -k`

- 启动服务: `systemctl start tinc@myvpn`
- 开机启动: `systemctl enable tinc@myvpn`
- 重启服务: `systemctl restart tinc@myvpn`

### 通过 `server` 网关上网

终于讲到这篇文章的核心了, 在`tinc`组网成功的基础上添加`server-up`和`server-down`脚本实现上网  
下面操作都是在`client`节点上操作

1. `nano hosts/server-up` 注意: `VPN_GATEWAY`是`server`的节点地址, 不同的话自行更换

   ```sh
   #!/bin/sh
   VPN_GATEWAY=10.10.10.1
   ORIGINAL_GATEWAY=`ip route show | grep ^default | cut -d ' ' -f 2-5`

   ip route add $REMOTEADDRESS $ORIGINAL_GATEWAY
   ip route add $VPN_GATEWAY dev $INTERFACE
   ip route add 0.0.0.0/1 via $VPN_GATEWAY dev $INTERFACE
   ip route add 128.0.0.0/1 via $VPN_GATEWAY dev $INTERFACE
   ```

1. `nano hosts/server-down`

   ```sh
   #!/bin/sh
   VPN_GATEWAY=10.10.10.1
   ORIGINAL_GATEWAY=`ip route show | grep ^default | cut -d ' ' -f 2-5`

   ip route del $REMOTEADDRESS $ORIGINAL_GATEWAY
   ip route del $VPN_GATEWAY dev $INTERFACE
   ip route del 0.0.0.0/1 dev $INTERFACE
   ip route del 128.0.0.0/1 dev $INTERFACE
   ```

1. `chmod +x hosts/server-*` 赋予可执行权限
1. `systemctl restart tinc@myvpn` 重启`tinc@myvpn`服务
1. `curl ip.sb` 测试`client`节点是否能上网了  
   不能的话先停掉`systemctl stop tinc@myvpn`, 再用`tincd -n myvpn -D -d 2`看是哪里出问题了

### 反思

我为什么要写这篇文章呢? 明明如此简单, 只要在`client`节点添加`server-up`和`server-down`脚本就可以了的  
这是因为[官方教程](https://www.tinc-vpn.org/examples/redirect-gateway/)里少了这句 `iptables -t nat -A POSTROUTING -j MASQUERADE` 导致我一直在琢磨哪里出错了, 明明 `Subnet = 0.0.0.0/0` 和 `echo 1 >/proc/sys/net/ipv4/ip_forward` 我都添加了, 为什么还是不能联网, 最后是姻缘巧合之下我发现我用 docker 搭建的 tinc 服务节点可以用来当作网关, 于是在它的配置里找到了不同之处, 这缺失的一句脚本 <https://github.com/vimagick/dockerfiles/blob/master/tinc/docker-entrypoint.sh#L13>

## 一些提示

1. 如何 ssh 到没有公网 ip 的内网主机呢?
1. `ssh -J root@1.1.1.1 root@172.10.10.1` 通过`-J`选项使用有公网 ip 的内网主机作为跳板机连接
