class ScriptDetailAlbum extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.direction = params.direction
    this.show_magnifier = Number(params.show_magnifier) || 0
    this.isX = params.direction === 'left' || params.direction === 'right'
    this.$v3dBox = this.$dom.querySelector('.unit-detail-album__3d-box')
    this.$v3dSlide = this.$dom.querySelector('.swiper-slide-3d-item')
    this.$vBox = this.$dom.querySelector('.unit-detail-album__video-box')
    this.$vPlay = this.$dom.querySelector('.unit-detail-album__video-play')
    this.$vClose = this.$dom.querySelector('.unit-detail-album__video-close')
    this.$vBox = this.$dom.querySelector('.unit-detail-album__video-box')
    this.$vAlbum = this.$dom.querySelector('.unit-detail-album__pattern')
    this.$pic = this.$dom.querySelector('.unit-detail-album__picture')
    this.videoConfig = params?.videoConfig ? JSON.parse(this.utilts.htmlDecode(params?.videoConfig)) : null
    console.log('params', params)
    console.log('videoConfig', this.videoConfig)
    this.swiperThumb = null
    this.swiperPicture = null
    this.isM = window.innerWidth < 768
    this.thumbLen = this.$dom.querySelectorAll(`.unit-detail-album__picture-item`).length
  }
  async init() {
    if (this.$dom.ScriptDetailAlbum) {
      return;
    }
    this.$dom.ScriptDetailAlbum = this;
    // siwper
    if (!window.Swiper) await new Load('/assets/plugins/swiper.min.js')
    await new Load('/assets/plugins/image-zoom.js')
    this._initRender()
    /**初始化缩略图 */
    this._initSwiperThumb()
    /**初始化大图 */
    this._initSwiperPicture()
    /** 懒加载更新高度 */
    this._initLazyLoad()
    /** 大图轮播切换 */
    this._initPicturSlideChange()
    /** 初始化视频 */
    if (this.$vBox) this._initVideo()
    /** 放大镜功能初始化 */
    if (this.show_magnifier && !this.isM) this.initImageZoom()
    this.afterInit()
  }
  afterInit() {
    const unit = document.querySelector(`#${this.attrId} .unit-detail-album`);
    unit && unit.removeAttribute('before-init')
  }
  /**初次渲染 */
  _initRender() {
    // 先根据方向渲染样式
    if (this.isX) this.$dom.classList.add('unit-detail-album--x')
    else this.$dom.classList.add('unit-detail-album--y')
    this.$dom.classList.add(`unit-detail-album--${this.direction}`)
  }
  /**初始化缩略图 */
  _initSwiperThumb() {
    //初始化缩略图
    const galleryThumbConfig = {
      slidesPerView: 'auto',
      spaceBetween: 10,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      mousewheel: true,
      freeMode: true,
      centerInsufficientSlides: true,
      direction: this.isX ? 'vertical' : 'horizontal',
      // navigation: {
      //   nextEl: `#${this.attrId} .unit-detail-album__thumb-next`,
      //   prevEl: `#${this.attrId} .unit-detail-album__thumb-prev`,
      // },
    }
    // 实例化
    document.querySelector(`#${this.attrId} .unit-detail-album__thumb-container`).classList.remove('swiper-container-vertical', 'swiper-container-horizontal')
    this.swiperThumb = new Swiper(`#${this.attrId} .unit-detail-album__thumb-container`, galleryThumbConfig)
    // 3d
    this.isLoadJs = false
    if (this.$v3dBox) {
      this.$v3dBox.onclick = (e) => {
        if (!this.isLoadJs) {
          this._load3dJs()
          this.isLoadJs = true
          e.preventDefault ? e.preventDefault() : ''
        }
        if (document.body.clientWidth >= 768) {
          this.$v3dSlide.classList.add('swiper-no-swiping')
        }
      }
      // if (document.body.clientWidth < 768) {
      //   this.$v3dBox.addEventListener('touchmove',(e)=>{
      //     if ( e && e.preventDefault ) e.preventDefault()
      //   })
      // }
    }
    document.querySelector(`#${this.attrId} .unit-detail-album__thumb-navigation`).style.display = 'block'
    document.querySelector(`#${this.attrId} .unit-detail-album__thumb-navigation .unit-detail-album__thumb-prev`).classList.add('swiper-button-disabled')
    setTimeout(() => {
      document.querySelector(`#${this.attrId} .unit-detail-album__thumb .unit-detail-album__thumb-next`).addEventListener('click', () => {
        this.swiperPicture.slideNext()
        if (this.swiperPicture.activeIndex > 0) {
          document.querySelector(`#${this.attrId} .unit-detail-album__thumb .unit-detail-album__thumb-prev`).classList.remove('swiper-button-disabled')
        }
        if (this.swiperPicture.activeIndex >= this.thumbLen - 1) {
          document.querySelector(`#${this.attrId} .unit-detail-album__thumb .unit-detail-album__thumb-next`).classList.add('swiper-button-disabled')
        }
      })
      document.querySelector(`#${this.attrId} .unit-detail-album__thumb .unit-detail-album__thumb-prev`).addEventListener('click', () => {
        this.swiperPicture.slidePrev()
        if (this.swiperPicture.activeIndex == 0) {
          document.querySelector(`#${this.attrId} .unit-detail-album__thumb .unit-detail-album__thumb-prev`).classList.add('swiper-button-disabled')
        }
        if (this.swiperPicture.activeIndex < this.thumbLen - 1) {
          document.querySelector(`#${this.attrId} .unit-detail-album__thumb .unit-detail-album__thumb-next`).classList.remove('swiper-button-disabled')
        }
      })
    }, 0);
  }
  /** 加载3d模型文件 */
  _load3dJs() {
    const s = document.createElement('script')
    s.type = 'module'
    // s.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.js'
    s.src = '/assets/plugins/model-viewer.min.js'
    document.body.appendChild(s)

    // const s1 = document.createElement('script')
    // s1.setAttribute("nomodule", "")
    // s1.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js'
    // document.body.appendChild(s1)

    s.onload = () => {
      setTimeout(() => {
        const $v3dBoxBtn = this.$dom.querySelector('.unit-detail-album__3d-box #button-load')
        $v3dBoxBtn.click()
      }, 100)
    }
    // s1.onload = () => {
    //   setTimeout(() => {
    //     const $v3dBoxBtn = this.$dom.querySelector('.unit-detail-album__3d-box #button-load')
    //     $v3dBoxBtn.click()
    //   }, 100)
    // }
  }
  /**初始化大图 */
  _initSwiperPicture() {
    const _this = this
    const galleryPictureConfig = {
      slidesPerView: 1,
      autoHeight: true,
      lazy: {
        loadPrevNext: true,
        loadOnTransitionStart: true
      },
      thumbs: {
        swiper: this.swiperThumb
      },
      navigation: {
        nextEl: `#${this.attrId} .unit-detail-album__picture-next`,
        prevEl: `#${this.attrId} .unit-detail-album__picture-prev`,
      },
      pagination: {
        el: '.unit-detail-album__picture-pagination',
        type: 'fraction'
      },
      on: {
        lazyImageReady: function (_slideEl, _imageEl) {
          // 图片加载完后自动更新高度
          _this.utilts.swiperUpdateSize(_this.swiperPicture)
        },
        slideChange: function (e) {
          if (e.activeIndex > 0) {
            document.querySelector(`#${_this.attrId} .unit-detail-album__thumb .unit-detail-album__thumb-prev`).classList.remove('swiper-button-disabled')
          }
          if (e.activeIndex >= _this.thumbLen - 1) {
            document.querySelector(`#${_this.attrId} .unit-detail-album__thumb .unit-detail-album__thumb-next`).classList.add('swiper-button-disabled')
          }

          if (e.activeIndex == 0) {
            document.querySelector(`#${_this.attrId} .unit-detail-album__thumb .unit-detail-album__thumb-prev`).classList.add('swiper-button-disabled')
          }
          if (e.activeIndex < _this.thumbLen - 1) {
            document.querySelector(`#${_this.attrId} .unit-detail-album__thumb .unit-detail-album__thumb-next`).classList.remove('swiper-button-disabled')
          }

          // 切换图片时，视频隐藏
          if (!!_this.$vBox) {
            _this.$vBox.style.display = 'none'
            if (_this.$vBox.children[0].children[1]) {
              _this.$vBox.querySelector('.unit-detail-album__video').removeChild(_this.$vBox.children[0].children[1])
            }
            _this.$vPlay.style.display = 'block'
          }
          _this.$vAlbum.classList.remove('active')

          if (_this.$vPlay) {
            if (parseInt(_this.swiperPicture.slides[_this.swiperPicture.activeIndex].getAttribute('album-type')) === 2) {
              _this.$vPlay.style.display = 'block'
            } else {
              _this.$vPlay.style.display = 'none'
            }
          }
        }
      }
    }
    this.swiperPicture = new Swiper(`#${this.attrId} .unit-detail-album__picture-container`, galleryPictureConfig)
    this.$dom.querySelector('[video-src]')?.addEventListener('click',() => {
      console.log('click')
      setTimeout(() => {
        this._initLazyLoad()
      },0)
    })
  }
  /** 懒加载更新高度 */
  _initLazyLoad() {
    // 懒加载的高度更新
    this.swiperPicture.on('slideChangeTransitionStart', () => Utilts.ins().swiperUpdateSize(this.swiperPicture))
    if (this.swiperPicture.lazy) {
      this.swiperPicture.lazy.load()
    }
    Utilts.ins().swiperUpdateSize(this.swiperPicture)
  }
  /** 大图轮播切换 */
  _initPicturSlideChange() {
    let _this = this
    if (_this.$vPlay) {
      this.swiperPicture.on('slideChange', () => {
        if (parseInt(this.swiperPicture.slides[this.swiperPicture.activeIndex].getAttribute('album-type')) === 2) {
          _this.$vPlay.style.display = 'block'
        } else {
          _this.$vPlay.style.display = 'none'
        }
      })
    }
    this.swiperPicture.on('slideChange', () => {
      console.log('slideChange')
      this.swiperPicture.slides.forEach((slide, index) => {
        const $baseVideo = slide.querySelector('.base-video');
        console.log('$baseVideo', $baseVideo)
        console.log('videoConfig', this.videoConfig)
        if($baseVideo) {
          console.log('index', index, this.swiperPicture.activeIndex)
          $baseVideo.resetVideo && $baseVideo.resetVideo()
          console.log('tt', $baseVideo.playVideo)
          if (index === this.swiperPicture.activeIndex &&  this.videoConfig?.autoplay && Number(this.videoConfig.autoplay) > 0 ) {
            setTimeout(() => {
              $baseVideo.playVideo && $baseVideo.playVideo();
            });
          }
        }
      })
      // if (parseInt(this.swiperPicture.slides[this.swiperPicture.activeIndex].getAttribute('album-type')) === 2) {
      //   _this.$vPlay.style.display = 'block'
      // } else {
      //   _this.$vPlay.style.display = 'none'
      // }
    })
  }
  /**视频播放 */
  _initVideo() {
    // 播放按钮
    const that = this
    const albumPicture = this.$dom.querySelectorAll(`.unit-detail-album__picture-item`)[0].querySelector('img')
    const releaseLock = function () {
      if (that._videoInitLock) {
        clearTimeout(that._videoInitLock)
      }
      that._videoInitLock = null
    }
    const lockInitVideo = function () {
      if (!that._videoInitLock) {
        that._videoInitLock = setTimeout(function () {
          releaseLock()
        }, 2000)
        return true
      } else {
        return false
      }
    }
    this.$vPlay.addEventListener('click', () => {
      if (!lockInitVideo()) {
        return false
      }
      this.$vPlay.style.display = 'none'
      this.$vBox.style.display = 'block'
      let video_type = this.$vPlay.dataset.type
      if (video_type === 'video_inline') {
        let iframe = document.createElement('iframe')
        iframe.src = this.$vPlay.dataset.src
        iframe.setAttribute('frameborder', 0)
        iframe.setAttribute('allowfullscreen', true)
        iframe.setAttribute('accelerometer', true)
        iframe.setAttribute('autoplay', true)
        iframe.setAttribute('allow', 'autoplay')
        iframe.setAttribute('muted', 'muted')
        iframe.setAttribute('height', parseInt(this.$vBox.offsetWidth / 16 * 9) + 1)
        iframe.setAttribute('width', '100%')
        iframe.setAttribute('marginheight', 0)
        iframe.setAttribute('marginwidth', 0)
        this.$vBox.children[0].appendChild(iframe)
      } else if (video_type === 'url_inline' || video_type === 'local') {
        let video = document.createElement('video')
        video.src = this.$vPlay.dataset.src
        if (albumPicture) video.poster = albumPicture.getAttribute('src') || albumPicture.getAttribute('lazy-src')
        video.setAttribute('style', 'width:100%;height:auto;')
        video.setAttribute('preload', 'metadata')
        video.setAttribute('autoplay', 'autoplay')
        video.setAttribute('muted', 'muted')
        video.setAttribute('controls', true)
        video.setAttribute('controlsList', 'nodownload')
        video.setAttribute('webkit-playsinline', true)
        video.setAttribute('playsinline', true)
        this.$vBox.children[0].appendChild(video)
        this.$vBox.children[0].querySelector('video').play()
      } else this.$vPlay.style.display = 'none'
    })
    // 关闭按钮
    this.$vClose.addEventListener('click', () => {
      releaseLock()
      this.$vBox.style.display = 'none'
      this.$vPlay.style.display = 'block'
      this.$vBox.querySelector('.unit-detail-album__video').removeChild(this.$vBox.children[0].children[1])
    })
  }

  /** 初始化放大镜效果 */
  initImageZoom() {
    // 轮播图初始化
    const $pic = this.$pic.querySelectorAll('.unit-detail-album__picture-container img')
    for (let $el of $pic) {
      const zoom = new PluginImageZoom({ target: $el })
      zoom.init()
    }
    // 款式选项选出的图片分开初始化
    this.vAlbumZoom = new PluginImageZoom({ target: this.$vAlbum.querySelector('img') })
    this.vAlbumZoom.init()
  }

  /** 更新产品图 */
  render() {
    const thumb = window.app.info.productDetail.thumb
    if (thumb) {
      this.$vAlbum.classList.add('active')
      this.$vAlbum.querySelector('img').setAttribute('lazy-src', thumb)
      this.$vAlbum.querySelector('img').setAttribute('src', thumb)
      this.$vAlbum.querySelector('img').setAttribute('data-lazy', 2)
      this.$pic.classList.add('has-pattern-img')
      if (this.vAlbumZoom) this.vAlbumZoom.update()
    } else {
      this.$vAlbum.classList.remove('active')
      this.$pic.classList.remove('has-pattern-img')
    }
  }
}
