class ScriptImage extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.utils = Utilts.ins()
    this.config = params.config
    this.video_config = JSON.parse(this.utilts.htmlDecode(params.video_config))
    // purge control character from svg content
    params.images = (params.images || '').replace(/[\f\n\r\t\v]+/g, ' ')
    // 视频播放方式
    let methodMap = {
      default: this.video_config.method,
      md: this.video_config.method_md,
      xl: this.video_config.method_xl
    }
    this.method = methodMap[this.utilts.getScreen()]
    try {
      this.images = JSON.parse(this.utilts.htmlDecode(params.images))
    } catch (e) {
      console.warn(e)
    }
  }

  render() {
    if (this.$dom._zoom && this.$dom._zoom.render) {
      this.$dom._zoom.render()
    }
  }

  /** 初始化，支持异步 */
  async init() {
    // 放大图片
    if (this.images[0] && this.images[0].target === "zoom") {
      await new Load("/assets/plugins/zoom.js");
      this.$dom._zoom = new ZoomBuilder({
        attrId: this.attrId,
        dom: this.$dom,
        selector: '.unit-image--zoom[zoom-img="true"]',
        boxClass: "image-zoom-box",
      })
    }
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
}
