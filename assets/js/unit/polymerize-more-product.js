class ScriptPolymerizeMoreProduct extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.$itemArr = this.$dom.querySelectorAll('.items .item')
    this.$link = this.$dom.querySelectorAll('.unit-list-category__link')
  }
  async init() {
    this._initEvent()
  }
  /** 初始化事件绑定 */
  _initEvent() {
    if(this.$itemArr.length) this.$itemArr[0].classList.add('active')
    for(const $li of this.$link) {
      $li.addEventListener('click', (e) => {
        if (e.target.className) {
          e.preventDefault()
          const parentNode = $li.parentNode.parentNode
          const brother = this.utilts.getSiblings(parentNode)
          parentNode.classList.toggle('active')
          for (let $el of brother) $el.classList.remove('active')
        }
      })
    }
  }
}