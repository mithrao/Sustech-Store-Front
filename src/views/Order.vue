<template>
  <div class="order">
    <div class="order-header">
      <div class="header-content">
        <p>
          <i class="el-icon-goods" style="color: deepskyblue"></i>
        </p>
        <p>My Orders</p>
        <router-link to></router-link>
      </div>
    </div>

    <div class="content">
      <el-radio-group v-model="dealType" style="margin-bottom: 30px; margin-top: -10px">
        <el-radio-button label="buy">Bought</el-radio-button>
        <el-radio-button label="sell">Sold</el-radio-button>
      </el-radio-group>

      <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane label="all"></el-tab-pane>
        <el-tab-pane label="unpaid"></el-tab-pane>
        <el-tab-pane label="unshipped"></el-tab-pane>
        <el-tab-pane label="unreceived"></el-tab-pane>
        <el-tab-pane label="uncommented"></el-tab-pane>
        <el-tab-pane label="complete"></el-tab-pane>
        <el-tab-pane label="refunding"></el-tab-pane>
        <el-tab-pane label="appealing"></el-tab-pane>
        <el-tab-pane label="appealed"></el-tab-pane>
        <el-tab-pane label="closed"></el-tab-pane>
      </el-tabs>
      <OrderList
          @refresh="refresh"
          v-bind:orderList="showList"
          v-bind:total="total"
          v-bind:stage="this.queryInfo.queryStage"
          v-bind:dealType="this.dealType"
      ></OrderList>
    </div>
    <el-footer class="footer">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
      >
      </el-pagination>
    </el-footer>
  </div>
</template>

