---
title: 使用 wireguard 进行游戏加速
---

## 起

最近 lol pbe 更新了 TFT S4.5 版本于是想去体验下, 可是现有的 v2ray 全局翻墙不好用, 时不时会
卡住卡死, 然后今天在我直播的时候卡住了, 浪费了黄金直播时间段. 然后我想起以前推友说 v2ray 对游戏方面不友好,
换成 wireguard 就可以愉快的玩耍了, 于是我决定好好折腾一番 wireguard

## 服务端设置

### 安装

我用的是 debian 10, 直接`apt install wireguard linux-headers-$(uname -r)`就安装成功了

### 配置

在`/etc/wireguard/wg0.conf`中填入以下内容, 然后使用`wg-quick up wg0`启动服务, `wg-quick down wg0`关闭服务

注: 使用 wg genkey 生成 `PrivateKey` 替换掉配置中的`xxxxxxx`

```conf
[Interface]
Address = 192.168.2.1/24
ListenPort = 34600
PrivateKey = xxxxxxxxxxxxx
# 下面两个是全局代理会用到的, 不用全局代理的话删掉
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -s 192.168.2.0/24 -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -s 192.168.2.0/24 -o eth0 -j MASQUERADE
```

### 添加客户端

- 添加客户端 `wg set wg0 peer 5XGYhOissgpuguerjnBQBqwzlcarOFm3MoC/zWFcvx0= allowed-ips 192.168.2.3/32,192.168.2.4/32`
- 查看`wg0`状态 `wg show wg0`
- 保存新增节点到配置文件中 `wg-quick save wg0`, 这样下次使用`wg-quick up wg0`这个节点也是可以连接的 (可以用`cat /etc/wireguard/wg0.conf`命令检查是否保存成功)
- 移除客户端 `wg set wg0 peer 5XGYhOissgpuguerjnBQBqwzlcarOFm3MoC/zWFcvx0= remove`, 移除后也要记得保存不然重启`wg0`后又会出现

### windows 客户端设置

- 连接`wireguard`我用的是`TunSafe`绿色版, 注意绿色要安装`TunSafe-TAP`之后才能使用. <https://tunsafe.com/download> 拉到最下面就是绿色版的下载地址了
- 国内外分流用的是 `<https://github.com/lmc999/auto-add-routes>`

我的配置文件如下:

注: 我是放到桌面的, 下面路径要改成对应文件夹路径

```
[Interface]

# The addresses to bind to. Either IPv4 or IPv6. /31 and /32 are not supported.
Address = 192.168.2.3/24
PrivateKey = xxxxxxxxxxxx

PreUp    = start C:\Users\uuu\Desktop\TunSafe-1.5-rc2\route\routes-up.bat
PostUp   = start C:\Users\uuu\Desktop\TunSafe-1.5-rc2\route\dns-up.bat
PostDown = start C:\Users\uuu\Desktop\TunSafe-1.5-rc2\route\routes-down.bat
PostDown = start C:\Users\uuu\Desktop\TunSafe-1.5-rc2\route\dns-down.bat
ExcludedIPs = 127.0.0.1/32
DNS = 127.0.0.1
MTU = 1250

[Peer]
# 服务端的pubkey, `wg show wg0` 就能看到服务端的pubkey
PublicKey = xxxxxxxxx
# 允许所有的路由都走服务端
AllowedIPs = 0.0.0.0/0
# 你的服务器地址和端口, 没域名就用ip
Endpoint = example.ltd:34600

# Send periodic keepalives to ensure connection stays up behind NAT.
PersistentKeepalive = 25
```
