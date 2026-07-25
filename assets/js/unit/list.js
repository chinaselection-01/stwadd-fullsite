class ScriptList extends Script {
	constructor(params) {
		super(params)
		// 产品列表组件dom
		this.$unit = document.getElementById(`${this.attrId}`)
		if (!this.$unit) return
		this.$unitList = this.$unit.querySelector('.unit-list')
		// tab选项卡dom
		this.$tabList = this.$unit.querySelectorAll('.nav-item')
		this.$tabTypeItem = this.$unit.querySelectorAll('[tab-type]')
		// 无数据时显示Nodata
		this.$noData = this.$unit.querySelector(".page_no_data")
		// 产品选项卡内容dom
		this.pageInfo = JSON.parse(this.utilts.htmlDecode(params.pageInfo))
		this.colInfo = JSON.parse(this.utilts.htmlDecode(params.colInfo))
		this.config = JSON.parse(this.utilts.htmlDecode(params.config))
		this.config.hover_img = (params.hoverImg === 'true')
		this.content_type = params.content_type
		this.content_type_list = params.content_type.split(',')
		this.modal = null
		this.info = window.app.info
		this.open_hover = params.open_hover // hover动画   fadeInUp,fadeOutUp,
    const that = this
    this.$carouselEl = this.$unitList
		// 视频播放方式
    if (this.config.video) {
      let methodMap = {
        default: this.config.video.method,
        md: this.config.video.method_md,
        xl: this.config.video.method_xl
      }
      this.method = methodMap[this.utilts.getScreen()]
    }

    if (this.config.swiper.is_swiper) {
      this.initSwiperEvents()
    }

	}

  render() {
    if (this.$unit._zoom && this.$unit._zoom.render) {
      this.$unit._zoom.render()
    }
  }

	async init() {
		if (!this.$unit) return
		const that = this
		this.content_type_list.forEach(item => {
			if (item !== 'page_content') {
				this.initLoadData(item)
			}
		})
		this.initMoreData()
		this.initHoverContent()
		this.initInquiry()
    this.initVideoData()
    this.initVideo()
    this.initLink()
		this.initResize()
		this.initQuoteList()
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

		// 初始选项卡切换事件
		this.initTabEvent()
		// 放大图片
		if (this.config.target === 'zoom') {
			await new Load('/assets/plugins/zoom.js')
      this.$unit._zoom = new ZoomBuilder({
				attrId: this.attrId,
				dom: this.$unit,
				selector: '.unit-list__image[zoom-img="true"]',
				titleSelector: ".unit-list__title",
				boxClass: 'list-zoom-box'
			})
		}
    this.initPrevClick()
	}

/**
 * 初始化轮播图相关事件
 */
initSwiperEvents() {
  const that = this;
  /**
   * 修复当前轮播图异常图片
   * 检查当前活动幻灯片中的图片,如果src为空但有lazy-src属性,则设置src
   */
  const fixEmptySrc = () => {
    if (this.$carouselEl.swiper) {
      const swiper = this.$carouselEl.swiper;
      const activeSlide = swiper.slides[swiper.activeIndex];
      if (activeSlide) {
        activeSlide.querySelectorAll('img[lazy-src][src=""], img[lazy-src]:not([src])').forEach(img => {
          const imgSrc = img.getAttribute('data-src') || img.getAttribute('lazy-src');
          if (imgSrc) {
            // 设置异常图片的src
            img.setAttribute('src', imgSrc);
          }
        });
      }
    }
  };

  /**
   * 当前播放模式视频自动播放
   * 重置所有视频,并播放当前活动幻灯片中的视频
   */
  const _autoplayVideo = () => {
    if (this.$carouselEl.swiper) {
      const swiper = this.$carouselEl.swiper;
      swiper.slides.forEach((slide, index) => {
        const $baseVideo = slide.querySelector('.base-video');
        if ($baseVideo) {
          $baseVideo.resetVideo && $baseVideo.resetVideo();
          const CURRENT_PLAY = '2'; //当前播放
          const videoConfig = this.config.video;
          if (videoConfig?.autoplay && Number(videoConfig.autoplay) > 0 && this.method === CURRENT_PLAY && index === swiper.activeIndex) {
            setTimeout(() => {
              $baseVideo.playVideo && $baseVideo.playVideo();
            });
          }
        }
      });
    }
  }
  // 轮播结束重置视频
  const _autoResetVideo = () => {
    if (this.$carouselEl.swiper) {
      const swiper = this.$carouselEl.swiper;
      swiper.slides.forEach((slide, index) => {
        const $baseVideo = slide.querySelector('.base-video');
        if ($baseVideo) {
          if (index !== swiper.activeIndex) {
            $baseVideo.resetVideo && $baseVideo.resetVideo();
          }
        }
      })
    }
  }

  if (this.config.swiper.is_swiper) {
    /**
     * 监听Swiper初始化
     * 设置Swiper初始化后需要执行的事件
     */
    const listenSwiperInit = () => {
      // 处理swiper init
      const _eventsInitSwiper = [];
      this.$carouselEl._eventsInitSwiper = _eventsInitSwiper;
      if (this.$carouselEl.swiper) {
        _eventsInitSwiper.forEach(func => {
          if (func instanceof Function) {
            func();
          }
        });
      }
    };

    /**
     * 监听Swiper幻灯片切换
     * 设置幻灯片切换时需要执行的事件
     */
    const listenSwiperSlide = () => {
      /**
       * 轮播图切换时执行事件
       * @type {Array}
       * @private
       */
      const _eventsOnSlide = [fixEmptySrc];
      const _eventsSlideEnd = []
      const _eventsSlideStart = []
      const videoConfig = this.config.video;
      const CURRENT_PLAY = '2'; //当前播放
      if (videoConfig && this.method === CURRENT_PLAY) {
        const videoAutoplay = videoConfig.autoplay && parseInt(videoConfig.autoplay) > 0;
        if (videoAutoplay) {
          _eventsSlideStart.push(_autoplayVideo);
        }
        _eventsSlideEnd.push(_autoResetVideo);
      }
      // [carousel]层
      this.$carouselEl._eventsOnSlide = _eventsOnSlide;
      this.$carouselEl._eventsSlideStart = _eventsSlideStart;
      this.$carouselEl._eventsSlideEnd = _eventsSlideEnd;
    };

    listenSwiperInit();
    listenSwiperSlide();
  }
}


	initPrevClick() {
    const gifHoverImages = this.$unit.querySelectorAll('.unit-list-hover__image')
    if (gifHoverImages.length) {
      gifHoverImages.forEach(val => {
        val.addEventListener('click', () => {
					if (this.method === '2') val.classList.add('d-none')
          val.parentNode.parentNode.click()
        })
      })
    }
  }
	initVideoData(currentDom) {
		const doms = currentDom ? currentDom.querySelectorAll('.unit-list__img[video-gif]') : (
			this.$unitList.querySelectorAll('.unit-list__video[video-gif]') || this.$unitList.querySelectorAll('.unit-list__img[video-gif]')
		)
		if (doms.length) {
			doms.forEach(item => {
				this.renderHoverImg(item, currentDom ? true : false)
				const h_dom = item.querySelector('.unit-list-hover__image')
				const originImg = item.children[0].querySelector('.base-image__item') // hover原图的效果
				const video_gif = item.getAttribute('video-gif')
				item.parentNode.onmouseover = e => {
					if (h_dom && h_dom.classList.contains('hover_img_before_load')) {
						h_dom.classList.remove('hover_img_before_load')
						// h_dom.classList.remove('d-none')
					}
					originImg.classList.add('opacity0')
					item.querySelector('.base-video__play')?.classList.add('d-none')
					item.parentNode?.querySelector('.base-video__play').classList.add('d-none')
				}
				item.parentNode.onmouseout = e => {
					originImg.classList.remove('opacity0')
					if (h_dom) {
						h_dom.classList.add('hover_img_before_load')
					}
					item.querySelector('.base-video__play')?.classList.remove('d-none')
					item.parentNode?.querySelector('.base-video__play').classList.remove('d-none')
				}
        item.querySelectorAll('img[lazy-src][src=""], img[lazy-src]:not([src])').forEach(img => {
          const imgSrc = img.getAttribute('data-src') || img.getAttribute('lazy-src');
          if (imgSrc) {
            // 设置异常图片的src
            img.setAttribute('src', imgSrc);
          }
        });
			})
		}
	}
	renderHoverImg(node, flag) {
		const video_gif = node.getAttribute('video-gif')
		node.setAttribute('hover-img', true)
		node.setAttribute('video-gif', video_gif)
		let hoverImgEl = ''
		if (node.querySelector('.unit-list-hover__image img')) {
			hoverImgEl = node.querySelector('.unit-list-hover__image img')
			hoverImgEl.setAttribute('lazy-src', video_gif)
			const wrapper = flag ? node.children[0].cloneNode(true) : node.children[0].querySelector('.base-video__thumb').cloneNode(true)
			wrapper.querySelector('.base-image__item').innerHTML = hoverImgEl.outerHTML
			node.querySelector('.unit-list-hover__image').innerHTML = wrapper.outerHTML
			const hoverImg = node.querySelector('.unit-list-hover__image img')
			new LazyImg(hoverImg)
			// node.querySelector('.unit-list-hover__image img').setAttribute('lazy-type', '')
		} else {
			hoverImgEl = document.createElement('div')
			// unit-list-hover__image animate__animated hover_img_before_load
			hoverImgEl.classList.add('unit-list-hover__image', 'hover_img_before_load')
			const wrapper = flag ? node.children[0].cloneNode(true) : node.children[0].querySelector('.base-video__thumb').cloneNode(true)
			wrapper.querySelector('.base-image__item').innerHTML = `<img class="base-image__img img-fluid" lazy-src="${video_gif}"  alt="">`
			hoverImgEl.innerHTML = wrapper.outerHTML
			const hoverImg = hoverImgEl.querySelector('.unit-list-hover__image img')
			new LazyImg(hoverImg)
			if (flag) node.appendChild(hoverImgEl)
			else node.querySelector('.base-video__preview').appendChild(hoverImgEl)
			// node.querySelector('.unit-list-hover__image img').setAttribute('lazy-type', '')
		}
	}
	initMoreData() {
		const moreEle = this.$unitList.querySelector('.show-more-box')
		const listEles = this.$unitList.querySelectorAll('.unit-list__item')
		if (moreEle) {
			moreEle.addEventListener('click', () => {
				moreEle.classList.add('d-none')
				listEles.forEach(val => {
					val.classList.remove('hide-more-box')
				})
			})
		}
	}
	initModal() {
		this.modal = new Modal()
		const $modal = this.$unit.querySelector('.inquiry-modal-inner')
		if (!$modal) return
		this.modal.init({
			body: $modal,
			title: window.app.utilts.$t('Free Quote & Information Request'),
			size: 'lg',
			className: 'inquiry-modal',
			onSubmit: () => {
				$modal.querySelector(`.btn`).click()
			}
		})
	}
	initInquiry() {
		let inquiryBtn = this.$unit.querySelectorAll(".unit-list__product.no-price")
		if (this.config.show_inquiry == 1 && inquiryBtn.length) {
			this.initModal()
			Array.from(inquiryBtn).forEach(_val => {
				_val.querySelector('.unit-list__inquire').addEventListener('click', (e) => {
					e.preventDefault()
					e.stopPropagation()
					this.modal.open()
				})
			})
		}
	}
	initQuoteList() {
		let quoteDiv = this.$unit.querySelectorAll(".unit-list__quote")
		if (this.config.show_quote_list == 1 && quoteDiv.length) {
			const productQuoteIdList = window.app.info.productQuoteIdList
			Array.from(quoteDiv).forEach(_val => {
				const contentId = _val.getAttribute("content-id")
				const addBtn = _val.querySelector('.unit-list__quoteAdd')
				const listBtn = _val.querySelector('.unit-list__quoteList')
				if (productQuoteIdList.includes(contentId)) {
					addBtn.style.display = 'none'
					listBtn.style.display = 'inline-block'
				}
				_val.querySelector('.unit-list__quoteAdd').addEventListener('click', (e) => {
					e.preventDefault()
					e.stopPropagation()
					if (this.info.productQuoteIdList.length >= 50) {
						new Message().warn(window.app.utilts.$t('The number of added products has reached the maximum limit (50). '))
						return
					}
					addBtn.style.display = 'none'
					listBtn.style.display = 'inline-block'
					const contentId = _val.getAttribute("content-id")
					this.info.addProductQuoteId(contentId)
				})
			})
		}
	}

	/**
	 * 产品属性搜索客户渲染
	 */
	renderList(keyword='') {
		this.content_type_list.forEach(item => {
			if (item === 'page_content') {
				this.pageInfo.page_number = window.app.info.pagination.page_number || 1
			}
			this.initLoadData(item,keyword)
		})
	}

	/** 初始化选项卡切换事件 */
	initTabEvent() {
		if (this.$tabList.length === 0) return
		this.$tabList.forEach($tab => {
			$tab.addEventListener('click', () => {
				// 当前选项卡选中
				this.$tabList.forEach(p => p.classList.remove('active'))
				$tab.classList.add('active')
				// 当前内容选中
				const tabtype = $tab.dataset.tabtype
				// 产品选项卡内容dom
				const $tabTypeItem = this.$unit.querySelectorAll('[tab-type]')
				$tabTypeItem.forEach($tabContent => {
					const selected = $tabContent.getAttribute('tab-type') === tabtype
					if (selected) {
						$tabContent.classList.remove('d-none')
					} else {
						$tabContent.classList.add('d-none')
					}
				})
			})
		})
	}

	async initLoadData(type = '',keyword='') {
		if (type === 'products-discount-now') type = 'now'
		else if (type === 'products-discount-upcoming') type = 'upcoming'

		const validType = ['now', 'upcoming', 'page_content']
		if (type && validType.includes(type) && (type !== 'page_content' || window.app.info.page.page_type === 'product_list')) {
			const num = this.pageInfo.page_number
			const size = this.pageInfo.page_size
			const data = await window.app.getProductListPageBySearch(type, num, size,keyword)
			let tabType = type
			// if (tabType === 'youMightLike') tabType = 'you might like'
			// else if (tabType === 'products-similar') tabType = 'similar'
			const $nodeList = this.$unitList.querySelector('[tab-type="' + tabType + '"]')
			this.getTabList($nodeList || this.$unitList, data.list)
      this.initVideoData($nodeList || this.$unitList)
		}
	}
	getTabList($tabNode, list) {
		const self = this
		$tabNode.innerHTML = ''
		if (list.length === 0 && this.$noData) {
			this.$noData.classList.remove('d-none')
			return
		}
		this.$noData.classList.add('d-none')
		const params = {
			open_hover: this.open_hover,
			attrId: this.attrId, pageInfo: this.pageInfo, colInfo: this.colInfo, config: this.config
		}
		this.element = new ScriptListElement(params)
		for (let index = 0; index < list.length; index++) {
			const item = list[index];
			const $itemNode = this.element.getItem(item)
			if (item.video_gif) {
				$itemNode.querySelector('.unit-list__img')?.setAttribute('hover-img', true)
				$itemNode.querySelector('.unit-list__img')?.setAttribute('video-gif', item.video_gif)
			}
			this.element.$items.append($itemNode)
		}
		$tabNode.append(this.element.$container)
		if (this.config.swiper.is_swiper) {
			$tabNode.setAttribute('data-carousel', 0)
		}
		window.addEventListener('hookInitContentRender', function () {
			self.initHoverImg()
		}, {
			once: false
		})
		window.app.initPlug(this.attrId)
		this.initQuoteList()
	}

	initHoverContent() {

	}

	initHoverImg() {
		const that = this
		const hoverImgEffect = (this.open_hover || '').replace(/[^A-Za-z0-9,_-]/g, '').split(',')
		const hoverImgIn = hoverImgEffect[0] || ''
		const hoverImgOut = hoverImgEffect[1] || ''
		const hoverImgDuration = hoverImgEffect[2] || ''
		const doms = this.$unit.querySelectorAll('.unit-list__image[hover-img="true"]')
		if (doms.length) {
			doms.forEach((item, index) => {
				let h_dom = item.querySelector('.unit-list-hover__image')
				const video_gif = item.getAttribute('video-gif')
				// if (!h_dom) return
				let h_img = item.querySelector('.unit-list-hover__image img')
				const hoverNextImg = h_img && h_img.src
				let e_in = video_gif ? '' : hoverImgIn ? `animate__${hoverImgIn}` : ''
				let e_out = video_gif ? '' : hoverImgOut ? `animate__${hoverImgOut}` : ''
				const style_val = window.getComputedStyle(item)
				const pt = style_val['paddingTop'] || '0px'
				const pb = style_val['paddingBottom'] || '0px'
				const pl = style_val['paddingLeft'] || '0px'
				const pr = style_val['paddingRight'] || '0px'
				if (`${pt + pb + pl + pr}` !== '0px0px0px0px' && h_dom) {
					h_dom.setAttribute('style', `top:${pt};left:${pl};width:calc(100% - ${pl} - ${pr});height:calc(100% - ${pt} - ${pb});`)
				}
				let originImg = item.children[0].querySelector('.base-image__item') || item.querySelector('.unit-list__img .base-image__item') // hover原图的效果
				if (hoverImgDuration) {
					originImg.classList.add(hoverImgDuration)
				}
				h_dom && h_dom.classList.add('hover_img_before_load');
				item.parentNode.onmouseover = e => {
					let h_img = item.querySelector('.unit-list-hover__image img')
					const hoverNextImg = h_img && h_img.src
					if (h_dom && h_dom.classList.contains('hover_img_before_load')) {
						h_dom.classList.remove('hover_img_before_load')
					}
					if (hoverNextImg) {
						if (e_in) {
							originImg.classList.remove(e_in)
							h_dom.classList.add(e_in, 'animate__animated')
						}
						if (e_out) {
							originImg.classList.add(e_out, 'animate__animated')
							h_dom.classList.remove(e_out)
						} else {
							originImg.classList.add('opacity0')
						}
					} else {
						if (e_in) {
							originImg.classList.add(e_in, 'animate__animated')
						}
						if (e_out) {
							originImg.classList.remove(e_out)
						}
					}
					if (item.getAttribute('video-gif')) {
						originImg.classList.add('opacity0')
						// h_img.setAttribute('src', video_gif)
						item.querySelector('.base-video__play').classList.add('opacity0')
					}
				}


				item.parentNode.onmouseout = e => {
					originImg.classList.remove('opacity0')
					let h_img = item.querySelector('.unit-list-hover__image img')
					const hoverNextImg = h_img && h_img.src
					if (hoverNextImg) {
						if (e_in) {
							originImg.classList.add(e_in, 'animate__animated')
							h_dom.classList.remove(e_in)
						}
						if (e_out) {
							originImg.classList.remove(e_out)
							h_dom.classList.add(e_out, 'animate__animated')
						} else {
							if (h_dom) {
								h_dom.classList.add('hover_img_before_load')
							}
						}
					} else {
						if (e_in) {
							originImg.classList.remove(e_in)
						}
						// if (e_out) {
						// 	originImg.classList.add(e_out, 'animate__animated')
						// }
					}
					if (item.getAttribute('video-gif')) {
						// h_img.setAttribute('src', '')
						item.querySelector('.base-video__play').classList.remove('opacity0')
					}
				}
			})
		}
	}
	initVideo() {
    if (this.utilts.checkDesign()) document.getElementById('video-popup')?.remove() // 删除视频重新渲染，去掉正在播放的视频弹窗
		const doms = this.$unit.querySelectorAll('[video-src]')
		if (!doms.length) {
			return
		}
    const slideNext = () => {
      const swiper = this.$carouselEl.swiper
      if (swiper && swiper.slideNext) {
        swiper.slideNext()
      }
    }
		const config = this.config.video
		doms.forEach(($el, index) => {
			if (config.autoplay == 1) {
				setTimeout(() => {
					$el.querySelector('.unit-list-hover__image')?.classList.add('d-none')
				}, 0)
			}
			let url = $el.getAttribute('video-src')
			const videothumbDom = $el.querySelector('.base-video__thumb img')
			var videothumb = videothumbDom?.getAttribute('src') || videothumbDom?.getAttribute('lazy-src')
			if(!!videothumb){
				videothumb = globalThis.Server.getTransferImgUrl(videothumb, {convert: {quality: 80, dst: 'webp'}}, 'webp');
			}
			const isIframe = /^\s*<iframe[^>]*>[\s\S]*?<\/iframe>\s*$/.test(url)
			const isMp4 = /\.mp4(\?|$)/i.test(url || '')
			const showMask = config.show_mask * 1
			const opacity = showMask?`filter:brightness(${config.opacity});`:''
      const showControls = config.controls && config.controls.toString() === '1' || false
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
				const videoList = [
					`<div class="base-video__wrap">
            ${showControls && this.method=== '2' ? '<div class="base-video__wrap--close">×</div>': ''}
            ${showControls && this.method=== '2' ? replayWrap : replayWrap}
            <video
              style="height:auto;display:block;margin:0 auto;max-width:100%;${opacity}"
              autoplay
              controlsList="nodownload"
              webkit-playsinline="true"
              playsinline="true"
              x5-video-player-type="h5-page"
              preload="metadata"
              src="${url}"
              ${config.loop && config.loop.toString() === '1' ? ' loop' : ''}
              ${config.muted && config.muted.toString() === '1' ? ' muted' : ''}
              ${showControls ? ' controls' : '' }
              poster="${videothumb}"
            ></video>
          </div>`,
					'<iframe '+ opacity +' width="100%" frameborder="0" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" src="' + url + '"></iframe>'
				]
				const parentEle = Utilts.ins().getParentsByAttr($el, 'package-item', 'unit')
				let swiperContainerEle = ''
				let swiperHeight
				if (parentEle && parentEle.length) {
					swiperContainerEle = parentEle[0].querySelector('.swiper-container')
					swiperHeight = parentEle[0].offsetHeight
				}
				if (this.method === '2') {
					let videoHtml;
					let iframeUrl = []
					if (isIframe) {
						iframeUrl = globalThis.Server.iframeAutoplay(url).split('<iframe')
						videoHtml = `<iframe style="filter:brightness(${showMask?config.opacity:'1'})"`+iframeUrl[1]
					} else if (isMp4) {
						videoHtml = videoList[0]
					} else {
						videoHtml = globalThis.Server.iframeAutoplay(videoList[1])
					}
					const stopPlay = (e) => {
						// 判断在选择隐藏文本与不轮播情况下不显示文本
						if (!swiperContainerEle.swiper && config.auto_hide == 1) {
							// swiperContainerEle.querySelector('.unit-list__text').style.opacity = 0
              $el.closest('.unit-list__item').classList.add('hide-videotext')
						}
						if (!swiperContainerEle.swiper) return
						if (swiperContainerEle) swiperContainerEle.swiper.autoplay.stop()
						// 轮播模式下是否自动隐藏文本的判断,上面是非轮播模式,不冲突
						if (parseInt(config.auto_hide) === 1) {
							// swiperContainerEle.swiper.slides[swiperContainerEle.swiper.activeIndex].querySelector('.unit-list__text').style.opacity = 0
              $el.closest('.unit-list__item').classList.add('hide-videotext')
						}
						// 调用play()方法进行自动播放
						// swiperContainerEle.getElementsByTagName("video")[0].play()
						e.target.play()
					}
					const startPlay = (e) => {
						if (!swiperContainerEle.swiper && config.auto_hide == 1) {
							// swiperContainerEle.querySelector('.unit-list__text').style.opacity = 1
              $el.closest('.unit-list__item').classList.remove('hide-videotext')
						}
						if (!swiperContainerEle.swiper) return
						// 如果配置不需要自动轮播,则不再恢复自动轮播
						if (swiperContainerEle && this.config.swiper.autoplay !== '0') swiperContainerEle.swiper.autoplay.start()
            if (parseInt(config.auto_hide) === 1) {
              // swiperContainerEle.swiper.slides[swiperContainerEle.swiper.activeIndex].querySelector('.unit-list__text').style.opacity = 1
              $el.closest('.unit-list__item').classList.remove('hide-videotext')
            }
					}
          const resetVideo = $el.resetVideo = () => {
            const $preview = $el.querySelector('.base-video__preview')
            const $video = $el.querySelector('.base-video__preview video')
            const $replayWrap = $el.querySelector('.base-video__preview').querySelector('.base-video__wrap--replay')
            if ($preview) {
              const videoWrapDom = $preview.querySelector('.base-video__wrap')
              if (!this.config.swiper.is_swiper) {
                $replayWrap.style.display = 'flex'
                $video.controls = false
                return
              }
              if (videoWrapDom) {
                videoWrapDom.remove()
              }
              $preview.querySelectorAll('video, iframe').forEach(video => {
                if (video instanceof HTMLVideoElement) {
                  video.removeEventListener("ended", resetVideo)
                }
                video.remove()
              })
              $preview.classList.remove('play')
            }
          }
					// 当前播放
					const playVideo = $el.playVideo = () => {
						const videothumb = $el.querySelector('.base-video__thumb img')
            const videotDom = $el.querySelector('.base-video__preview video')
            var videoPoster = videothumb && (videothumb.currentSrc || videothumb.getAttribute('src') || videothumb.getAttribute('lazy-src'))
			if(!!videoPoster){
				videoPoster= globalThis.Server.getTransferImgUrl(videoPoster, {convert: {quality: 80, dst: 'webp'}}, 'webp');
			}
            const $preview = $el.querySelector('.base-video__preview')
            const $videos = $preview.querySelectorAll('video, iframe')
            $preview.classList.add('play')
            // $el.getAttribute('videoscale') && $el.classList.add('base-video--scale')
            $el.classList.add('play')
            if ($preview && !$videos.length) {
              const template = document.createElement('template')
              template.innerHTML = videoHtml
              const videos = Array.from(template.content.children)
              videos.forEach(video => {
                $preview.insertAdjacentElement('beforeend', video)
              })
            }
            if (this.$carouselEl.swiper) {
              this.$carouselEl.swiper.autoplay.stop()
            }
						if (videothumb && videotDom) {
							let videoPoster = videothumb.getAttribute('src') || videothumb.getAttribute('lazy-src')
							videoPoster = globalThis.Server.getTransferImgUrl(videoPoster, {convert: {quality: 80, dst: 'webp'}}, 'webp');
							videotDom.poster = videoPoster
						}
						$el.querySelector('.base-video__preview').classList.add('play')
						// $el.getAttribute('videoscale') && $el.classList.add('base-video--scale')
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
                  $el.querySelector('.base-video__preview')?.classList.remove('play')
                  const gifHoverImages = $el.querySelector('.unit-list-hover__image')
                  const h_dom = $el.querySelector('.unit-list-hover__image')
                  h_dom && h_dom.classList.remove('d-none')
                  gifHoverImages && gifHoverImages?.classList.remove('d-none')
                  $el.classList.remove('play')
                }
								$el.querySelector('.unit-list-hover__image')?.classList.remove('d-none')
              }
              closeBtn.addEventListener('click', closeVideo, { once: true })
            }
            // console.log('auto_reset', this.config.video.auto_reset)
            // if (showControls && replayBtn && this.config.video.auto_reset !== '1') {
            if (showControls && replayBtn ) {
              const videoDom = $el.querySelector('.base-video__wrap video')
              const replayWrapDom = $el.querySelector('.base-video__preview').querySelector('.base-video__wrap--replay')
              // console.log('videoDom', videoDom)
              const showReplayBtn = (event) => {
                event.stopPropagation()
                event.preventDefault()
                if(replayWrapDom) {
                  replayWrapDom.style.display = 'flex'
                  videoDom.controls = false
                }
								// 当不设置循环播放，视频重播回到封面图页面。并且图标使用最新设计的图标
								if (config.loop.toString() !== '1') {
									closeBtn.click()
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
						let myVideo = $el.querySelectorAll('video')
            const swiperAutoplay = parseInt(this.config.swiper.autoplay || '0')
						myVideo.forEach(elVideo => {
              if (videoPoster) {
                elVideo.poster = videoPoster
              }
              elVideo.removeEventListener('play', stopPlay)
							elVideo.addEventListener('play', stopPlay)
							elVideo.removeEventListener('pause', startPlay)
							elVideo.addEventListener('pause', startPlay)
              if (this.config.video.auto_reset > 0) {
                elVideo.removeEventListener("ended", resetVideo);
                if (swiperAutoplay === 0) {
                  // 自动轮播的情况下，视频播放结束不自动重置
                  elVideo.addEventListener("ended", resetVideo, {once: true});
                }
              }
              if (swiperAutoplay > 0 && !elVideo._eventSlideNext) {
                elVideo._eventSlideNext = slideNext
                elVideo.addEventListener("ended", slideNext, {once: true});
              }
						})
						// if (myVideo) {
						// 	myVideo.removeEventListener('play', stopPlay)
						// 	myVideo.addEventListener('play', stopPlay)
						// 	myVideo.removeEventListener('pause', startPlay)
						// 	myVideo.addEventListener('pause', startPlay)
						// 	if (this.config.video.auto_reset > 0) {
						// 		myVideo.removeEventListener("ended", resetVideo);
						// 		myVideo.addEventListener("ended", resetVideo);
						// 	}
						// }
					}
					const clickPlayVideo = (e) => {
            e.stopPropagation()
            e.stopImmediatePropagation()
            if (!$el.querySelector('.base-video__preview').classList.contains('play')) {
							// 有视频
							// e.preventDefault()
              playVideo()
						}

						// if (/\.mp4(\?|$)/.test(url) && window.app.utilts.checkScreenMobile()) {
						// 	// 手机端
						// 	$el.querySelector('video').requestFullscreen()
						// }
            return false
					}
					if (config.autoplay.toString() === '1' && /\.mp4(\?|$)/i.test(url) && $el.querySelector('.base-video__preview').classList.value.indexOf('play') === -1) {
						// 自动播放
						playVideo()
						// if (this.config.video.auto_reset > 0) {
							$el.addEventListener('click', clickPlayVideo, {useCapture: false})
						// }
					} else {
						// 手动播放
						if (isIframe) {
							videoHtml = this.config.default_src ? videoHtml : globalThis.Server.iframeAutoplayClear(videoHtml, config.muted && config.muted.toString() === '1')
						}
						$el.addEventListener('click', clickPlayVideo, {useCapture: false})
					}
				} else {
					let isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
					$el.addEventListener('click', (e) => {
						e.preventDefault()
						const videothumb = $el.querySelector('.base-video__thumb img')
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
							let video = videoPopupNode.querySelector("video")
							if (!video) {
								videoPopupNode.innerHTML = `<div class="unit-video-popup__window"><div class="unit-video-popup__close">×</div><div class="unit-video-popup__content">${videoList.join('')}</div></div>`
								videoPopupNode.querySelector(".unit-video-popup__close").addEventListener('click', function () {
									videoPopupNode.classList.remove("show")
									videoPopupNode.querySelector("video").pause()
								})
							}
							video = videoPopupNode.querySelector("video")
							let iframe = videoPopupNode.querySelector("iframe")
							video.src = url
							video.style.display = 'block'
							if (videothumb) {
								let videoPoster = videothumb.getAttribute('src') || videothumb.getAttribute('lazy-src')
								videoPoster = globalThis.Server.getTransferImgUrl(videoPoster, {convert: {quality: 80, dst: 'webp'}}, 'webp');
								video.poster = videoPoster
							}
							if (iframe) {
								iframe.src = ''
								iframe.style.display = 'none'
							}
							$popupVideo = $popupVideo || video
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
							// if (window.app.utilts.checkScreenMobile()) {
							// 	if (isiOS) {
							// 		setTimeout(() => { videoPopupNode.getElementsByTagName("video")[0].webkitEnterFullscreen() }, 500)
							// 	} else {
							// 		videoPopupNode.getElementsByTagName("video")[0].requestFullscreen()
							// 	}
							// }
						} else {
							videoPopupNode.getElementsByTagName("iframe")[0].src = url
							videoPopupNode.getElementsByTagName("iframe")[0].style.display = 'block'
							$popupVideo.src = ''
							$popupVideo.style.display = 'none'
						}
						videoPopupNode.classList.add('show')
					})
				}
			}
		})
	}

	initResize() {
		if (!this.config.resize?.is_resize) return

		const $container = this.$unitList.querySelector('.resize-container')
		if (!$container) return
		const $wrapper = $container.querySelector('.unit-list__items')
		const $firstItem = $wrapper.firstElementChild
		const $firstItemInner = $firstItem.querySelector('.unit-list__item-inner')
		const $laseItem = $wrapper.lastElementChild
		// const $firstImg = $firstItem.querySelector('.base-image__img')
		// const $firstText = $firstItem.querySelector('.unit-list__text')
		const $splitLine = $container.querySelector('.unit-list__split-line')

		let direction = this.config.resize?.direction || 'x';
		let offsetX = 0;
		let offsetY = 0;

		// $firstText.setAttribute('style', `width:${$container.offsetWidth * 0.5}px;`)
		if (direction === 'x') {
			$firstItemInner.setAttribute('style', `width:${$container.offsetWidth}px;max-width:${$container.offsetWidth}px`)
			// 监听 container 尺寸变化
			var observer = new ResizeObserver(function (entries) {
				entries.forEach(function (entry) {
					if (entry.target === $container) {
						// 获取宽度
						const width = entry.contentRect.width;
						$firstItemInner.setAttribute('style', `width:${width}px;max-width:${width}px`)
					}
				});
			});
			// 监听目标元素的宽度变化
			observer.observe($container);
		}

		function startDrag(event) {
			event.preventDefault()

			offsetX = $container.getBoundingClientRect().left;
			offsetY = $container.getBoundingClientRect().top;
			document.addEventListener('mouseup', stopDrag)
			document.addEventListener('mousemove', drag)

			document.addEventListener('touchend', stopDrag)
			document.addEventListener('touchmove', drag, {
				passive: false, // 阻止默认滚动行为
			})
		}

		function stopDrag(event) {
			event.preventDefault()

			document.removeEventListener('mousemove', drag)
			document.removeEventListener('mouseup', stopDrag)

			document.removeEventListener('touchmove', drag)
			document.removeEventListener('touchend', stopDrag)
		}

		function drag(event) {
			event.preventDefault()
			requestAnimationFrame(() => {
				if (direction === 'x') {
					let containerLeft = $container.getBoundingClientRect().left;
					let containerWidth = $container.offsetWidth;
					let clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
					let x = clientX - offsetX;
					// 将拖拽区域限制在容器内部
					if (clientX < containerLeft) {
						// console.log('左边超出');
						x = 0;
					}
					if (clientX > containerLeft + containerWidth - $splitLine.offsetWidth) {
						// console.log('右边超出');
						x = containerWidth - $splitLine.offsetWidth
					}
					$splitLine.style.left = x + "px";
					$firstItem.setAttribute('style', `width:${x}px`)
					$laseItem.setAttribute('style', `clip-path: inset(0 0 0 ${x}px)`) // fix：透明背景，图片重叠
				} else {
					let containerTop = $container.getBoundingClientRect().top
					let containerHeight = $container.offsetHeight;
					let clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
					let y = clientY - offsetY;
					// 将拖拽区域限制在容器内部
					if (clientY < containerTop) {
						y = 0;
					}
					if (clientY > containerTop + containerHeight - $splitLine.offsetHeight) {
						y = containerHeight - $splitLine.offsetHeight;
					}
					$splitLine.style.top = y + "px";
					$firstItem.setAttribute('style', `height:${y}px`)
					$laseItem.setAttribute('style', `clip-path: inset(${y}px 0 0 0)`)
				}
			})
		}

		$splitLine.onmousedown = startDrag;
		$splitLine.ontouchstart = startDrag;
	}

	initLink() {
		// 解决.unit-list__text的空白区域点击
		const $textContainerList = this.$unitList.querySelectorAll('.unit-list__text[data-href]')

		for (const item of $textContainerList) {
			const dataHref = item.getAttribute('data-href')
			if (item.parentNode.querySelector('.unit-list__video')) {
        const $baseVideo = item.parentNode.querySelector('.base-video')
        const $preview = item.parentNode.querySelector('.base-video__preview')
				item.style.cursor = 'pointer'
				item.addEventListener('click', (e) => {
          const clickBtn = e.target.closest('.btn') || e.target.classList.contains('btn')
					if (e.target.tagName !== 'A' && !clickBtn) {
            if (!$preview.classList.contains('play')) {
              $baseVideo.playVideo()
            }
						// item.parentNode.querySelector('.base-video__play').click()
					}
				})
			} else if (!this.utilts.checkDesign()) {
				if (dataHref.startsWith('javascript')) continue
				item.style.cursor = 'pointer'
				item.addEventListener('click', (e) => {
          e.stopPropagation()
          e.stopImmediatePropagation()
					const link = e.target.closest('a[href]');
					if (link && link.href && !link.href.startsWith('javascript')) {
						e.stopPropagation();
						return false;
					}
					let target = item.getAttribute('data-target')
					if (target !== 'block') {
						window.open(dataHref, target || '_self')
					}
				})
			}
		}
	}
}

