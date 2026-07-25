class ScriptDetailCommentList extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.proId = Number(window.app.info.page.content_id)
    this.vue = null
  }

  async init() {
    await new Load('/assets/plugins/vue.min.js')
    this.initVue()
  }

  initVue() {
    this.vue = new Vue({
      el: `#${this.attrId} .unit-detail-comment`,
      mixins: [this.data],
      methods: {
        async init() {
          // this.countryDatas = await window.app.info.getCountryList()
          this._getCommentData()
        },
        async _getCommentData() {
          await this.getCommentData({
            site_id: window.app.info.site.site_id,
            product_id: this.proId,
            page_number: this.page.page_number,
            page_size: this.page.page_size,
            position: 1,
            status: 1
          }).then(res => {
            this.scoreAvg = res.data.score_avg === 0 ? '5.0' : Number(res.data.score_avg).toFixed(1)
            if(res.data.score.length){
              const scorelist = JSON.parse(JSON.stringify(this.scoreData))
              if(res.data.score.find(_val=>_val.score === 1)){
                scorelist[0].score = res.data.score.find(_val=>_val.score === 1).score
                scorelist[0].pre = res.data.score.find(_val=>_val.score === 1).pre
              }
              if(res.data.score.find(_val=>_val.score === 2)){
                scorelist[1].score = res.data.score.find(_val=>_val.score === 2).score
                scorelist[1].pre = res.data.score.find(_val=>_val.score === 2).pre
              }
              if(res.data.score.find(_val=>_val.score === 3)){
                scorelist[2].score = res.data.score.find(_val=>_val.score === 3).score
                scorelist[2].pre = res.data.score.find(_val=>_val.score === 3).pre
              }
              if(res.data.score.find(_val=>_val.score === 4)){
                scorelist[3].score = res.data.score.find(_val=>_val.score === 4).score
                scorelist[3].pre = res.data.score.find(_val=>_val.score === 4).pre
              }
              if(res.data.score.find(_val=>_val.score === 5)){
                scorelist[4].score = res.data.score.find(_val=>_val.score === 5).score
                scorelist[4].pre = res.data.score.find(_val=>_val.score === 5).pre
              }
              this.scoreData = scorelist
            }
            if(res.data.list.length){
              res.data.list.forEach((item, index) => {
                // item.country_name = this.countryDatas.find(_val=>_val.id == item.country_id) ? this.countryDatas.find(_val=>_val.id == item.country_id).en_name : ''
                if(item.product_attr_value){
                  item.product_attr_value = JSON.parse(item.product_attr_value)
                }
                const attrObj = item.product_attr_value
                item.attrs = []
                for (const i in attrObj) {
                  const o = {}
                  o.params_key = i
                  o.params_value = attrObj[i]
                  item.attrs.push(o)
                }
              })
            }
            this.commentList = res.data.list
            this.page.page = res.data.total
            this.page.page_count = res.data.page_count
          })
        },
        async onPagination(index) {
          this.page.page_number = index
          await this._getCommentData()
          this.$nextTick(()=>{
            document.querySelector('.unit-detail-html-tabs').scrollIntoView()
          })
        },
        itemClasses(score_){
          score_ = typeof score_ === 'number' ? score_: Number(score_)
          score_ = score_ >= 5 ? 5 : score_
          let result = []
          let score = Math.floor(score_ * 2) / 2
          // 半星 (通过跟1取余判断是否为小数)
          let hasDecimal = score_ % 1 !== 0
          // 全星 （向下取整，获取全星部分）
          let integer = Math.floor(score)
          // 遍历全星
          for(let i = 0; i < integer; i++){
            result.push("icon-base-collection on")
          }
          // 处理半星
          if(hasDecimal){
            result.push("icon-base-collection half")
          }
          // 补齐
          while(result.length < 5){ // 到这里还不够五颗星，则凑空星
            result.push("icon-base-collection off")
          }
          return result
        },
        /** 评论列表 */
        getCommentData(params) {
          return new Promise((resolve, reject) => {
            Utilts.ins().request({
              url: '/product-comment/list-page',
              method: 'GET',
              params
            }).then(res => {
              if (res.code === 0) resolve(res)
              else reject(res)
            }).catch(err => reject(err))
          })
        }
      }
    })
  }

   /** 基本数据信息 */
  get data() {
    return {
      data: {
        page: {
          page_number: 1,
          page_size: 10,
          page_count: 1,
          page_total: 1
        },
        proId: this.proId,
        commentList: [],
        scoreAvg: 5.0,
        countryDatas: [],
        scoreData: [
          {
            count: 0,
            pre: 0,
            score: 1,
          },
          {
            count: 0,
            pre: 0,
            score: 2,
          },
          {
            count: 0,
            pre: 0,
            score: 3,
          },
          {
            count: 0,
            pre: 0,
            score: 4,
          },
          {
            count: 0,
            pre: 0,
            score: 5,
          }
        ]
      }
    }
  }

  render() {
    if (!window.app.info.productDetail.detail_comment_content_show) {
      this.$dom.querySelector('.unit-detail-comment').style.display = 'none'
      return
    }
    this.vue.init()
  }
}