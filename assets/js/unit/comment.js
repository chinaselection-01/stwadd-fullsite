class ScriptComment extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.proId = Number(window.app.info.page.content_id)
    this.pageType = window.app.info.page.page_type
    this.vue = null
  }

  async init() {
    await new Load('/assets/plugins/vue.min.js')
    this.initVue()
  }

  initVue() {
    this.vue = new Vue({
      el: `#${this.attrId} .unit-comment`,
      mixins: [this.data],
      methods: {
        async init() {
          // this.countryDatas = await window.app.info.getCountryList()
          if (!this.isDesign) {
            await this.updataDetailCommentConfig()
          } else {
            this.commentConfig.content_show = 1
            this.commentConfig.score_show = 1
            this.commentConfig.btn_show = 1
            this.commentConfig.login_show = 1
          }
          if (this.commentConfig.content_show === 1) {
            this._getCommentData()
            if (window.app.info.user.is_login) {
              this.getUserInfo()
            }
          } else {
            this.currentDom.parentNode?.removeChild(this.currentDom)
          }
        },
        getUserInfo() {
          Utilts.ins().request({
            url: '/member/detail',
            method: 'GET',
            params: {}
          }).then(res => {
            if (res.code === 0) {
              window.app.info.user.nickname = res.data.nickname
              console.log('window.app.info.user', window.app.info.user);
            }
          }).catch(err => reject(err))
        },
        treeToList(tree) {
          const list = [];
          function traverse(node) {
            let resNode = {...node}
            delete resNode.children
            list.push(resNode);
            if (node.children) node.children.forEach(traverse);
          }
          tree.forEach(traverse);
          return list;
        },
        async _getCommentData() {
          await this.getCommentData({
            site_id: window.app.info.site.site_id,
            product_id: this.proId,
            page_number: this.page.page_number,
            page_size: this.page.page_size,
            position: 1,
            status: 1,
            comment_type: this.pageType === 'article_detail' ? 2 : 3
          }).then(res => {
            if(res.data.list.length){
              res.data.list.forEach((item, index) => {
                item.group_comment_tree = this.treeToList(item.group_comment_tree)
              })
            }
            console.log('res.data.list', res.data.list);
            this.commentList = res.data.list
            this.page.total = res.data.total
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
        },
        async addReview(parent_id = 0) {
          if (this.commentConfig.login_show && !window.app.info.user.is_login){
            window.location.href = globalThis.Server.getRinseHref('/login.html', window.app.info.site)
            return false
          }
          await new Load('/assets/plugins/comment-form.js')
          let params = {page_type: this.pageType}
          params.product_id = window.app.info.page.content_id
          if (parent_id) params.parent_id = parent_id
          new PluginCommentForm(params).modal()
        },
        async updataDetailCommentConfig() {
          return new Promise((resolve, reject) => {
            Utilts.ins().request({
              url: '/product-comment/get-comment-config',
              method: 'GET',
              params: {
                site_id: window.app.info.site.site_id,
                type: this.pageType === 'article_detail' ? 2 : 3
              }
            })
              .then(res => {
                this.commentConfig.content_show = res.data.is_show_module || 0
                this.commentConfig.score_show = res.data.is_show_detail || 0
                this.commentConfig.btn_show = res.data.is_show || 0
                this.commentConfig.login_show = res.data.is_login || 0
                resolve()
              })
              .catch(err => reject(err))
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
          total: 0
        },
        proId: this.proId,
        pageType: this.pageType,
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
        ],
        videoFormat: ['.mp4', '.flv', '.f4v', '.avi', '.mov', '.wmv'],
        commentConfig: {
          score_show: 0,
          content_show: 0,
          btn_show: 0,
          login_show: 0
        },
        currentDom: this.$dom,
        isDesign: this.utilts.checkDesign()
      }
    }
  }

  render() {
    this.vue.init()
  }
}