/**
 * 客户端数据html
 */
class ScriptListElement {
	constructor({ attrId, pageInfo, colInfo, config, open_hover }) {
		this.open_hover = open_hover
		this.attrId = attrId
		this.pageInfo = pageInfo
		this.is_swiper = config.swiper.is_swiper
		this.colInfo = colInfo
		this.config = config
		this.init()
	}

	init() {
		this.getMainHtml()
	}

	getMainHtml() {
		this.$container = document.createElement('div')
		this.$container.classList.add('swiper-container')
		this.$items = this.getItems()
		this.$container.append(this.$items)
		this._setSwiperNode()
	}

	getItems() {
		const $items = document.createElement('div')
		$items.classList.add('unit-list__items', 'swiper-wrapper')
		if (!this.is_swiper) $items.classList.add('row')
		if (this.is_swiper && !this.swiper.pagination) $items.classList.add('no-swiper-pagination')
		return $items
	}

	/** 获取产品列表项 **/
	getItem(item) {
		const $item = document.createElement('div')
		$item.setAttribute('data-id', item.content_id)
		$item.classList.add('animate', 'unit-list__item', 'swiper-slide')
		if (!this.is_swiper) {
			$item.classList.add(`col-${this.colInfo.cols_col}`)
			$item.classList.add(`col-md-${this.colInfo.cols_md}`)
			$item.classList.add(`col-xl-${this.colInfo.cols_xl}`)
		}
		const $listA = document.createElement('div')
		$listA.classList.add('unit-list__a')
		$listA.append(this.getItemContent(item))
		$item.append($listA)

		return $item
	}
	/** 获取产品列表项内容 **/
	getItemContent(item) {
		const $listInner = document.createElement('div')
		$listInner.classList.add('unit-list__item-inner', 'd-flex', 'flex-column')
		$listInner.append(this.getLinkImage(item))
		$listInner.append(this.getLinkText(item))
		return $listInner
	}

