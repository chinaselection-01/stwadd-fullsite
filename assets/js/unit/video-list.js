class ScriptVideoList extends Script {
    constructor(params) {
      super(params)
      this.$dom = document.querySelector(`#${this.attrId}`)
      this.$video = this.$dom.querySelectorAll("[video-src]")
      this.utils = Utilts.ins()
    }
    /** 初始化，支持异步 */
    init() {
		  const that = this
      this.initNodeEvent()
      const initContent = () => {
        // 等待contentRender完成再进行初始化
        setTimeout(function () {
          that.initHoverImg()
        }, 300)
      }
      if (this.utilts.checkDesign() || (window.app && window.app.hookEvents && window.app.hookEvents['hookInitContentRender'])) {
        initContent();
        // window.addEventListener('hookInitContentRender', initContent, {
        // 	once: false
        // })
      } else {
        window.addEventListener('hookInitContentRender', initContent, {
          once: true
        })
      }
    }

    initHoverImg() {
      const doms = this.$dom.querySelectorAll('.unit-video-list__image[video-gif]')
      if (doms.length) {
        doms.forEach(item => {
          this.renderHoverImg(item)
				  const h_dom = item.querySelector('.unit-list-hover__image')
				  const originImg = item.children[0].querySelector('.base-image__item') // hover原图的效果
          item.onmouseover = e => {
            if (h_dom && h_dom.classList.contains('hover_img_before_load')) {
              h_dom.classList.remove('hover_img_before_load')
            }
            originImg.classList.add('opacity0')
						item.querySelector('.base-video__play').classList.add('d-none')
          }
          item.onmouseout = e => {
  					originImg.classList.remove('opacity0')
            if (h_dom) {
              h_dom.classList.add('hover_img_before_load')
            }
						item.querySelector('.base-video__play').classList.remove('d-none')
          }
        })
      }
    }
    renderHoverImg(node) {
      const video_gif = node.getAttribute('video-gif')
      node.setAttribute('hover-img', true)
      node.setAttribute('video-gif', video_gif)
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
        // unit-list-hover__image animate__animated hover_img_before_load
        hoverImgEl.classList.add('unit-list-hover__image', 'hover_img_before_load')
        const wrapper = node.children[0].querySelector('.base-video__thumb').cloneNode(true)
        wrapper.querySelector('.base-image__item').innerHTML = `<img class="base-image__img img-fluid" lazy-src="${video_gif}"  alt="">`
        hoverImgEl.innerHTML = wrapper.outerHTML
        const hoverImg = hoverImgEl.querySelector('.unit-list-hover__image img')
        new LazyImg(hoverImg)
        node.querySelector('.base-video__preview').appendChild(hoverImgEl)
        // node.querySelector('.unit-list-hover__image img').setAttribute('lazy-type', '')
      }
    }
    /** 绑定播放事件 */
    initNodeEvent() {
      for (let $el of this.$video) {
        $el.addEventListener("click", () => {
          if ($el.getAttribute("video-href")) {
            const link = $el.getAttribute("video-href")
            const target = $el.getAttribute("video-target") || "_self"
            if (target==='block') return
            if (target === "_self") window.location.href = globalThis.Server.getRinseHref(link, window.app.info.site)
            else window.open(globalThis.Server.getRinseHref(link, window.app.info.site))
          } else {
            let src = $el.getAttribute("video-src")
            this.playVideo(src)
          }
        })
      }
    }
    /** 播放视频 */
    playVideo(url) {
      const video_popup_content = `
        <div class="unit-video-popup__window">
          <div class="unit-video-popup__close">×</div>
          <div class="unit-video-popup__content">
            <iframe src="" frameborder="0" allow="fullscreen"></iframe>
          </div>
        </div>`
      const video_popup_node = document.getElementById("video-popup")
      if (!video_popup_node) {
        const video_node = document.createElement("div")
        video_node.innerHTML = video_popup_content
        video_node.getElementsByTagName("iframe")[0].src = url
        video_node.setAttribute("id", "video-popup")
        video_node.className = "unit-video-popup__window-wrap"
        video_node.classList.add("show")
        video_node
          .getElementsByClassName("unit-video-popup__close")[0]
          .addEventListener("click", function () {
            video_node.classList.remove("show")
            video_node.getElementsByTagName("iframe")[0].src = ""
          })
        document.body.appendChild(video_node)
      } else {
        video_popup_node.getElementsByTagName("iframe")[0].src = url
        video_popup_node.classList.add("show")
      }
    }
  }
  