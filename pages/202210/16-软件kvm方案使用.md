---
title: 软件kvm方案(Barrier)使用
---

## 起因

我在闲逛的时候发现一个软件 kvm 使用方案, Barrier, 使用下来发现很不错, 超好用, 无缝衔接

## 使用

[视频参考](https://www.youtube.com/watch?v=hNKNVuBNolA)

**注意:** 要在所有电脑的 Barrier 设置里把 `Enable SSL` 关掉, 不然会报 SSL 错误

## 开机自启(Debian KDE)

### 1. 开启 SDDM 自动登录

在 `Settings -> Startup and Shutdown -> Login Screen(SDDM) -> Advanced` 中开启 `Automaically log in`

注: `Log in again immediately after logging off` 也要勾选, 不然意外 `logout` 就要通过命令行启动 `barrierc` 才能控制电脑了

### 2. 设置 Barrier 开机启动

这个简单, 直接在 Barrier 的界面中设置就好.

左上角 `Barrier -> Change Settings` 中的三项都勾选上并点击 `OK` 就完成了

- [x] Start Barrier on startup
- [x] Minimize to System Tray
- [x] Hide on startuo

### 3. 开启主机网络唤醒

这个能否开启要看主板是否支持, 不过现在的主板都应该支持的, 具体怎么开启请看官自行搜索

### 4. 主控端控制主机

主控端唤醒主机使用 `etherwake`

然后 `ssh client 'loginctl unlock-sessions'`

可以把这两条命令放到一条脚本里, 然后点击就可唤醒主机并解锁