	/**
	 * 按钮节点
	 */
	getLinkImage(item) {
		const hoverImgEffect = (this.open_hover || '').replace(/[^A-Za-z0-9,_-]/g, '').split(',')
		const hoverImgIn = hoverImgEffect[0] || ''
		const hoverImgOut = hoverImgEffect[1] || ''
		const hoverImgDuration = hoverImgEffect[2] || ''
		const self = this
		const subNode = {
			//
			get baseImage() {
				let scale = ''
				let effect = 0
				if (self.config.image) {
					scale = self.config.image.scale || ''
					if (scale) scale = Number(scale) * 100 + '%'
					effect = self.config.image.effect
				}
				return `
					<div class="base-image ${scale ? 'base-image--scale' : ''} ${effect ? 'base-image--effect-' + effect : ''}" ${scale ? 'style="--img-pt: ' + scale + '"' : ''}>
						<div class="base-image__item hover_img_origin base-image__item--default">
							<img class="base-image__img img-fluid ${hoverImgDuration}" effect-in="${hoverImgIn}" effect-out="${hoverImgOut}" lazy-src="${item.img}" alt="${item.alt || item.title}" lazy-type="img">
						</div>
					</div>`
			},
		}

		const $imgBoxs = document.createElement('a')
		$imgBoxs.classList.add('unit-list__image')
		const href = globalThis.Server.getRinseHref(item.href || 'javascript:;', window.app.info.site)
		$imgBoxs.setAttribute('href', href)
		$imgBoxs.setAttribute('target', item.target || '_self')

		if (item.cover_url && this.config.video.icon === '1') {
			const videoNode = document.createElement('div')
			videoNode.classList.add('base-video__play')
			videoNode.innerHTML = `<i class="iconfont icon-action-play"></i>`
			$imgBoxs.appendChild(videoNode)
		}

		// 产品图片
		const $baseImg = document.createElement('div')
		// console.log('item*---list', item);
		$baseImg.classList.add('unit-list__img')
		$baseImg.setAttribute('content-render', 'product_hover,video_icon')
		$baseImg.setAttribute('content-type', item.content_type)
		$baseImg.setAttribute('content-id', item.content_id);
		(item.hover_img || self.config.hover_img) && $baseImg.setAttribute('open-hover', this.open_hover || '')
		$baseImg.innerHTML = subNode.baseImage
		$imgBoxs.append($baseImg)
		return $imgBoxs
	}

