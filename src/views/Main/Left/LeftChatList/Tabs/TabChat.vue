<template>
  <!--  <div>-->
  <!--    <input id="userMsg">-->
  <!--    <input id="subscribeMsg">-->
  <!--  </div>-->
  <div class="left-chat-list-tab-wrap" :key="getUnReadCount">
    <!--    <input id="userMsg" type="text">-->
    <!--    <input id="subscribeMsg" type="text">-->
    <!--        :key="'chat' + index"-->
    <div
        v-for="(chat, index) in chats"
        :key="key2"
        class="chat-wrap"
        :class="{
        'chat-wrap-top': chat.isOnTop,
        'chat-wrap-selected': currentChatIndex === index
      }"
        @click="handleChangeChat(index)"
    >
      <div class="chat-avatar">
        <img
            style="width: 40px; height: 40px; border-radius: 2px;"
            :src="chat.avatar"
        />
      </div>
      <div class="chat-msg">
        <div class="chat-msg-nickname">
          {{ chat.nickname }}
        </div>
        <!--        <div-->
        <!--            class="chat-msg-message"-->
        <!--        >{{ chat.messages[chat.messages.length - 1].ctn }}</div>-->
        <pre
            class="chat-msg-message"
            v-html="
            chat.messages.length === 0 ? '':
            (chat.messages[chat.messages.length - 1].ctn.toString().includes('8081')?'[图片]'
            :chat.messages[chat.messages.length - 1].ctn)
          "
        ></pre>
      </div>
      <div class="chat-info" style="text-align:center">
        <span
            class="chat-info-time"
            :style="{ color: currentChatIndex === index ? '#fff' : '' }"
        >{{ chat.messages.length !== 0 ? getTime(chat.messages[chat.messages.length - 1].time) : "" }}</span
        >
        <span class="chat-info-count"
              :style="{ color: currentChatIndex === index ? '#e28353' : 'rgb(246, 233, 215)' }">
<!--              v-if="judgeCount">-->
          <!--              >-->
          <!--        v-if="judgeCount">-->
        {{ chat.unReadCount !== 0 ? chat.unReadCount : "" }}
        </span
        >
        <div class="chat-info-icon-wrap" v-if="chat.isMute">
          <i
              :class="
              `icon ${
                currentChatIndex === index
                  ? 'icon-mute-light'
                  : 'icon-mute-dark'
              }`
            "
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from "@/assets/default.png";
import "../../../../../main.js"
import "../../../../../util/jquery.js"
import "../../../../../util/sockjs.min.js"
import "../../../../../util/stomp.js"
import store from "../../../../../store/index.js"
import {toDate} from "element-ui/src/utils/date-util";

