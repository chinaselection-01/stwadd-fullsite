class ScriptLandingNav extends Script {
  constructor(params) {
    super(params)
    this.$mainModule = document.querySelector('[package-block-type="main"]')
    this.$anchorList = this.$mainModule.querySelectorAll('[anchor-name][is-show-top="1"]')
    this.$navInfo = document.querySelector(`#${this.attrId}`)
    this.$hrefList = this.$navInfo.querySelectorAll('[anchor-href]')
    this.$navContainer = document.querySelector('[package-block-type="breadcrumb"]')
  }
  get navHeight() {
    return this.$navContainer.offsetHeight
  }
  async init() {
    window.addEventListener('scroll', () => {
      this.landingScrollPosition()
    })
    window.addEventListener('resize', () => {
      this.landingScrollPosition()
    })
  }
  /** 广告页时，滚动时，显示相对应的导航 */
  landingScrollPosition() {
    const scrollTop = window.pageYOffset
    for (var i = 0; i < this.$hrefList.length; i++) {
      if (scrollTop + this.navHeight >= this.$anchorList[i].offsetTop) {
        for (var j = 0; j < this.$hrefList.length; j++) {
          this.$hrefList[j].className = 'unit-landing-nav__a'
        }
        this.$hrefList[i].className = 'unit-landing-nav__a active'
      }
    }
  }
}