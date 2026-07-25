class ScriptVideoPopup extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.utils = Utilts.ins()
    this.config = JSON.parse(this.utilts.htmlDecode(params.config))
    this.isIframe = /^\s*<iframe[^>]*>[\s\S]*?<\/iframe>\s*$/.test(this.$dom.querySelector('[video-src]')?.getAttribute('video-src')||'')
    this.useXgVideo = parseInt(params.useXgVideo)

    // 视频播放方式
    let methodMap = {
      default: this.config.method,
      md: this.config.method_md,
      xl: this.config.method_xl
    }
    this.method = methodMap[this.utilts.getScreen()]
    if (params.gifData) {
      const gifData = JSON.parse(this.utilts.htmlDecode(params.gifData))
      this.video_gif = gifData.video_gif
      this.is_allow_gif = gifData.is_allow_gif
    }
  }
  /** 初始化，支持异步 */
  async init() {
    this.initBackgroundVideo()
    this.initNodeEvent()
    // iframe没封面，直接显示
    if (!this.config.default_src && this.method === '2' && this.config.autoplay.toString() !== '1' && this.isIframe) {
      this.videoPlayMothod2()
    }
    // if (this.config.autoplay.toString() !== '1' && this.config.default_src) {
    if (this.config.default_src) {
      if (this.is_allow_gif && this.video_gif) this.initHoverImg()
      this.initPrevClick()
    }
  }
  initBackgroundVideo() {
    if (this.$dom.classList.contains('breadcrumb-background-video__wrapper')) {
      const ancestor = this.$dom.closest('[package-item="module"]')
      if (!ancestor) return
      ancestor.style.position = 'relative'
      const $backgroundVideo = this.$dom
      const isDesignMode = Utilts.ins().checkDesign();
      const videoSrc = $backgroundVideo.querySelector('[video-src]');
      const hasVideo = videoSrc && videoSrc.getAttribute('video-src');
      $backgroundVideo.style.pointerEvents = 'none';
      ancestor.prepend($backgroundVideo)
      if (hasVideo) {
        setTimeout(() => {
          const style = window.getComputedStyle(ancestor)
          const hasImage = /url\(/i.test(style.backgroundImage)
          const isGradient = /gradient/i.test(style.backgroundImage)
          // console.log('hasImage', hasImage)
          // console.log('isGradient', isGradient)
          if (isGradient && hasImage) {
            // 去掉图片
            try {
              const list = style.backgroundImage.split(',')
              if (list.length > 1) {
                const str = style.backgroundImage
                ancestor.style.backgroundImage = str.replace(list[0] + ',', '')
              }
            } catch (e) {}
          } else if (!isGradient) {
            ancestor.style.backgroundImage = 'none'
          }
        }, isDesignMode ? 1000: 0)
      } else {
        if (!isDesignMode) {
          $backgroundVideo.remove()
        }
      }
    }

  }
  /** 绑定播放事件 */
  initNodeEvent() {
    let config = JSON.parse(JSON.stringify(this.config))
    let $el = this.$dom.querySelector('[video-src]')
    let url = $el?.getAttribute('video-src') || ''
    const isIframe = this.isIframe
    const isMp4 = /\.(mp4|m3u8)(\?|$)/i.test(url || '')
		const showMask = config.show_mask * 1
		const opacity = showMask?`filter:brightness(${config.opacity});`:''
    const showControls = config.controls && config.controls.toString() === '1' || false

    if (this.utils.checkDesign()) document.getElementById('video-popup')?.remove() // 删除视频重新渲染，去掉正在播放的视频弹窗
    
    if (url) {
      // 重播
      const replayWrap =
        `<div class="base-video__wrap--replay">
          <div class="replay-icon">
            <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
              <path class="ytp-svg-fill" d="M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z" id="ytp-id-125"></path>
            </svg>
          </div>
        </div>`
      let videoList = [
        `<div class="base-video__wrap">
        ${showControls && this.method=== '2' ? '<div class="base-video__wrap--close">×</div>': ''}
        ${showControls && this.method=== '2' ? replayWrap : replayWrap}
        <video
          style="display:block;height:auto;margin:0 auto;max-width:100%;${opacity}"
          autoplay
          controlsList="nodownload"
          webkit-playsinline="true"
          playsinline="true"
          preload="metadata"
          src="${url}"
          ${config.loop && config.loop.toString() === '1' ? ' loop' : ''}
          ${config.muted && config.muted.toString() === '1' ? ' muted' : ''}
          ${showControls ? ' controls' : ''}
        />
        </div>`,
        '<div class="base-video__wrap">' +
        '<iframe frameborder="0" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" src="' + url + '"></iframe>'
        + '</div>'
      ]

      if (this.method === '2') {
        let videoHtml;
        let iframeUrl = []
        if (isIframe) {
          iframeUrl = globalThis.Server.iframeAutoplay(url).split('<iframe')
          videoHtml = `<iframe style="filter:brightness(${showMask?config.opacity:'1'})"`+iframeUrl[1]
        } else if (isMp4) {
          if (this.useXgVideo) {
            const videothumbDom = $el.querySelector('.base-video__thumb img')
            const videothumb = videothumbDom.getAttribute('src') || videothumbDom.getAttribute('lazy-src')
            new VideoPlayer($el.querySelector('.video-container'), url, {
              ...config,
              trigger: 'backgroundAutoPlay',
              playerConfig: {
                poster: videothumb,
                fitVideoSize: 'fixWidth'
              }
            })
            return
          } else {
            videoHtml = videoList[0]
          }
        } else {
          videoHtml = globalThis.Server.iframeAutoplay(videoList[1])
        }
        const resetVideo = $el.resetVideo = () => {
          $el.classList.remove('play')
          const $preview = $el.querySelector('.base-video__preview')
          if ($preview) {
            const videoWrapDom = $preview.querySelector('.base-video__wrap')
            if (videoWrapDom) {
              videoWrapDom.remove()
            }
            $preview.classList.remove('play')
          }
        }
        const playVideo =  $el.playVideo = () => {
          setTimeout(() => {
            $el.querySelector('.unit-list-hover__image')?.classList.add('d-none')
          }, 100)
          $el.querySelector('.base-video__preview').innerHTML += videoHtml
          $el.querySelector('.base-video__preview').classList.add('play')
          $el.classList.add('play')
          const closeBtn = $el.querySelector('.base-video__preview').querySelector('.base-video__wrap--close')
          const replayBtn = $el.querySelector('.base-video__preview').querySelector('.replay-icon')
          if (showControls && closeBtn) {
            const closeVideo = (event) => {
              event.stopPropagation()
              event.preventDefault()
              const videoWrapDom =  $el.querySelector('.base-video__preview').querySelector('.base-video__wrap')
              if (videoWrapDom) {
                videoWrapDom?.remove()
                $el.querySelector('.base-video__preview').classList.remove('play')
                $el.classList.remove('play')
              }
              $el.querySelector('.unit-list-hover__image')?.classList.remove('d-none')
              $el.children[0].querySelector('.base-image__item')?.classList.remove('opacity0')
              $el.querySelectorAll('img[lazy-src][src=""], img[lazy-src]:not([src])').forEach(img => {
                const imgSrc = img.getAttribute('data-src') || img.getAttribute('lazy-src');
                if (imgSrc) {
                  // 设置异常图片的src
                  img.setAttribute('src', imgSrc);
                }
              });
            }
            closeBtn.addEventListener('click', closeVideo, { once: true })
          }
          if (showControls && replayBtn) {
            const videoDom = $el.querySelector('.base-video__wrap video')
            const replayWrapDom = $el.querySelector('.base-video__preview').querySelector('.base-video__wrap--replay')
            const showReplayBtn = (event) => {
              event.stopPropagation()
              event.preventDefault()
              console.log('replayWrapDom', replayWrapDom)

              if (config.loop.toString() !== '1') {
                // console.log('不是循环播放');
                // let elementToRemove = $el.querySelector('.base-video__wrap')
                // let parentElement = elementToRemove.parentNode
                // parentElement.removeChild(elementToRemove)
                // $el.querySelector('.base-video__preview').classList.remove('play')
              } else if(replayWrapDom) {
                replayWrapDom.style.display = 'flex'
                videoDom.controls = false
              }
            }
            videoDom?.addEventListener('ended', showReplayBtn)
            const replay = (event) => {
              event.stopPropagation()
              event.preventDefault()
              videoDom.currentTime = 0
              videoDom.play()
              replayWrapDom.style.display = 'none'
              videoDom.controls = true
            }
            replayBtn?.addEventListener('click', replay)
          }
          const videothumb = $el.querySelector('.base-video__thumb img')
          const videoDom = $el.querySelector('.base-video__preview video')
          if (videothumb && videoDom) videoDom.poster = videothumb.getAttribute('src') || videothumb.getAttribute('lazy-src')
          // 当不设置循环播放，视频重播回到封面图页面。并且图标使用最新设计的图标
          if (videoDom && config.loop.toString() !== '1') {
            const backToCover = () =>{
              let elementToRemove = $el.querySelector('.base-video__wrap')
              let parentElement = elementToRemove.parentNode
              parentElement.removeChild(elementToRemove)
              $el.querySelector('.base-video__preview').classList.remove('play')
            }
            videoDom.addEventListener('ended', backToCover)
          }
        }
        // 当前播放
        if (config.autoplay.toString() === '1' && $el.querySelector('.base-video__preview').classList.value.indexOf('play') === -1) {
          // 自动播放
          playVideo()
        } else {
          // 手动播放
          if (isIframe) {
            videoHtml = this.config.default_src ? videoHtml : globalThis.Server.iframeAutoplayClear(videoHtml, config.muted && config.muted.toString() === '1')
          }
        }
        $el.addEventListener('click', this.videoPlayMothod2 = () => {
          if ($el.querySelector('.base-video__preview').classList.value.indexOf('play') === -1) {
            playVideo()
          }

          // if (/\.mp4(\?|$)/i.test(url) && window.app.utilts.checkScreenMobile()) {
          //   // 手机端
          //   $el.querySelector('video').requestFullscreen()
          // }
        })
      } else {
        let isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        $el.addEventListener('click', () => {
          const href = $el.getAttribute('video-href')
          const videothumb = $el.querySelector('.base-video__thumb img')
          if (href && !/^javascript:;$/.test(href) && !/^#/.test(href)) {
            const target = $el.getAttribute('video-target') || '_self'
            if (target === '_self') window.location.href = globalThis.Server.getRinseHref(href, window.app.info.site)
            else window.open(globalThis.Server.getRinseHref(href, window.app.info.site))
          } else {
            let videoPopupNode = document.getElementById('video-popup')
            function closeVideoPopupNode() {
              videoPopupNode.classList.remove("show")
              videoPopupNode.getElementsByTagName("video")[0].pause()
              videoPopupNode.innerHTML = ''
							videoPopupNode.remove()
            }
            if (!videoPopupNode || videoPopupNode.innerHTML === '') {
              videoPopupNode = document.createElement('div')
              videoPopupNode.innerHTML = `
              <div class="unit-video-popup__window">
                <div class="unit-video-popup__close">×</div>
                <div class="unit-video-popup__content">${videoList.join('')}</div>
              </div>`
              videoPopupNode.setAttribute('id', 'video-popup')
              videoPopupNode.className = "unit-video-popup__window-wrap"
              videoPopupNode.getElementsByClassName("unit-video-popup__close")[0].addEventListener('click', closeVideoPopupNode)
              document.body.appendChild(videoPopupNode)
            }
            let $popupVideo = videoPopupNode.getElementsByTagName("video")[0];
            if (isIframe) {
              videoPopupNode.getElementsByTagName("iframe")[0].outerHTML = globalThis.Server.iframeAutoplay(url)
              $popupVideo.src = ''
              $popupVideo.style.display = 'none'
            } else if (isMp4) {
              $popupVideo.src = url
              $popupVideo.style.display = 'block'
              if (videothumb && $popupVideo) $popupVideo.poster = videothumb.getAttribute('src') || videothumb.getAttribute('lazy-src')
              videoPopupNode.getElementsByTagName("iframe")[0].src = ''
              videoPopupNode.getElementsByTagName("iframe")[0].style.display = 'none'
              if (window.app.utilts.checkScreenMobile()) {
                // if (isiOS) {
                //   setTimeout(() => { $popupVideo.webkitEnterFullscreen() }, 500)
                // } else {
                //   $popupVideo.requestFullscreen()
                // }
                const showPopupVideo = (show) => {
									if (show) {
										videoPopupNode.style.zIndex = ''
										videoPopupNode.style.opacity = ''
									} else {
										videoPopupNode.style.zIndex = -1
										videoPopupNode.style.opacity = 0
									}
                }
                if (isiOS) {
                  $popupVideo.style['aspect-ratio'] = '16 / 9';
                  $popupVideo.style['height'] = '56.25vw';
									$popupVideo.addEventListener('webkitendfullscreen', () => {
										closeVideoPopupNode()
										$popupVideo.style['aspect-ratio'] = '';
                    $popupVideo.style['height'] = 'auto';
									})
									let hanlder = function() {
										// 视频缓冲完毕
										if (videoPopupNode.classList.contains('show')) {
											$popupVideo.webkitEnterFullscreen()
										}
										$popupVideo.removeEventListener('canplaythrough', hanlder);
									}
									$popupVideo.addEventListener('canplaythrough', hanlder);
                } else {
                  $popupVideo.requestFullscreen().then(() => {
                    // 全屏成功
                    showPopupVideo(0)
                    let tempScrollY = window.scrollY
                    function updateFullscreenStatus() {
                      if (document.fullscreenElement !== $popupVideo) {
                        window.scrollTo(0, tempScrollY);
                        closeVideoPopupNode()
                        showPopupVideo(1)
                      }
                    }
                    $popupVideo.addEventListener('fullscreenchange', updateFullscreenStatus);
                  })
                }
              }
            } else {
              videoPopupNode.getElementsByTagName("iframe")[0].src = url
              videoPopupNode.getElementsByTagName("iframe")[0].style.display = 'block'
              $popupVideo.src = ''
              $popupVideo.style.display = 'none'
            }
            videoPopupNode.classList.add('show')
            const $replay = videoPopupNode.querySelector('.base-video__wrap--replay')
            if (showControls && $replay) {
              const showReplayBtn = (event) => {
                event.stopPropagation()
                event.preventDefault()
                if($replay) {
                  $replay.style.display = 'flex'
                  $popupVideo.controls = false
                }
              }
              $popupVideo?.addEventListener('ended', showReplayBtn)
              const replay = (event) => {
                event.stopPropagation()
                event.preventDefault()
                $popupVideo.currentTime = 0
                $popupVideo.play()
                $replay.style.display = 'none'
                $popupVideo.controls = true
              }
              $replay?.addEventListener('click', replay)
            }
          }
        })
      }
    }

  }
  initPrevClick() {
    const gifHoverImages = this.$dom.querySelectorAll('.unit-list-hover__image')
    if (gifHoverImages.length) {
      gifHoverImages.forEach(val => {
        val.addEventListener('click', () => {
					if (this.method === '2') val.classList.add('d-none')
          val.parentNode?.parentNode.click()
        })
      })
    }
  }
  initHoverImg() {
    const videoDom = this.$dom.querySelector('.base-video')
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
		node.setAttribute('video-gif', this.video_gif)
		let hoverImgEl = ''
		if (node.querySelector('.unit-list-hover__image img')) {
			hoverImgEl = node.querySelector('.unit-list-hover__image img')
			hoverImgEl.setAttribute('lazy-src', this.video_gif)
			const wrapper = node.children[0].querySelector('.base-video__thumb').cloneNode(true)
      console.log('wrapper', wrapper);
      if (wrapper.querySelector('.base-image__item')) {
        wrapper.querySelector('.base-image__item').innerHTML = hoverImgEl.outerHTML
      } else {
        wrapper.querySelector('.base-image').innerHTML = `
          <div class="base-image__item base-image__item--default ">
            ${hoverImgEl.outerHTML}
          </div>
        `
      }
			node.querySelector('.unit-list-hover__image').innerHTML = wrapper.outerHTML
			const hoverImg = node.querySelector('.unit-list-hover__image img')
			new LazyImg(hoverImg)
			// node.querySelector('.unit-list-hover__image img').setAttribute('lazy-type', '')
		} else {
			hoverImgEl = document.createElement('div')
			// unit-list-hover__image animate__animated hover_img_before_load
			hoverImgEl.classList.add('unit-list-hover__image', 'hover_img_before_load')
			const wrapper = node.children[0].querySelector('.base-video__thumb').cloneNode(true)
      if (wrapper.querySelector('.base-image__item')) {
        wrapper.querySelector('.base-image__item').innerHTML = `<img class="base-image__img img-fluid" lazy-src="${this.video_gif}"  alt="">`
      } else {
        wrapper.querySelector('.base-image').innerHTML = `
          <div class="base-image__item base-image__item--default ">
            <img class="base-image__img img-fluid" lazy-src="${this.video_gif}" src="${this.video_gif}"  alt="">
          </div>
        `
      }
			hoverImgEl.innerHTML = wrapper.outerHTML
      console.log('hoverImgEl', hoverImgEl);
			const hoverImg = hoverImgEl.querySelector('.unit-list-hover__image img')
			new LazyImg(hoverImg)
			node.querySelector('.base-video__preview').appendChild(hoverImgEl)
		}
	}
}