let list = [];
let subscribeMsg = [];
let myInformation;
let yourInformation;
let goodsInformation;
let isBuyer;
global.stomp = null;
export default {
  name: "TabChat",
  data() {
    return {};
  },
  mounted() {
    this.getChatList();
    // this.getHistory();
    // this.handleChangeChat();
    this.connection();
    // this.$store.commit("setInitialChatList", list);
  },
  computed: {
    chats() {
      const linkmans = this.$store.state.linkmans;
      let s =  this.$store.state.chats
          .map(chat => {
            return {
              ...chat,
              ...linkmans[chat.linkmanIndex],
              message: null
            };
          })
          .sort((a, b) => {
            return a.isOnTop ? -1 : 0;
          });
      return s;
    },
    getLinkMan(){
      return this.$store.state.linkmans;
    },
    currentChatIndex() {
      for (let i = 0; i < this.chats.length; i++) {
        if (this.chats[i].chatId === this.$store.state.currentChatId) {
          return i;
        }
      }
    },
    judgeCount() {
      const currentChatId = this.$store.state.currentChatId;
      console.log(currentChatId)
      for (let chat of this.$store.state.chats) {
        if (chat.chatId === this.$store.state.currentChatId) {
          console.log(chat.isBuyer)
          console.log(chat.unReadCount)
          this.unReadCount = chat.unReadCount
          return chat.unReadCount !== 0;
        }
      }
    },
    key2() {
      return this.$store.state.key2
    },
    getUnReadCount() {
      for (let chat of this.$store.state.chats) {
        if (chat.chatId === this.$store.state.currentChatId) {
          return chat.unReadCount;
        }
      }
    },
// }
// getLastMessage(chat){
//   return chat.messages.length === 0
//   // for (let chat of this.$store.state.chats) {
//   if (chat.chatId === this.$store.state.currentChatId) {
// this.lastMessage = chat.messages[chat.messages.length - 1].ctn;
//   }
// }
// chat.messages.length === 0
//     ? ''
//     // : chat.messages[0].ctn
//     : chat.messages[chat.messages.length - 1].ctn"
  },
  methods: {
    connection() {
      console.log("1111111111111")
      let url = "http://localhost:8081/webSocket"
      // let url = "http://localhost:8081/webSocket"
      let socket = new SockJS(url);
      stomp = Stomp.over(socket);
      console.log("22222222222222")
      console.log(global.stomp);
      console.log(this.$store.state.currentChatId)
      stomp.connect(
          {
            "Authorization": this.$store.getters.getToken,
            // "chatId": this.$store.state.currentChatId
          }
          , function (frame) {
            //用户模式
            stomp.subscribe("/user/queue", function (res) {
              let data = JSON.parse(res.body);
              console.log(data);
              store.commit("addMessage", data);
              // document.querySelector("#userMsg").val(res.body);
            });
            // stomp.subscribe("/app/subscribe/chat", function (res) {
            //   const data = JSON.parse(res.body);
            //   console.log(data)
            //   list = []
            //   // console.log(toDate(data))
            //   data.forEach((item) => {
            //     console.log(item)
            //     console.log(item.lastMessageContent)
            //     console.log(toDate(item.lastMessageDate))
            //     if (toDate(item.lastMessageDate) != null) {
            //       let chatList = {
            //         chatId: item.chatId,
            //         linkmanIndex: item.otherUserId,
            //         isMute: false,
            //         isOnTop: false,
            //         isOnce: false,
            //         messages: [
            //           {
            //             avatar: item.otherUserPicturePath,
            //             nickname: item.otherUserName.toString(),
            //             ctn: item.lastMessageContent,
            //             time: toDate(item.lastMessageDate),
            //             type: "chat"
            //           }
            //         ],
            //         // address: item.addressName,
            //         // type:item.isDefault==='null'?'Normal':'Default'
            //       }
            //       console.log(chatList)
            //       list.push(chatList)
            //     }else{
            //       let chatList = {
            //         chatId: item.chatId,
            //         linkmanIndex: item.otherUserId,
            //         isMute: false,
            //         isOnTop: false,
            //         isOnce: false,
            //         messages: [
            //           {
            //             avatar: item.otherUserPicturePath,
            //             nickname: item.otherUserName.toString(),
            //             ctn: "",
            //             time: "",
            //             type: "chat"
            //           }
            //         ],
            //       }
            //       console.log(chatList)
            //       list.push(chatList)
            //     }
            //     console.log(list)
            //     // this.commit();
            //     // this.$store.commit("setChatId", item.dealId);
            //   })
            //   // this.$store.commit("setInitialChatList", list);
            // });
            //   // setConnect(true);
          }
      );
    }
    ,
    setCount() {
      const currentChatId = this.$store.state.currentChatId;
      console.log(currentChatId)
      for (let chat of this.$store.state.chats) {
        if (chat.chatId === currentChatId) {
          console.log(chat.isBuyer)
          console.log(chat.unReadCount)
          chat.unReadCount = 0;
        }
      }
    }
    ,
    getChatList() {
      console.log(this.$store.getters.getToken)
      this.$axios({
        method: 'get',
        url: 'http://localhost:8081/chat/list',
        headers: {'authorization': this.$store.getters.getToken},
        transformRequest: [function (data) {  // 将{username:111,password:111} 转成 username=111&password=111
          var ret = '';
          for (var it in data) {
            // 如果要发送中文 编码
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret.substring(0, ret.length - 1)
        }]
      }).then(res => {
        if (res.data.code === 2000) {
          const data = res.data.data
          console.log(data)
          let chatList = []
          let linkmanList = []
          // console.log(toDate(data))
          let count = 0
          const chatHis = data.chatHistories
          this.$store.state.myself.nickname = data.userName
          this.$store.state.myself.avatar = data.picturePath
          chatHis.forEach((item) => {
            if (item.lastMessageContent == null) {
              chatList.push({
                chatId: item.chatId,
                linkmanIndex: count,
                linkmanId: item.chatId,
                isMute: false,
                isOnTop: false,
                isOnce: false,
                isBuyer: item.isBuyer,
                unReadCount: 0,
                goodsInformation: {
                  avatar: 0,
                  price: 0,
                  id: 0,
                },
                messages: []
                // address: item.addressName,
                // type:item.isDefault==='null'?'Normal':'Default'
              })
            } else {
              // console.log(item.lastMessageContent.toString().includes("<img"))
              console.log("^^^^^^^^^^^^^^^^^^^^")
              console.log(item.lastMessageContent)
              chatList.push({
                chatId: item.chatId,
                linkmanIndex: count,
                linkmanId: item.chatId,
                isMute: false,
                isOnTop: false,
                isOnce: false,
                isBuyer: item.isBuyer,
                unReadCount: item.unreadCount,
                goodsInformation: {
                  avatar: 0,
                  price: 0,
                  id: 0,
                },
                messages: [
                  {
                    avatar: item.otherUserPicturePath,
                    nickname: item.otherUserName.toString(),
                    ctn: item.lastMessageContent,
                    sender: false,
                    time: toDate(item.lastMessageDate),
                    type: "chat"
                  }
                ]
                // address: item.addressName,
                // type:item.isDefault==='null'?'Normal':'Default'
              })
            }
            linkmanList.push({
              id: chatList.chatId,
              // type: "A",
              nickname: item.otherUserName.toString(),
              avatar: item.otherUserPicturePath
            })
            count++
            // this.$store.commit("setChatId", item.dealId);
          })
          this.$store.state.linkmans = linkmanList
          this.$store.state.chats = chatList
          console.log("#####################")
          console.log(linkmanList)
          console.log(chatList)
          // for (let item = 0;item<chatList.length;item++){
          //   this.handleChangeChat(item);
          // }
        } else {
          this.$alert(res.data.message, 'Tip', {
            confirmButtonText: 'OK'
          })
        }
      })
      console.log(this.$store.getters.getToken)
    }
    ,
    getHistory(index) {
      this.$axios({
        method: 'get',
        url: 'http://localhost:8081/chat/history/' + this.$store.state.chats[index].chatId,
        headers: {'authorization': this.$store.getters.getToken},
        transformRequest: [function (data) {  // 将{username:111,password:111} 转成 username=111&password=111
          let ret = '';
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret.substring(0, ret.length - 1)
        }]
      }).then(res => {
        if (res.data.code === 2000) {
          const data = res.data.data
          subscribeMsg = [];
          let myId = data.speakUserId;
          let yourId = data.otherUserId;
          let myName = data.speakUserName;
          let yourName = data.otherUserName;
          let myPicture = data.speakUserPicturePath;
          let yourPicture = data.otherUserPicturePath;
          let goodsId = data.goodsId;
          let goodsPicture = data.goodsPicturePath;
          let goodsPrice = data.goodsPrice;
          isBuyer = data.isBuyer;
          console.log(isBuyer)
          for (let item of data.chatContents) {
            let msg;
            if (item.isSpeakUser) {
              msg = {
                avatar: myPicture,
                ctn: item.content,
                nickname: myName,
                sender: item.isSpeakUser,
                time: toDate(item.date),
                type: "chat"
              }
            } else {
              msg = {
                avatar: yourPicture,
                ctn: item.content,
                nickname: yourName,
                sender: item.isSpeakUser,
                time: toDate(item.date),
                type: "chat"
              }
            }
            subscribeMsg = [msg].concat(subscribeMsg);
          }
          myInformation = {
            id: myId,
            avatar: myPicture,
            nickname: myName.toString(),
          }
          yourInformation = {
            id: yourId,
            avatar: yourPicture,
            nickname: yourName.toString(),
          }
          goodsInformation = {
            id: goodsId,
            avatar: goodsPicture,
            price: goodsPrice,
          }
          this.$store.commit("setChatId", this.$store.state.chats[index].chatId);
          subscribeMsg = [subscribeMsg, goodsInformation, isBuyer]
          this.$store.commit("setInitialHistory", subscribeMsg);
          this.$store.commit("setMyself", myInformation);
          this.$store.commit("setOther", yourInformation);
          this.$store.commit("setGoods", goodsInformation);
          stomp.send("/app/clear", {}, JSON.stringify({"body": this.$store.state.currentChatId.toString()}))

          this.$store.state.key1 = this.$store.state.key1 + 1;
        }
      })
    }
    ,
    disconnect() {
      if (stomp != null) {
        stomp.disconnect();
      }
      // setConnect(false);
    }
    ,
    commit() {

    }
    ,

    handleChangeChat(index) {

      // console.log(this.chats);
      // console.log(index);
      // console.log(this.chats[index].chatId);
      // this.disconnect();
      this.unReadCount = 0;
      console.log(this.unReadCount)
      this.setCount();

      if (!this.$store.state.chats[index].isOnce) {

        this.getHistory(index);
        this.$store.state.chats[index].isOnce = true;
      } else {
        this.$store.commit("setChatId", this.$store.state.chats[index].chatId);
        stomp.send("/app/clear", {}, JSON.stringify({"body": this.$store.state.currentChatId.toString()}))
        this.$store.commit("setGoods", this.$store.state.chats[index].goodsInformation);

      }

      // this.connection();
      // this.commit();
    }
    ,
    getTime(time) {
      const d = time;
      const h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      const m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      return `${h}:${m}`;
    }
  }
}
;
</script>

<style scoped>
.list-title {
  color: #787b87;
  padding: 2px 18px;
  font-size: 14px;
  height: 24px;
}

.chat-wrap {
  height: 40px;
  padding: 12px 18px 11px;
  border-bottom: 1px solid #e28353;
  display: flex;
  font-size: 13px;
  cursor: pointer;
  border-bottom: 1px solid #e28353;
  color: #989898;
  user-select: none;
}

.chat-wrap-top {
  background-color: rgb(48, 65, 86);
}

.chat-wrap-selected {
  background-color: #e28353;
  color: #fff;
}

.chat-avatar {
  margin-right: 10px;
}

.chat-msg {
  flex-grow: 1;
}

.chat-msg-nickname {
  color: #6d908a;
  height: 20px;
}

.chat-msg-message {
  user-select: none;
  overflow-wrap: normal;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 161px;
  height: 20px;
  margin: 0;
}

.chat-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chat-info-time {
  color: #6b6f7c;
  user-select: none;
}

.chat-info-count {
  color: #eee;
  user-select: none;
  border: 1px solid;
  /*border-radius:10px;*/
  background: #ff0000;
  border-radius: 2em;
}

.chat-info-icon-wrap {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.icon {
  width: 20px;
  height: 20px;
  background: url(../../../../../assets/opt-but.png) no-repeat;
  background-size: 487px 462px;
}

.icon-mute-light {
  background-position: -311px -432px;
}

.icon-mute-dark {
  background-position: -401px -357px;
}
</style>