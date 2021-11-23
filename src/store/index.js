import Vue from 'vue'
import Vuex from 'vuex'
import avatar from "../assets/default.png";
import group from "../assets/default_group.png";
import user from "../assets/user.jpeg";
import el from "element-ui/src/locale/lang/el";

Vue.use(Vuex)

// 数据状态管理 - 多个组件的数据交流
// store的内容更新之后，会通知到每个组件。这样就可以达到多个组件数据同步的效果
export default new Vuex.Store({
    state: {
        // token和userInfo具体指的是什么？
        token: localStorage.getItem('token'),
        // 后端发送过来的用户信息
        // userInfo: JSON.parse(localStorage.getItem('userInfo')),
        userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
        search_content: sessionStorage.getItem('search_content'),
        default_address: {
            receiver: '',
            telephone: '',
            address: '',
        },
        // state:'未搜索',
        query_good_list: JSON.parse(sessionStorage.getItem('query_good_list')),
        basic_info: JSON.parse(sessionStorage.getItem('basic_info')),
        // token: "",
        isShowExpression: false,
        isShowMembers: false,
        isShowMemberInfo: false,
        isShowMyInfo: false,
        isShowChatterInfo: false,
        isShowSearch: false,

        chatCount: 1,
        currentTabIndex: 0,
        currentRight: 0,
        currentLinkman: 0,
        myself: {
            id: "p0",
            avatar: user,
            nickname: "你自己",
            // gender: "",
            // alias: "",
            // region: ""
        },
        other: {
            id: "p1",
            avatar: user,
            nickname: "我自己",
            // gender: "",
            // alias: "",
            // region: ""
        },
        goods: {
            id: 0,
            avatar: user,
            price: 0
        },
        chats: [
            {
                chatId: 0,
                linkmanIndex: 0,
                linkmanId:0,
                isMute: false,
                isOnTop: false,
                isOnce: true,
                messages: [
                    {
                        avatar,
                        ctn: "你好",
                        nickname: "用户一",
                        sender: false,
                        time: new Date("2011-01-11 11:11:11"),
                        type: "chat"
                    },
                    {
                        avatar,
                        ctn: "你好",
                        nickname: "用户一",
                        sender: true,
                        time: new Date("2011-01-11 10:11:14"),
                        type: "chat"
                    }
                ]
            },
            // {
            //     chatId: 1,
            //     linkmanIndex: 1,
            //     isMute: false,
            //     isOnTop: false,
            //     messages: [
            //         {
            //             avatar,
            //             ctn: "你好",
            //             nickname: "111",
            //             // sender: "1",
            //             time: new Date("2011-01-11 9:11:11"),
            //             type: "chat"
            //         }
            //     ]
            // }
        ],
        linkmans: [
            // {
            //     id: "g1",
            //     type: "group",
            //     members: ["p1", "p2"],
            //     nickname: "这是群组",
            //     gender: "",
            //     alias: "",
            //     region: "这是地区",
            //     avatar: group
            // },
            {
                id: 0,
                // type: "A",
                nickname: "用户",
                // gender: "",
                // alias: "",
                // region: "这是地区",
                avatar:avatar
            },
            // {
            //     id: "p2",
            //     type: "B",
            //     nickname: "用户二",
            //     gender: "",
            //     alias: "这是备注",
            //
            //     region: "这是地区",
            //     avatar
            // }
        ],
        currentChatId: -1,
        currentOnce: false,
        // linkCount:0


    },
    // mounted() {
    //     this.setInitialChatList();
    // },
    mutations: {
        // setter
        // 通过mutation，可以对token，userInfo进行赋值
        SET_TOKEN: (state, token) => {
            state.token = token
            // 可以通过token继续获取userInfo的信息
            localStorage.setItem("token", token)
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo
            // 登录之后，一次会话期间，保留登陆状态
            // localStorage.setItem('userInfo', JSON.stringify(userInfo))
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        },

        SET_Default_Address: (state, address) => {
            state.default_address.receiver = address.receiver
            state.default_address.telephone = address.telephone
            state.default_address.address = address.address

            // 登录之后，一次会话期间，保留登陆状态
            // localStorage.setItem('userInfo', JSON.stringify(userInfo))
            sessionStorage.setItem('default_address', JSON.stringify(address))
        },

        SET_Basic_Info: (state, basic) => {
            state.basic_info = basic
            sessionStorage.setItem('basic_info', JSON.stringify(basic))
        },
        SET_Good_List: (state, list) => {
            state.query_good_list = list
            sessionStorage.setItem('query_good_list', JSON.stringify(list))
        },
        SET_SEARCH_CONTENT: (state, content) => {
            state.search_content = content
            sessionStorage.setItem('search_content', content)
        },
        // SET_State: (state) => {
        //     state.state = '已搜索'
        //     sessionStorage.setItem('state','已搜索')
        // },


        REMOVE_INFO: () => {
            // 清除token和userInfo的值
            this.state.token = ''
            this.state.userInfo = {}
            localStorage.setItem('token', '')
            // localStorage.setItem('userInfo', JSON.stringify(''))
            sessionStorage.setItem('userInfo', JSON.stringify(''))
        },

        setExpression(state, isShowExpression) {
            if (isShowExpression) {
                state.isShowMembers = false;
                state.isShowMemberInfo = false;
                state.isShowMyInfo = false;
                state.isShowChatterInfo = false;
            }
            state.isShowExpression = isShowExpression;
        },
        setMembers(state, isShowMembers) {
            if (isShowMembers) {
                state.isShowExpression = false;
                state.isShowMyInfo = false;
                state.isShowChatterInfo = false;
            }
            state.isShowMembers = isShowMembers;
        },
        setMemberInfo(state, isShowMemberInfo) {
            state.isShowMemberInfo = isShowMemberInfo;
        },
        setChatterInfo(state, isShowChatterInfo) {
            if (isShowChatterInfo) {
                state.isShowMembers = false;
                state.isShowMemberInfo = false;
                state.isShowExpression = false;
                state.isShowMyInfo = false;
            }
            state.isShowChatterInfo = isShowChatterInfo;
        },
        setMyInfo(state, isShowMyInfo) {
            if (isShowMyInfo) {
                state.isShowMembers = false;
                state.isShowMemberInfo = false;
                state.isShowExpression = false;
                state.isShowChatterInfo = false;
            }
            state.isShowMyInfo = isShowMyInfo;
        },
        setCurrentTab(state, tabIndex) {
            state.currentTabIndex = tabIndex;
        },
        setCurrentRight(state, rightIndex) {
            state.currentRight = rightIndex;
        },
        setCurrentLinkman(state, index) {
            state.currentLinkman = index;
        },
        setCurrentOnce(state) {
            for (let chat of state.chats) {
                if (chat.chatId === state.currentChatId) {
                    state.currentOnce = chat.isOnce;
                    break;
                }
            }
        },
        changeCurrentOnce(state) {
            for (let chat of state.chats) {
                if (chat.chatId === state.currentChatId) {
                    state.currentOnce = true;
                    chat.isOnce = true;
                    break;
                }
            }
        },
        hideAll(state) {
            state.isShowMembers = false;
            state.isShowMemberInfo = false;
            state.isShowExpression = false;
            state.isShowChatterInfo = false;
            state.isShowMyInfo = false;
            state.isShowSearch = false;
        },
        setChatId(state, id) {
            console.log("ididididididid")
            state.currentChatId = id;
            state.currentRight = 0;
        },
        setSearch(state, isShowSearch) {
            state.isShowSearch = isShowSearch;
        },
        sendMessage(state, msg) {
            console.log("yeahhhhhhhh!")
            for (let chat of state.chats) {
                if (chat.chatId === state.currentChatId) {
                    chat.messages.push(msg);
                    break;
                }
            }
        },
        addChat(state, chatList) {
            console.log("*********************")
            console.log(chatList)
            state.currentTabIndex = 0;
            state.currentRight = 0;
            // for (let i = 0; i < state.chats.length; i++) {
            //     let chat = state.chats[i];
            //     if (chat.linkmanIndex === chatList.linkmanIndex) {
            //         state.chats.splice(i, 1);
            //         state.chats = [chat].concat(state.chats);
            //         state.currentChatId = chat.chatId;
            //         return;
            //     }
            // }
            // for (var i = 0; i < this.state.linkmans; i++) {
            //     if (){
            //
            //     }
            // }

            state.chats = [
                {
                    linkmanIndex: this.state.linkmans.length,
                    linkmanId: chatList.linkmanId,
                    chatId: chatList.chatId,
                    isMute: false,
                    isOnTop: false,
                    isOnce: false,
                    messages: []
                }
            ].concat(state.chats);
            state.currentChatId = chatList.chatId;
            console.log("&&&&&&&&&&&&&&&&&&&&&")
            console.log(chatList.messages.nickname)

            let linkman= {
                id: chatList.linkmanId,
                // type: "A",
                nickname: chatList.messages.nickname,
                avatar:chatList.messages.avatar
            }
            this.state.linkmans.push(linkman)


            // ].concat(this.state.linkmans)
            console.log(this.state.linkmans)
            // state.chatCount += 1;
        },
        setInitialChatList(state, chatList) {
            console.log(chatList.length)
            console.log("#####################")
            let count=-1;
            for (let item of chatList) {
                let linkman= {
                    id: item.linkmanId,
                    nickname: item.messages.nickname,
                    avatar:item.messages.avatar
                }
                this.state.linkmans.push(linkman)
            }
            for (let item of this.state.linkmans) {
                if (chatList.linkmanId===item.id){
                    break;
                }
                count++;
            }
            for (let i = 0; i < chatList.length; i++) {
                console.log('fuck')
                let list = chatList[i];
                list.linkmanIndex=count;
                // let chatId=list.chatId;
                // state.currentTabIndex = 0;
                // state.currentRight = 0;
                // console.log(list)
                // for (let i = 0; i < state.chats.length; i++) {
                //     let chat = state.chats[i];
                //     // let temp=chat.messages;
                //     if (chat.chatId === chatId) {
                //         // console.log(chat.messages)
                //         chat.messages.push(list.messages)
                //         // console.log(chat.messages)
                //         // chat.messages.push();
                //         // state.chats = [chat].concat(state.chats);
                //         // state.currentChatId=chatId;
                //         break;
                //     }
                // }
                state.chats = [list].concat(state.chats);
                // state.currentChatId=chatId;
                // console.log(state.chats)
            }
            console.log(state.chats)
        },
        setInitialHistory(state, subscribeMsg) {

            console.log("History")
            console.log(subscribeMsg);
            for (let chat of state.chats) {
                if (chat.chatId === state.currentChatId) {
                    for (let msg of subscribeMsg) {
                        chat.messages = [msg].concat(chat.messages);
                    }
                    // chat.messages.push(msg);
                    break;
                }
            }
        },
        setMyself(state, myInformation) {
            state.myself.id = myInformation.id;
            state.myself.avatar = myInformation.avatar;
            state.myself.nickname = myInformation.nickname;
        },
        setOther(state, yourInformation) {
            state.other.id = yourInformation.id;
            state.other.avatar = yourInformation.avatar;
            state.other.nickname = yourInformation.nickname;
        },
        setGoods(state, goodsInformation) {
            state.goods.id = goodsInformation.id;
            state.goods.avatar = goodsInformation.avatar;
            state.goods.price = goodsInformation.price;
        },
        addMessage(state, userMsg) {
            let temp = {
                avatar: state.other.avatar,
                ctn: userMsg,
                nickname: state.other.nickname,
                sender: false,
                time: new Date(),
                type: "chat"
            }
            for (let chat of state.chats) {
                if (chat.chatId === state.currentChatId) {
                    // chat.messages = [temp].concat(chat.messages);
                    chat.messages.push(temp);
                    break;
                }
            }

        },
        logout(state) {
            state.token = null
            state.userInfo = null
            state.basic_info = {}
            state.query_good_list = []
            state.search_content = []
            localStorage.removeItem('token')
            sessionStorage.removeItem('userInfo')
            sessionStorage.removeItem('basic_info')
            sessionStorage.removeItem('query_good_list')
            sessionStorage.removeItem('search_content')
        },
    },
    getters: {
        // get
        // 获取token，userInfo的方法
        getUser: state => {
            return state.userInfo
        },
        getToken: state => {
            return state.token
        },
        getDefault_Address: state => {
            return state.default_address
        },
        getBasic_Info: state => {
            return state.basic_info
        },
        getGood_list: state => {
            return state.query_good_list
        },
        getContent: state => {
            return state.search_content
        },
        // getState: state =>{
        //     return state.state
        // }
        // user: state => state
    },
    actions: {},
    modules: {},
})