	/**
	 * 标题描述，价格
	 */
	getLinkText(item) {
		const self = this
		const getShowContent = (className, item, textStyle, title) => {
			const $titleBox = document.createElement('div')
			$titleBox.classList.add(`unit-list__${className}`)
			$titleBox.setAttribute('text-style', textStyle || '')

			let $textBox
			if (className === 'title') {
				$textBox = document.createElement('a')
				const href = globalThis.Server.getRinseHref(item.href || 'javascript:;', window.app.info.site)
				$textBox.setAttribute('href', href)
				$textBox.setAttribute('target', item.target || '_self')
			} else {
				$textBox = document.createElement('div')
			}
			$textBox.classList.add('text_ellipsis')
			$textBox.setAttribute('_html', item[className + '_sign'] || '')
			$textBox.setAttribute('toolbar', 'false')
			$textBox.innerHTML = item[className]
			$titleBox.append($textBox)

			return $titleBox
		}
		const subNode = {
			get priceInfo() {
				const min = `<div class="unit-list__price-min"><i>$</i><span>${item.price_min}</span></div>`
				let max = ''
				if (item.price_max > 0) {
					max = `<div class="unit-list__price-max"><i>$</i><span>${item.price_max}</span></div>`
				}
				return `${min}${max}`
			},
			get listExtend() {
				const noPrice = `
						<div class="unit-list__cart text-capitalize">
							<i class="iconfont icon-base-cart-lighter"></i>
							<a href="${globalThis.Server.getRinseHref(item.href, window.app.info.site)}" target="${item.target || '_self'}">${window.app.utilts.$t('Add to cart')} </a>
						</div>
						<div class="unit-list__inquire text-capitalize">
							<a href="${item.target==='block'?'javascript:;':globalThis.Server.getRinseHref(item.href, window.app.info.site)}" target="${item.target==='block'?'_self':item.target || '_self'}">${window.app.utilts.$t('Inquiry')}</a>
						</div>`
				let like = ''
				if (self.config.show_like) {
					like = `
						<div class="unit-list__like" title="${window.app.utilts.$t('Like')}" pro-id="${item.id}">
								<i class="iconfont icon-base-collect"></i>
						</div>`
				}
				return `${noPrice}${like}`
			}
		}

		const $textBox = document.createElement('div')
		$textBox.classList.add('unit-list__text')

		const $textInner = document.createElement('div')
		$textInner.classList.add('unit-list__text-inner')

		const $content = document.createElement('div')
		$content.classList.add('unit-list__content')

		$textInner.append($content)
		$textBox.append($textInner)

		// 标题
		if (this.config.show_title && item.title && this.config.has_title) {
			const style_title = self.config.style_type_title
			const $title = getShowContent('title', item, style_title)
			$content.append($title)
		}
		// 子标题
		if (this.config.show_subtitle && item.subtitle && this.config.has_subtitle) {
			const style_subtitle = self.config.style_type_subtitle
			const $subtitle = getShowContent('subtitle', item, style_subtitle)
			$content.append($subtitle)
		}
		// 描述
		if (this.config.show_description && item.description && this.config.has_description) {
			const style_description = self.config.style_type_description
			const $description = getShowContent('description', item, style_description)
			$content.append($description)
		}

		// 价格
		if (this.config.show_read_more) {
			const $pricesBox = document.createElement('div')
			$pricesBox.classList.add('unit-list__product')
			if (Number(item.price_min) <= 0) $pricesBox.classList.add('no-price')

			const $listPrice = document.createElement('div')
			$listPrice.classList.add('unit-list__price')
			$listPrice.innerHTML = subNode.priceInfo
			$pricesBox.append($listPrice)

			const $extend = document.createElement('div')
			$extend.classList.add('unit-list__extend')
			$extend.innerHTML = subNode.listExtend
			$pricesBox.append($extend)

			$textInner.append($pricesBox)
		}
		if (this.config.show_quote_list == '1') {
			$textBox.append(this.getQuoteBtn(item))
		}
		return $textBox
	}

