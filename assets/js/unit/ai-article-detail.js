class ScriptAiArticleDetail extends Script {
  constructor(params) {
    super(params)
    this.$target = document.getElementById(this.attrId)
    this.$reads = this.$target.querySelector('.unit-ai-article-detail__reads')
    this.$readsNumber = this.$target.querySelector('.unit-ai-article-detail__reads-number')
    // if (this.$reads) this.$reads.setAttribute('hidden')
  }
  render() {
    // // 阅读数为0就隐藏
    // if (!this.app.info.articleDetail.reads && this.$reads) this.$reads.setAttribute('hidden')
    // // 有阅读数才显示隐藏
    // else if (this.$readsNumber) {
    //   this.$reads.removeAttribute('hidden')
    //   this.$readsNumber.innerHTML = this.app.info.articleDetail.reads
    // }
  }
}