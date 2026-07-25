class ScriptBreadcrumb extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.$olDom = this.$dom.querySelector('.unit-breadcrumb')
    this.$liDom = this.$dom.querySelectorAll('.unit-breadcrumb__item')
    this.liDomLen = this.$liDom.length
    this.navWidth = this.$olDom.offsetWidth
    this.liWidth = 0
    this.video_config = JSON.parse(this.utilts.htmlDecode(params.video_config))
    // 视频播放方式
    let methodMap = {
      default: this.video_config.method,
      md: this.video_config.method_md,
      xl: this.video_config.method_xl
    }
    this.method = methodMap[this.utilts.getScreen()]
  }
  async init() {
    // 渲染
    this._initRender()
    this._setOmitShowOrHide()
    this.initHoverImg()
    this.initPrevClick()
  }
  initPrevClick() {
    const gifHoverImages = this.$dom.querySelectorAll('.unit-list-hover__image')
    if (gifHoverImages.length) {
      gifHoverImages.forEach(val => {
        val.addEventListener('click', () => {
					if (this.method === '2') val.classList.add('d-none')
          val.parentNode.parentNode.click()
        })
      })
    }
  }
  initHoverImg() {
    const videoDom = this.$dom.querySelector('[video-gif]')
    if (!videoDom) return
    setTimeout(() => {
      this.renderHoverImg(videoDom)
      videoDom.parentNode.onmouseover = e => {
        const originImg = videoDom.children[0].children[1].querySelector('.base-image__item') // hover原图的效果
        const h_dom = videoDom.querySelector('.unit-list-hover__image')
        if (h_dom && h_dom.classList.contains('hover_img_before_load')) {
          h_dom.classList.remove('hover_img_before_load')
        }
        if (originImg) originImg.classList.add('opacity0')
        videoDom.querySelector('.base-video__play')?.classList.add('d-none')
      }
      videoDom.parentNode.onmouseout = e => {
        const originImg = videoDom.children[0].children[1].querySelector('.base-image__item') // hover原图的效果
        const h_dom = videoDom.querySelector('.unit-list-hover__image')
        if (originImg) originImg.classList.remove('opacity0')
        if (h_dom) {
          h_dom.classList.add('hover_img_before_load')
        }
        videoDom.querySelector('.base-video__play')?.classList.remove('d-none')
      }
    }, 0)
	}
  renderHoverImg(node) {
		node.setAttribute('hover-img', true)
    const video_gif = node.getAttribute('video-gif')
		let hoverImgEl = ''
		if (node.querySelector('.unit-list-hover__image img')) {
			hoverImgEl = node.querySelector('.unit-list-hover__image img')
			hoverImgEl.setAttribute('lazy-src', video_gif)
			const wrapper = node.children[0].querySelector('.base-video__thumb').cloneNode(true)
      wrapper.querySelector('.base-image__item').innerHTML = hoverImgEl.outerHTML
			node.querySelector('.unit-list-hover__image').innerHTML = wrapper.outerHTML
			const hoverImg = node.querySelector('.unit-list-hover__image img')
			new LazyImg(hoverImg)
			// node.querySelector('.unit-list-hover__image img').setAttribute('lazy-type', '')
		} else {
			hoverImgEl = document.createElement('div')
			hoverImgEl.classList.add('unit-list-hover__image', 'hover_img_before_load')
			const wrapper = node.children[0].querySelector('.base-video__thumb').cloneNode(true)
      wrapper.querySelector('.base-image__item').innerHTML = `<img class="base-image__img img-fluid" lazy-src="${video_gif}"  alt="">`
			hoverImgEl.innerHTML = wrapper.outerHTML
			const hoverImg = hoverImgEl.querySelector('.unit-list-hover__image img')
			new LazyImg(hoverImg)
      node.querySelector('.base-video__preview').appendChild(hoverImgEl)
		}
	}
  /** 初始化渲染 */
  _initRender() {
    if (Utilts.ins().checkDesign()) {
      // 设计模式下不考虑设置折叠，以免反复添加节点
      return
    }
    // 计算折叠面包屑
    const $omt = document.createElement('li')
    $omt.classList.add('unit-breradcrumb__omit', 'breadcrumb-item')
    $omt.innerHTML = `<span class="icon-base-dot iconfont"></span><ul class="unit-breradcrumb__omit-ul">${this.$olDom.innerHTML}</ul>`
    // 面包屑长度
    Array.from(this.$liDom).forEach($el => this.liWidth += $el.offsetWidth)
    // 面包屑小于盒子的长度， 不操作
    if (this.liWidth < this.navWidth) return
    Array.from(this.$liDom).forEach(($li, index) => {
      if (index < this.liDomLen - 1 && index ) $li.style.display = 'none'
    })
    if(this.liDomLen > 2) Utilts.ins().afterNode(this.$liDom[0], $omt)
  }
  /** 展开功能 */
  _setOmitShowOrHide() {
    const $omit = this.$olDom.querySelector('.unit-breradcrumb__omit span')
    const $omit_ul = this.$olDom.querySelector('.unit-breradcrumb__omit-ul')
    if (!$omit) return
    $omit.addEventListener('click', () => {
      if (!$omit_ul.classList.contains('active'))  $omit_ul.classList.add('active')
      else $omit_ul.classList.remove('active')
    })
    document.body.addEventListener('click', (e) => {
      if (e.target === $omit) return
      $omit_ul.classList.remove('active')
    })
  }
}