	getQuoteBtn(item) {
		const self = this
		const $content = document.createElement('div')
		$content.classList.add('unit-list__quote')
		$content.setAttribute("content-id", item.content_id)
		const $addBtn = document.createElement('div')
		$addBtn.classList.add('unit-list__quoteAdd')
		$addBtn.innerHTML = `<i class="iconfont icon-action-add"></i>
                        <span>${window.app.utilts.$t('Add to Quote List')}</span>`
		const $listBtn = document.createElement('a')
		$listBtn.classList.add('unit-list__quoteList')
		$listBtn.innerHTML = ` <div>
                            ${window.app.utilts.$t('Browse the list')} →
                        </div>`
		$content.append($addBtn)
		$content.append($listBtn)
		return $content
	}
	/** **/
	_setSwiperNode() {
		if (this.config.swiper) {
			if (this.config.swiper.pagination) {
				const $div1 = document.createElement('div')
				$div1.classList.add('unit-product-list__pagination', 'swiper-pagination')
				this.$container.append($div1)
			}
			if (this.config.swiper.navigation) {
				const $div2 = document.createElement('div')
				$div2.classList.add('unit-product-list__button-prev', 'swiper-button-prev')
				this.$container.append($div2)
				const $div3 = document.createElement('div')
				$div3.classList.add('unit-product-list__button-next', 'swiper-button-next')
				this.$container.append($div3)
			}
			if (this.config.swiper.scrollbar) {
				const $div4 = document.createElement('div')
				$div4.classList.add('unit-product-list__scrollbar', 'swiper-scrollbar')
				this.$container.append($div4)
			}
		}
	}
}
