// import {
//         Message,
// } from 'element-ui';
// class socket {
//         /* websocket实例 */
//         ws = null
//         /* 状态 */
//         //连接状态
//         alive = false
//         //把类的参数传入这里，方便调用
//         params = null
//         /* 计时器 */
//         //重连计时器
//         reconnect_timer = null
//         //心跳计时器
//         heart_timer = null
//         // 信息onmessage缓存方法
//         message_func = null
//         /* 参数 */
//         //心跳时间 50秒一次
//         heartBeat = 10000
//         //心跳信息：默认为‘hello’随便改，看后台
//         heartMsg = 'hello'
//         //是否自动重连
//         reconnect = true
//         //重连间隔时间
//         reconnectTime = 5000
//         //重连次数
//         reconnectTimes = 10
//         constructor(params) {
//                 this.params = params
//                 this.init()
//         }
//         /* 初始化 */
//         init() {
//                 //重中之重，不然重连的时候会越来越快
//                 clearInterval(this.reconnect_timer)
//                 clearInterval(this.heart_timer)
//
//                 //取出所有参数
//                 let params = this.params
//                 //设置连接路径
//                 let { url, port } = params
//                 let global_params = ['heartBeat', 'heartMsg', 'reconnect', 'reconnectTime', 'reconnectTimes']
//
//                 //定义全局变量
//                 Object.keys(params).forEach(key => {
//                         if (global_params.indexOf(key) !== -1) {
//                                 this[key] = params[key]
//                         }
//                 })
//
//                 let ws_url = port ? url + ':' + port : url
//
//                 // this.ws = null
//                 delete this.ws
//                 this.ws = new WebSocket(ws_url)
//
//                 // window.console.log(this.message_func)
//                 if (this.message_func) {
//                         this.onmessage(this.message_func)
//                 }
//
//
//                 //默认绑定事件
//                 this.ws.onopen = () => {
//                         //设置状态为开启
//                         this.alive = true
//                         clearInterval(this.reconnect_timer)
//                         //连接后进入心跳状态
//                         this.onheartbeat()
//                 }
//                 this.ws.onclose = () => {
//                         //设置状态为断开
//                         this.alive = false
//
//                         clearInterval(this.heart_timer)
//
//                         //自动重连开启  +  不在重连状态下
//                         if (true == this.reconnect) {
//                                 /* 断开后立刻重连 */
//                                 this.onreconnect()
//                         }
//                 }
//         }
//
//
//         /*
//          *
//          * ‘心跳事件’和‘重连事件’
//          *
//          */
//
//         /* 心跳事件 */
//         onheartbeat(func) {
//                 //在连接状态下
//                 if (true == this.alive) {
//                         /* 心跳计时器 */
//                         this.heart_timer = setInterval(() => {
//                                 //发送心跳信息
//                                 this.send(this.heartMsg)
//                                 func ? func(this) : false
//
//                         }, this.heartBeat)
//                 }
//         }
//
//         /* 重连事件 */
//         onreconnect(func) {
//                 /* 重连间隔计时器 */
//                 this.reconnect_timer = setInterval(() => {
//                         //限制重连次数
//                         if (this.reconnectTimes <= 0) {
//                                 //关闭定时器
//                                 // this.isReconnect = false
//                                 clearInterval(this.reconnect_timer)
//                                 //跳出函数之间的循环
//                                 return;
//                         } else {
//                                 //重连一次-1
//                                 this.reconnectTimes--
//                         }
//                         //进入初始状态
//                         this.init()
//                         func ? func(this) : false
//                 }, this.reconnectTime)
//         }
//
//         /*
//          *
//          * 对原生方法和事件进行封装
//          *
//          */
//
//         // 发送消息
//         send(text) {
//                 if (true == this.alive) {
//                         text = typeof text == 'string' ? text : JSON.stringify(text)
//                         this.ws.send(text)
//                         if (text == "hello") {
//                                 Message.success("心跳连接♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥");
//                         }
//                 }
//         }
//
//         // 断开连接
//         close() {
//                 if (true == this.alive) {
//                         this.ws.close()
//                 }
//         }
//
//         //接受消息
//         onmessage(func, all = false) {
//                 this.ws.onmessage = data => {
//                         this.message_func = func
//                         func(!all ? data.data : data)
//                 }
//         }
//
//         //websocket连接成功事件
//         onopen(func) {
//                 this.ws.onopen = event => {
//
//                         this.alive = true
//                         func ? func(event) : false
//
//                 }
//         }
//         //websocket关闭事件
//         onclose(func) {
//                 this.ws.onclose = event => {
//
//                         //设置状态为断开
//                         this.alive = false
//
//                         clearInterval(this.heart_timer)
//
//                         //自动重连开启  +  不在重连状态下
//                         if (true == this.reconnect) {
//                                 /* 断开后立刻重连 */
//                                 this.onreconnect()
//                         }
//                         func ? func(event) : false
//                 }
//         }
//         //websocket错误事件
//         onerror(func) {
//                 this.ws.onerror = event => {
//                         func ? func(event) : false
//                 }
//         }
// }
//
// export default socket

// 安装并引入相关模块
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
export default {
        data() {
                return {
                        dataList: []
                };
        },
        mounted:function(){
                this.initWebSocket();
        },
        beforeDestroy: function () {
                // 页面离开时断开连接,清除定时器
                this.disconnect();
                clearInterval(this.timer);
        },
        methods: {
                initWebSocket() {
                        this.connection();
                        let self = this;
                        // 断开重连机制,尝试发送消息,捕获异常发生时重连
                        this.timer = setInterval(() => {
                                try {
                                        self.stompClient.send("test");
                                } catch (err) {
                                        console.log("断线了: " + err);
                                        self.connection();
                                }
                        }, 5000);
                },
                removeTab(targetName) {
                        console.log(targetName)
                },
                connection() {
                        // 建立连接对象
                        this.socket = new SockJS('http://xxxxxx:8089/ws');//连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
                        // 获取STOMP子协议的客户端对象
                        this.stompClient = Stomp.over(this.socket);
                        // 定义客户端的认证信息,按需求配置
                        var headers = {
                                login: 'mylogin',
                                passcode: 'mypasscode',
                                // additional header
                                'client-id': 'my-client-id'
                        };
                        // 向服务器发起websocket连接
                        this.stompClient.connect(headers,(frame) => {
                                this.stompClient.subscribe('/topic/chat_msg', (msg) => { // 订阅服务端提供的某个topic
                                        consolel.log(msg.body); // msg.body存放的是服务端发送给我们的信息
                                });
                        }, (err) => {

                        });

                },
                disconnect() {
                        if (this.stompClient != null) {
                                this.stompClient.disconnect();
                                console.log("Disconnected");
                        }
                }
        }
};