class ScriptDetailHtmlTab extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.$li = this.$dom.querySelectorAll(`${params.selector}`)
    this.$item = this.$dom.querySelectorAll('.tab-pane')
    this.$box = this.$dom.querySelector('.unit-detail-html-tabs__nav-box')
    this.$content = this.$dom.querySelector('.tab-content')
  }
  async init() {
    this.$dom.parentNode.style.position = 'static'
    this._setTabToggle()
    // this.initNavPosition()
  }
  /** tab切换功能 */
  _setTabToggle() {
    Array.from(this.$li).forEach(($el, index) => {
      const setCssHref = (mode) => {
        let cssHref = ''
        if (mode === 1) {
          cssHref = '//' + window.serverInfo.editorDomain + '/cloud-editor-responsive-out.css?v=4'
        } else if (mode === 2) {
          // cssHref = '/dist/css/detail.css'
          if (typeof window.app.info.page.detail_css_name === 'string' && window.app.info.page.detail_css_name.length) {
            cssHref = `/style/detail.css?unit=detail,${window.app.info.page.detail_css_name}`
          }
        }
        if (cssHref && document.querySelector('[style-mode="editor"]').getAttribute('href') !== cssHref) {
          document.querySelector('[style-mode="editor"]').setAttribute('href', cssHref)
        }
      }
      if (index === 0 && Utilts.ins().checkDesign()) {
        // 设计模式下客户端赋值
        const mode = parseInt($el.getAttribute('edit-mode'))
        setCssHref(mode)
      }
      $el.addEventListener('click', (e) => {
        const mode = parseInt(e.target.parentNode.getAttribute('edit-mode'))
        setCssHref(mode)

        Array.from(this.$li).forEach((li, i) => {
          if (index === i) li.querySelector('a').classList.add('active')
          else li.querySelector('a').classList.remove('active')
        })
        Array.from(this.$item).forEach((item, idx) => {
          if (idx === index) {
            item.classList.add('show')
            item.classList.add('active')
          } else {
            item.classList.remove('show')
            item.classList.remove('active')
          }
        })
      })
    })
  }
  // initNavPosition() {
  //   if (window.innerWidth < 769) {
  //     const that = this
  //     window.addEventListener('scroll', that.debounce(() => {
  //       const y = that.$content.getBoundingClientRect().y
  //       if (y < 120) that.$box.classList.add('fix')
  //       else that.$box.classList.remove('fix')
  //     }, 0))
  //   }
  // }
  render() {
    const $comment_tab = this.$dom.querySelector('.unit-detail-html-tabs__nav-review')
    const $comment = $comment_tab.querySelector('.comment-quantity')
    if ($comment_tab) {
      if (window.app.info.productDetail.detail_comment_content_show) $comment_tab.classList.add('active')
    }
    if ($comment && window.app.info.productDetail.detail_comment_score_show && window.app.info.productDetail.detail_comment_total) {
      $comment.innerHTML = `(${window.app.info.productDetail.detail_comment_total})`
    }
    this.fixTabsNum();
  }

  /**
   * 修正tabs数量值
   */
  fixTabsNum() {
    const $comment_tab = this.$dom.querySelector('.unit-detail-html-tabs__nav-review')
    let $unitTabs = this.$box.closest('.unit-detail-html-tabs');
    if ($unitTabs && $comment_tab && $comment_tab.classList.contains('active')) {
      $unitTabs.dataset.tabsNum = $unitTabs.querySelectorAll('.unit-detail-html-tabs__nav-box > .unit-detail-html-tabs__nav > li').length;
    }
  }

  debounce(fn, delay = 500){
    let timer = null //借助闭包
    return function() {
      if(timer) clearTimeout(timer)
      timer = setTimeout(fn,delay) // 简化写法
    }
  }
}