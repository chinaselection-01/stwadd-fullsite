class WidgetSocialMediaChat extends Script {
  constructor(params) {
    super(params)
    this.inquiry_requiry = Number(params.inquiry_requiry)
    this.chat_requiry = params.chat_requiry === 'true'
    this.hasInquiry = params.hasInquiry
    this.needInquiry = params.needInquiry
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.$showChatPlug = this.$dom.querySelector('.widget-social-media-chat__server')
    this.$showChatPlug2 = this.$dom.querySelector('.widget-social-media-chat__content--bottom')
    this.$socialList = this.$dom.querySelectorAll(".widget-social-media-chat__item,.col-plugins-list i")
    this.$mediaChat = this.$dom.querySelector('.widget-social-media-chat')
    this.$inquiryModal = this.$dom.querySelector('.widget-social-media-chat__inquiry')
    this.$chatModal = this.$dom.querySelector('.widget-social-media-chat__list')
    this.$close = this.$dom.querySelectorAll('.widget-social-media-chat__modal-close')
    this.$mask = this.$dom.querySelector('.widget-social-media-chat__mask')
    this.$cancel = this.$dom.querySelector('.widget-social-media-chat__cancel')
    this.social_status = this.utilts.getItem('social_status') || 0
    this.isProductDetail = window.app.info.checkProductDetail(window.app.info.page.page_type)
  }

  init() {
    this.bindShowPlugEvent()
    this.bindLinkPlugEvent()
    this.bindCloseEvent()
    this.renderScoial()
  }

  renderScoial() {
    this.social_status = Number(this.social_status)
    if (this.social_status !== 2) return
    // if (this.$chatModal) this.$chatModal.classList.add('show')
    if (this.$inquiryModal) this.$inquiryModal.classList.remove('show')
    if (this.$mask && !this.$chatModal) this.$mask.classList.remove('show')
    let statusEl = document.querySelector('[data-inquirystatus]')
    statusEl?.setAttribute('data-inquirystatus','2')
    // 询盘状态改变， 1：下次进来不用直接弹出
    // this.utilts.setItem('social_status', 1)
    // this.social_status = 1
  }

  /** 邦定点击显示插件事件 */
  bindShowPlugEvent() {
    if (this.utilts.checkDesign()) return
    this.$showChatPlug?.addEventListener('click', (event) => {
      event.stopPropagation()
      // 判断是否有询盘记录
      if (window.innerWidth <= 576) this.$mask.classList.add('show')
      if (this.$inquiryModal && !this.chat_requiry) this.$inquiryModal.classList.add('show')
      else if (this.$inquiryModal && !this.social_status ) this.$inquiryModal.classList.add('show')
      else if (this.$chatModal) this.$chatModal.classList.add('show')
      if(this.$inquiryModal?.className.indexOf('show')>-1){
        this.$showChatPlug.style.display = 'none';
        // 详情页不展示
        this.$dom.querySelector('.widget-social-media-chat__modal-close').style.display = 'block'
      }
    })
    if(this.$showChatPlug2) {
      if (this.$showChatPlug2.classList.contains('show') && this.$showChatPlug2.clientHeight > 0) {
        document.querySelector('.widget-toTop-wrap').style.bottom = 'calc(80px + var(--SAIB))'
      }
      this.$showChatPlug2?.addEventListener('click', (event) => {
        event.stopPropagation()
        // 判断是否有询盘记录
        if (window.innerWidth <= 576) this.$mask.classList.add('show')
        if (this.$inquiryModal && !this.chat_requiry) this.$inquiryModal.classList.add('show')
        else if (this.$inquiryModal && !this.social_status ) this.$inquiryModal.classList.add('show')
        else if (this.$chatModal) this.$chatModal.classList.add('show')
        if(this.$inquiryModal?.className.indexOf('show')>-1){
          this.$showChatPlug.style.display = 'none';
          // 详情页不展示
          // this.$dom.querySelector('.widget-social-media-chat__modal-close').style.display = 'block'
        }
      })
    }

  }

  /** 邦定客服插件点击打开链接事件 */
  bindLinkPlugEvent() {
    this.$socialList.forEach(item => {
      item.addEventListener('click', () => {
        if (this.needInquiry === 'true' && this.hasInquiry === '1' && !this.social_status) {
          window.alert("Please submit an inquiry first.");
          return
        }
        let info = item.getAttribute('data-info')
        if (!info) throw Error('social plug is null')
        info = JSON.parse(info)
        if (info.type !== 'fbmessenger') info.code = JSON.parse(info.code)
        switch (info.type) {
          case 'skype':
            this.openSkype(info.code)
            break
          case 'vk':
            this.openVk(info.code)
            break
          case 'viber':
            this.openViber(info.code)
            break
          case 'wechat':
            this.openWechat(info.code)
            break
          case 'telegram':
            this.openTelegram(info.code)
            break
          case 'trademanager':
            this.openTrademanager(info.code)
            break
          case 'whatsapp':
            this.openWhatsapp(info.code)
            break
          case 'fbmessenger':
            this.openFbmessenger(info.code)
            break
            case 'phone':
              this.openPhone(info.code)
              break
            case 'base-email':
              this.openEmail(info.code)
              break
        }
      })
    })
  }

  /** 隐藏插件 */
  bindCloseEvent() {
    for (let $el of this.$close) {
      $el.addEventListener('click',()=> {
        if (window.innerWidth <= 576) this.$mask.classList.remove('show')
        if (this.$inquiryModal) this.$inquiryModal.classList.remove('show')
        if (this.$chatModal) this.$chatModal.classList.remove('show')
        if(this.$inquiryModal?.className.indexOf('show')===-1){
          // 详情页不展示
          const hideChatPlug = window.innerWidth < 768 && this.$showChatPlug2.clientHeight > 0
          if (!hideChatPlug) {
            this.$showChatPlug.style.display = 'block';
          }
          this.$dom.querySelector('.widget-social-media-chat__modal-close').style.display = 'none';
        }
      })
    }
    if (this.$cancel) {
      this.$cancel.addEventListener('click', () => {
        this.$mask.classList.remove('show')
        if (this.$inquiryModal) this.$inquiryModal.classList.remove('show')
        if (this.$chatModal) this.$chatModal.classList.remove('show')
      })
    }
    if (this.$mask) {
      this.$mask.addEventListener('click', () => {
        this.$mask.classList.remove('show')
        if (this.$inquiryModal) this.$inquiryModal.classList.remove('show')
        if (this.$chatModal) this.$chatModal.classList.remove('show')
      })
    }
    /** 移动端滑动关闭——屏幕左侧，从左到右滑 */
    if (!this.utilts.checkDesign() && this.utilts.getScreen() !== 'xl') {
      const observeClassChange = (element, callback) => {
        // 创建观察器实例
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              const classList = mutation.target.classList;
              callback(classList.contains('show'));
            }
          });
        });

        // 配置观察选项
        const config = { attributes: true, attributeFilter: ['class'] };

        // 开始观察目标元素
        observer.observe(element, config);

        // 返回观察器以便后续可以停止观察
        return observer;
      }
      if (this.$inquiryModal) {
        window.addEventListener('popstate', (event) => { // 后退关闭弹窗
          if (!this.$inquiryModal?.classList.contains('show')) return
          console.log('popstate')
          this.$mask.classList.remove('show')
          if (this.$inquiryModal) this.$inquiryModal.classList.remove('show')
          if (this.$chatModal) this.$chatModal.classList.remove('show')

          if(this.$inquiryModal?.className.indexOf('show')===-1){
            // 详情页不展示
            const hideChatPlug = window.innerWidth < 768 && this.$showChatPlug2.clientHeight > 0
            if (!hideChatPlug) {
              this.$showChatPlug.style.display = 'block';
            }
            this.$dom.querySelector('.widget-social-media-chat__modal-close').style.display = 'none';
          }
          setTimeout(() => {
            this.$inquiryModal.style['transition'] = ''
          }, 300)
        })
        const observer = observeClassChange(this.$inquiryModal, (show) => {
          if (show) {
            // console.log('show类被添加了！');
            history.pushState('touch-action', null, location.href);
          } else {
            // console.log('show类被移除了！');
            // 如果不是滑动关闭，那还需要back一下
            if (history.state === 'touch-action') history.back()
          }
        })
        // 要停止观察时调用：
        // observer.disconnect();
      }
      // 配置参数
      const SWIPE_ZONE_WIDTH = window.innerWidth * 0.5; // 左侧检测区域宽度
      const SWIPE_THRESHOLD = 30;  // 最小滑动距离阈值

      let startX = 0;
      let startY = 0;
      let isInSwipeZone = false;

      const initSwipeDetection = (callback) => {
          document.addEventListener('touchstart', (e) => {
              const touchX = e.touches[0].clientX;
              const touchY = e.touches[0].clientY;

              // 检查是否在左侧检测区域
              if (touchX <= SWIPE_ZONE_WIDTH) {
                  isInSwipeZone = true;
                  startX = touchX;
                  startY = touchY;
              }
          }, {passive: false});

          document.addEventListener('touchmove', (e) => {
            if (!isInSwipeZone) return;

            const currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            const deltaY = Math.abs(e.touches[0].clientY - startY);

            // 判断是否为有效的右滑（水平移动为主且向右）
            if (deltaX > SWIPE_THRESHOLD && deltaX > deltaY) {
              callback();
              isInSwipeZone = false; // 防止重复触发
            }
          }, {passive: false});

          document.addEventListener('touchend', () => {
            isInSwipeZone = false;
          });
      }

      initSwipeDetection(() => {
        if (!this.$inquiryModal?.classList.contains('show')) return
        console.log('检测到左侧右滑手势');
        // 在此处添加你的回调逻辑
        this.$inquiryModal.style['transition'] = 'unset' // 手势关闭去掉动画，避免跟移动端浏览器的后退动画冲突
      });
    }
  }
  openWhatsapp(item) {
    const os = Utilts.ins().getOperationSys()
    item.area_code = item.area_code.replace('+','')
    const text = item.message ? `&text=${item.message}` : ''
    let url = `whatsapp://send?phone=${item.area_code}${item.account}`
    if (window.screen.width > 768) {
      url = `https://web.whatsapp.com/send?phone=${item.area_code}${item.account}${text}`
    }

    // let href = globalThis.Server.getRinseHref(url, window.app.info.site)
    let href = url
    if (href.startsWith('/')) {
      href = href.substring(1); // 移除开头的斜杠
    }
    window.app.utilts.jupmLinkSave({href, target: '_blank', name: 'whatsapp', show_confirm: false})
  }

  openSkype(item) {
    // let href = globalThis.Server.getRinseHref(`skype:${item.message}?chat`, window.app.info.site)
    let href = `skype:${item.message}?chat`
    if (href.startsWith('/')) {
      href = href.substring(1); // 移除开头的斜杠
    }
    window.app.utilts.jupmLinkSave({href, target: '_blank', name: 'Skype'})
  }

  openVk(item) {
    const href = globalThis.Server.getRinseHref(`vk://vk.com/${item.message}`, window.app.info.site)
    window.app.utilts.jupmLinkSave({href, target: '_blank', name: 'Vk'})
  }

  openViber(item) {
    item.area_code = item.area_code.replace('+','')
    // let href = globalThis.Server.getRinseHref(`viber://chat/?number=%2B${item.area_code}${item.account}`, window.app.info.site)
    let href = `viber://chat/?number=%2B${item.area_code}${item.account}`
    if (href.startsWith('/')) {
      href = href.substring(1); // 移除开头的斜杠
    }
    window.app.utilts.jupmLinkSave({href, target: '_blank', name: 'Viber'})
  }

  openTelegram(item) {
    // let href = globalThis.Server.getRinseHref(`tg://resolve?domain=${item.account}`, window.app.info.site)
    let href = `tg://resolve?domain=${item.account}`
    if (href.startsWith('/')) {
      href = href.substring(1); // 移除开头的斜杠
    }
    window.app.utilts.jupmLinkSave({href, target: '_blank', name: 'Telegram'})
  }

  openWechat(item) {
    const href = globalThis.Server.getRinseHref(`//${item.account}`, window.app.info.site)
    window.app.utilts.jupmLinkSave({href, target: '_blank', name: 'Wechat'})
  }
  openPhone(item) {
    const href = `tel:${item.account}`
    window.app.utilts.jupmLinkSave({href, target: '_blank', name: 'Phone'})
  }
  openEmail(item) {
    const href = `mailto:${item.account}`
    window.app.utilts.jupmLinkSave({href, target: '_blank', name: 'Email'})
  }
  openTrademanager(item) {
    const href = globalThis.Server.getRinseHref(`https://amos.alicdn.com/getcid.aw?v=3&groupid=0&s=1&charset=utf-8&uid=${item.account}&site=cntaobao`, window.app.info.site)
    window.app.utilts.jupmLinkSave({href, target: '_blank', name: 'Trademanager'})
  }

  openFbmessenger(code) {
    const href = globalThis.Server.getRinseHref(`//${code}`, window.app.info.site)
    window.app.utilts.jupmLinkSave({href, target: '_blank', name: 'Fbmessenger'})
  }
}
