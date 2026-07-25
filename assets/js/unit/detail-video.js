class ScriptDetailVideo extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.$parent = this.$dom.querySelector('.unit-detail-video')
    this.$content = this.$dom.querySelector('.unit-detail-video__content')
    this.videoUrl = this.$dom.querySelector('[video-src]').getAttribute('video-src') || ''
    this.config = JSON.parse(decodeURIComponent(params.config))
    
    this.isMp4 = /\.mp4(\?|$)/i.test(this.videoUrl)
    this.isIframe = /^\s*<iframe[^>]*>[\s\S]*?<\/iframe>\s*$/.test(this.videoUrl)

    let methodMap = {
      default: this.config.method,
      md: this.config.method_md,
      xl: this.config.method_xl
    }
    this.method = methodMap[this.utilts.getScreen()]
  }
  async init() {
    // 绑定视频相关事件
    this.initNodeEvent()
    // iframe没封面，直接显示
    if (!this.config.default_src && this.method === '2' && this.config.autoplay.toString() !== '1' && (this.isIframe || !this.isMp4)) {
      this.videoPlayMothod2()
    }
  }
  /** 绑定播放事件 */
  initNodeEvent() {
    let config = JSON.parse(JSON.stringify(this.config))
    let $el = this.$dom.querySelector('[video-src]')
    let url = this.videoUrl
    const isIframe = this.isIframe

    // let maxHeight = ''
    // const handleResize = () => {
    //   maxHeight = `${this.$parent.offsetWidth * 0.5625}px` // 16:9
    //   if (window.innerWidth < 1200) { // 仅PC端限制最大高度
    //     maxHeight = ''
    //   }
    //   if (isIframe || !this.isMp4) {
    //     $el.querySelector('.base-video__preview').style.height = maxHeight
    //   } else {
    //     const $video = $el.querySelector('.base-video__preview video')
    //     $video && ($video.style.height = maxHeight)
    //   }
    // }
    // handleResize()
    // // 监听 container 尺寸变化
    // var observer = new ResizeObserver((entries) => {
    //   entries.forEach((entry) => {
    //     if (entry.target === this.$parent) {
    //       handleResize()
    //     }
    //   });
    // });
    // // 监听目标元素的宽度变化
    // observer.observe(this.$parent);

    if (url) {
      let videoList = [
        '<video style="filter:brightness('+((config.show_mask * 1)?config.opacity:'1')+');display:block;height:auto;margin:0 auto;max-width:100%;" autoplay controlsList="nodownload" webkit-playsinline="true" playsinline="true" preload="metadata" src="' + url + '"' + (config.loop && config.loop.toString() === '1' ? ' loop' : '') + (config.muted && config.muted.toString() === '1' ? ' muted' : '') + (config.controls && config.controls.toString() === '1' ? ' controls' : '') + '></video>',
        '<iframe frameborder="0" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" src="' + url + '"></iframe>'
      ]
      if (this.method === '2') {
        let videoHtml;
        if (isIframe) {
          videoHtml = globalThis.Server.iframeAutoplay(url)
        } else if (this.isMp4) {
          videoHtml = videoList[0]
          $el.querySelector('.base-video__preview').style['aspect-ratio'] = 'auto'
        } else {
          videoHtml = globalThis.Server.iframeAutoplay(videoList[1])
        }

        let initHtml = $el.querySelector('.base-video__preview').innerHTML
        const resetVideo = () => {
          $el.querySelector('.base-video__preview').innerHTML = initHtml;
          $el.querySelector('.base-video__preview').classList.remove('play')
          $el.classList.remove('play')
          this.$dom.querySelector('.unit-detail-video__close').style.display = 'none'
          // iframe没封面，直接显示
          if (!this.config.default_src && this.config.autoplay.toString() !== '1' && (this.isIframe || !this.isMp4)) {
            this.videoPlayMothod2()
          }
        }
        this.$dom.querySelector('.unit-detail-video__close').addEventListener('click', resetVideo)

        const playVideo = () => {
          initHtml = $el.querySelector('.base-video__preview').innerHTML

          $el.querySelector('.base-video__preview').innerHTML += videoHtml
          $el.querySelector('.base-video__preview').classList.add('play')
          $el.classList.add('play')

          this.$dom.querySelector('.unit-detail-video__close').style.display = 'block'

          const videothumb = $el.querySelector('.base-video__thumb img')
          const videoDom = $el.querySelector('.base-video__preview video')
          if (videothumb && videoDom) videoDom.poster = videothumb.getAttribute('src') || videothumb.getAttribute('lazy-src')
        }
        // 当前播放
        if (config.autoplay.toString() === '1' && $el.querySelector('.base-video__preview').classList.value.indexOf('play') === -1) {
          // 自动播放
          playVideo()
        } else {
          // 手动播放
          if (isIframe || !this.isMp4) {
            videoHtml = this.config.default_src ? videoHtml : globalThis.Server.iframeAutoplayClear(videoHtml, config.muted && config.muted.toString() === '1')
          }
          $el.addEventListener('click', this.videoPlayMothod2 = () => {
            if ($el.querySelector('.base-video__preview').classList.value.indexOf('play') === -1) {
              playVideo()
            }
            // if (this.isMp4 && window.app.utilts.checkScreenMobile()) {
            //   // 手机端
            //   $el.querySelector('video').requestFullscreen()
            // }
          })
        }
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
            if (isIframe || !this.isMp4) {
              videoPopupNode.getElementsByTagName("iframe")[0].outerHTML = isIframe ? globalThis.Server.iframeAutoplay(url) : globalThis.Server.iframeAutoplay(videoList[1])
							$popupVideo.src = ''
							$popupVideo.style.display = 'none'
						} else if (this.isMp4) {
              $popupVideo.src = url
              $popupVideo.style.display = 'block'
              if (videothumb && $popupVideo) $popupVideo.poster = videothumb.getAttribute('src') || videothumb.getAttribute('lazy-src')
              videoPopupNode.getElementsByTagName("iframe")[0].src = ''
              videoPopupNode.getElementsByTagName("iframe")[0].style.display = 'none'
              if (window.app.utilts.checkScreenMobile()) {
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
            }

            videoPopupNode.classList.add('show')
          }
        })
      }

    }
  }
  /**检查视频链接是否有效 */
  _checkVideoUrl(url, callback, errBack) {
    let fragment = document.createDocumentFragment()
    let video = document.createElement('video')
    video.src = url
    fragment.append(video)
    video.onloadedmetadata = () => {
      if (callback) callback()
    }
    video.onerror = () => {
      if (errBack) errBack()
    }
  }
}