<script>
import OrderList from "@/components/OrderList"
export default {
  name: 'Order',
  components: {OrderList},
  data() {
    return {
      dealType: 'buy',
      queryInfo: {
        queryStage: -1,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: [],
      showList: []
    }
  },
  methods: {
    activate() {
      this.getOrderList(-1)
    },
    handleClick(tab) {
      console.log(tab.label)
      let stageId = -1
      switch (tab.label) {
        case 'unpaid':
          stageId = 0
          break
        case 'unshipped':
          stageId = 1
          break
        case 'unreceived':
          stageId = 2
          break
        case 'uncommented':
          stageId = 3
          break
        case 'complete':
          stageId = 4
          break
        case 'closed':
          stageId = 5
          break
        case 'refunding':
          stageId = 6
          break
        case 'appealing':
          stageId = 7
          break
        case 'appealed':
          stageId = 8
          break
        default:
          break
      }
      this.setQueryStage(stageId)
      this.getOrderList(stageId)
    },
    setQueryStage(value) {
      this.queryInfo.queryStage = value
    },
    getOrderList(stageId) {
      this.orderList = []
      if (stageId !== -1) {
        this.getStageOrder(stageId)
      } else {
        this.getAllOrder()
      }
    },
    getAllOrder() {
      if (this.dealType === 'buy') {
        this.getAllBuyOrder()
      } else {
        this.getAllSellOrder()
      }
    },
    getAllBuyOrder() {
      this.$axios({
        method: 'get',
        url: 'http://localhost:8081/user/buyDeal',
      }).then(res => {
        const orders = res.data.data
        console.log('get buying deal', orders)
        this.total = orders.length
        for (let i in orders) {
          const item = orders[i]
          this.orderList.push({
            dealId: item.dealId,
            time: item.orderTime,
            goodsPhoto: item.goodsAbbreviation.picturePath,
            goodsTitle: item.goodsAbbreviation.title,
            price: item.goodsAbbreviation.price + item.goodsAbbreviation.postage,
            stage: item.stage,
          })
        }

        console.log('show list loading')
        this.showList = []
        let fromIdx = (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize
        let toIdx = fromIdx + this.queryInfo.pagesize
        if (this.total < toIdx) {
          toIdx = this.total
        }
        console.log('from ', fromIdx, '; to ', toIdx)
        for (let i = fromIdx; i < toIdx; i++) {
          console.log(this.orderList[i])
          this.showList.push(this.orderList[i])
        }
      })
    },
    getAllSellOrder() {
      this.$axios({
        method: 'get',
        url: 'http://localhost:8081/user/sellDeal',
      }).then(res => {
        const orders = res.data.data
        console.log('get selling deal', orders)
        this.total = orders.length
        for (let i in orders) {
          const item = orders[i]
          this.orderList.push({
            dealId: item.dealId,
            time: item.orderTime,
            goodsPhoto: item.goodsAbbreviation.picturePath,
            goodsTitle: item.goodsAbbreviation.title,
            price: item.goodsAbbreviation.price + item.goodsAbbreviation.postage,
            stage: item.stage,
          })
        }

        console.log('show list loading')
        this.showList = []
        let fromIdx = (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize
        let toIdx = fromIdx + this.queryInfo.pagesize
        if (this.total < toIdx) {
          toIdx = this.total
        }
        console.log('from ', fromIdx, '; to ', toIdx)
        for (let i = fromIdx; i < toIdx; i++) {
          console.log(this.orderList[i])
          this.showList.push(this.orderList[i])
        }
      })
    },
    getStageOrder(stage) {
      if (this.dealType === 'buy') {
        this.getBuyStageOrder(stage)
      } else {
        this.getSellStageOrder(stage)
      }
    },
    getBuyStageOrder(stage) {
      this.$axios({
        method: 'get',
        url: 'http://localhost:8081/user/buyDeal/' + stage
      }).then(res => {
        const orders = res.data.data
        this.total = orders.length
        for (let i in orders) {
          const item = orders[i]
          this.orderList.push({
            dealId: item.dealId,
            goodsPhoto: item.goodsAbbreviation.picturePath,
            goodsTitle: item.goodsAbbreviation.title,
            price: item.goodsAbbreviation.price + item.goodsAbbreviation.postage,
            stage: item.stage,
          })
        }

        console.log('show list loading')
        this.showList = []
        let fromIdx = (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize
        let toIdx = fromIdx + this.queryInfo.pagesize
        if (this.total < toIdx) {
          toIdx = this.total
        }
        console.log('from ', fromIdx, '; to ', toIdx)
        for (let i = fromIdx; i < toIdx; i++) {
          console.log(this.orderList[i])
          this.showList.push(this.orderList[i])
        }
      })
    },
    getSellStageOrder(stage) {
      this.$axios({
        method: 'get',
        url: 'http://localhost:8081/user/sellDeal/' + stage
      }).then(res => {
        const orders = res.data.data
        this.total = orders.length
        for (let i in orders) {
          const item = orders[i]
          this.orderList.push({
            dealId: item.dealId,
            goodsPhoto: item.goodsAbbreviation.picturePath,
            goodsTitle: item.goodsAbbreviation.title,
            price: item.goodsAbbreviation.price + item.goodsAbbreviation.postage,
            stage: item.stage,
          })
        }

        console.log('show list loading')
        this.showList = []
        let fromIdx = (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize
        let toIdx = fromIdx + this.queryInfo.pagesize
        if (this.total < toIdx) {
          toIdx = this.total
        }
        console.log('from ', fromIdx, '; to ', toIdx)
        for (let i = fromIdx; i < toIdx; i++) {
          console.log(this.orderList[i])
          this.showList.push(this.orderList[i])
        }
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
    },
    refresh() {
      this.getOrderList(this.queryInfo.queryStage)
    }
  },
  watch: {
    'dealType': function(newVal, oldVal) {
      this.refresh()
    },
    'queryInfo.pagenum': function (newVal, oldVal) {
      this.loadShowList()
    },
    'queryInfo.pagesize': function (newVal, oldVal) {
      this.loadShowList()
    }
  },
  mounted() {
    this.activate()
  },
}
</script>

<style scoped>
.order {
  background-color: #f5f5f5;
  margin: auto auto auto -20px;
  width: 103%;
}

.order .order-header {
  background-color: #fff;
  border-bottom: 2px solid deepskyblue;
  margin-bottom: 50px;
  margin-top: -98px;
  width: 100%;
}
.order .order-header .header-content {
  width: 1225px;
  height: 80px;
  margin: 30px auto 30px 50px;
}
.order .order-header .header-content p {
  float: left;
  font-size: 28px;
  line-height: 80px;
  color: #424242;
  margin-right: 20px;
}
.order .order-header .header-content p i {
  font-size: 45px;
  color: deepskyblue;
  line-height: 80px;
}
.order .content {
  margin-top: -20px;
  padding: 10px;
  margin-left: 5%;
  width: 90%;
}
.order .footer {
  margin-top: 50px;
  margin-right: 50px;
  margin-bottom: 50px;
  text-align: right;
  /*float: right;*/
}

</style>