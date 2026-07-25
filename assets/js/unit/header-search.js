class ScriptHeaderSearch extends Script {
  constructor(params) {
    super(params)
    this.showInput = params.showInput
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.$box = this.$dom.querySelector('.unit-header-search__box')
    this.$btn = this.$dom.querySelector('.unit-header-search__btn')
    this.$input = this.$dom.querySelector('.unit-header-search__input')
    this.$modal = this.$dom.querySelector('.unit-header-search__modal')
    this.$modalBtn = this.$dom.querySelector('.unit-header-search__modal-btn')
    this.$modalInput = this.$dom.querySelector('.unit-header-search__modal-input')
    this.$close = this.$dom.querySelector('.unit-header-search__modal-close')
    this.isGroup = this.$box.hasAttribute('group')
    this.$cSearchMask = null
    this.$cSearchBox = null
  }
  init() {
    if (!window.app.info.utilts.checkDesign()) {
      this.initBtnEvent()
      this.initInputEvent()
      if (!this.isGroup) this.initCloseSearchPop()
    }
  }
  initBtnEvent() {
    if (this.$btn) {
      this.$btn.addEventListener('click', (e) => {
        if (this.showInput !== '1') {
          e.stopPropagation()
          this.setSearchMask()
        }
        if (this.isGroup) this.toSearch()
      })
    }
    if (this.$modalBtn) this.$modalBtn.addEventListener('click', (e) => this.toSearch())
    window.addEventListener('scroll', () => {
      this.hideSearchBox()
    })
    window.addEventListener('click', (e) => {
      if (this.$cSearchBox && !this.$cSearchBox.contains(e.target) && e.target !== this.$btn && !this.$btn.contains(e.target)) this.hideSearchBox()
    })
  }
  setSearchMask() {
    if (this.$cSearchBox && this.$cSearchBox.querySelector('.unit-header-search__modal.show')) {
      this.hideSearchBox()
      return false
    }
    this.$cSearchMask = document.querySelector('.search-mask')
    if (!this.$cSearchMask) {
      this.$cSearchMask = document.createElement('div')
      this.$cSearchMask.classList.add('search-mask')
      this.$cSearchMask.innerHTML = `<div class="search-mask-body"></div>`
      document.body.appendChild(this.$cSearchMask)
    }
    this.$cSearchMask.querySelector('.search-mask-body').classList.add('show')
    this.$cSearchMask.style.top = document.querySelector(`[package-type="header"]`).offsetHeight + 'px'
    this.$cSearchBox = document.querySelector('.unit-header-search__modal-box')
    if (!this.$cSearchBox) {
      this.$cSearchBox = document.createElement('div')
      this.$cSearchBox.classList.add('unit-header-search__modal-box')
      document.querySelector(`[package-type="header"] [package-group="module"]`).appendChild(this.$cSearchBox)
    }
    this.$cSearchBox.innerHTML = `<div class="unit-header-search__modal">${this.$modal.innerHTML}</div>`
    this.$cSearchBox.querySelector('.unit-header-search__modal').classList.add('show')
    this.$cSearchBox.querySelector('.unit-header-search__modal .unit-header-search__modal-input').focus()
    document.querySelector(`[package-type="header"]`).style['background-color'] = `var(--header-bg) !important`
    this.searchInputEvent()
  }
  searchInputEvent() {
    let cSearchBoxInput = this.$cSearchBox.querySelector('.unit-header-search__modal .unit-header-search__modal-input')
    if (cSearchBoxInput) {
      cSearchBoxInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.toSearch(cSearchBoxInput.value)
      })
    }
    let cSearchBoxSearchBtn = this.$cSearchBox.querySelector('.unit-header-search__modal .unit-header-search__modal-btn')
    if (cSearchBoxSearchBtn) cSearchBoxSearchBtn.addEventListener('click', (e) => this.toSearch(cSearchBoxInput.value))
    let cSearchBoxClose = this.$cSearchBox.querySelector('.unit-header-search__modal .unit-header-search__modal-close')
    if (cSearchBoxClose) {
      cSearchBoxClose.classList.add('d-none')
      cSearchBoxClose.addEventListener('click', () => {
        cSearchBoxInput.value = ''
        cSearchBoxClose.classList.add('d-none')
      })
      cSearchBoxInput.addEventListener('keyup', (e) => {
        if (cSearchBoxInput.value.trim()) cSearchBoxClose.classList.remove('d-none')
        else cSearchBoxClose.classList.add('d-none')
      })
    }
  }
  hideSearchBox() {
    if (this.$cSearchBox && this.$cSearchBox.querySelector('.unit-header-search__modal.show')) {
      if (this.$cSearchMask) this.$cSearchMask.querySelector('.search-mask-body').classList.remove('show')
      this.$cSearchBox.innerHTML = ''
      // document.querySelector(`[package-type="header"]`).removeAttribute('style')
      document.querySelector(`[package-type="header"]`).style['background-color'] = ``
    }
  }
  initInputEvent() {
    if (this.$input) {
      this.$input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.toSearch()
      })
    }
    if (this.$modalInput) {
      this.$modalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.toSearch()
      })
    }
  }
  initCloseSearchPop() {
    if (this.$close) {
      this.$close.addEventListener('click', () => {
        this.$modalInput.value = ''
      })
    }
  }
  toSearch(value) {
    const content = value || this.$input.value || this.$modalInput.value
    // 清除缓存里的搜索参数
    this.utilts.removeItem('search-pattern')
    if (content) window.location.href = globalThis.Server.getRinseHref(`/search.html?keyword=${content}`, window.app.info.site)
  }
}