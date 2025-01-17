import axios from "axios";
import Element from "element-ui";
import store from '@/store'
import router from "@/router";

// 为交互请求添加域名信息（默认IP。端口号）
// 后端接收的端口号
axios.defaults.baseURL='http://localhost:8081'
// axios.defaults.baseURL='http://localhost:8081'


// 配置axios全局拦截 (发起请求时的配置)
// 前置拦截
axios.interceptors.request.use(config => {
    // console.log(store.getters.getToken)
    config.headers = {
        'Content-Type': 'application/json',
        // 'Content-Type': 'multipart/form-data',
        'Authorization': store.getters.getToken
    }
    return config
})

// 后置拦截: 接收到后端发来的消息时处理
// e.g. 出现异常时弹窗提示 -> 不需要一一alert
axios.interceptors.response.use(response => {
    let res = response.data
    console.log(res)
    if (res.code === 200 || res.code === 2000 || res.code === 2001 || res.code === 2002 || res.code === 4003) {
        // 请求成功
        return response
    } else {
        // element-ui 错误弹窗
        Element.Message({
            showClose: true,
            message: response.data.message,
            type: 'error',
        })
        switch (res.code) {
            case 4010:
                // 登陆过期
                router.push('/login')
                break
            case 4050:
                // 商品不存在
                router.push
                ('/none')
                break
            default:
                break
        }
        return Promise.reject(response.data.message)
    }
},
    error => {
        console.log(error)

        if (error.response.data) {
            error.message = error.response.data.message
        }
        // 未登录 -> 跳转到login
        if (error.response.status === 4010) {
            // 清空全局参数 -> store/index.js -> REMOVE_INFO方法
            store.commit("REMOVE_INFO")
            router.push("/login")
        }
        // 错误提示（弹窗）
        // Element.Message({
        //     showClose: true,
        //     message: error.message,
        //     type: 'error',
        // })
        // 阻止进入后续逻辑
        return Promise.reject(error)
    }
)
