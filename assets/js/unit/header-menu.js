class ScriptHeaderMenu extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.$switch = this.$dom.querySelector('.unit-header-menu__switch')
    this.$sidebar = this.$dom.querySelector('.unit-header-menu__box')
    this.$close = this.$dom.querySelector('.unit-header-menu__close')
    this.$drop = this.$dom.querySelectorAll('.unit-header-menu__nav__item-drop')
    this.$searchBtn = this.$dom.querySelector('.unit-header-menu__search-btn')
    this.$searchInput = this.$dom.querySelector('.unit-header-menu__search-input')
  }
  init() {
    this.initSideBar()
  }
  checkoutLoginOpen() {
    if (window.app.info.user.is_open === 1) {
      const isShop = window.app.info.site.is_shop
      const loginStr = `
      <div class="unit-header-menu__login">
        <div class="unit-header-menu-login__box" login-hide>
          <a href="${globalThis.Server.getRinseHref('/login.html', window.app.info.site)}">
            <span class="iconfont icon-base-user pr-1"></span>
            <span class="unit-header-menu__text text-capitalize">
              ${this.utilts.$t('sign in')}
            </span>
          </a>
        </div>
        <div class="unit-header-menu-login__box" login-show>
          <a href="javascript:;" class="unit-header-menu-login__icon">
            <span class="iconfont icon-base-user pr-1"></span>
            <span class="unit-header-menu__text text-capitalize">
              ${this.utilts.$t('author')}
            </span>
          </a>
          <div class="unit-header-menu-login__list">
            <a class="unit-header-menu-login__item ${isShop ? '' : 'item-is__hidden'}" href="${globalThis.Server.getRinseHref('/user.html', window.app.info.site)}">${this.utilts.$t('Profile')}</a>
            <a class="unit-header-menu-login__item" href="javascript:;" onclick="window.app.utilts.logout()">${this.utilts.$t('Log out')}</a>
          </div>
        </div>
      </div>
      `
      const $loginBox = document.querySelector('#unit-header-mobile__login')
      if ($loginBox) $loginBox.innerHTML = loginStr
      setTimeout(() => {
        this.initLoginPopver(5)
      }, 200)
    }
  }
  initSideBar() {
    this.initPopEvent()
    this.initDropEvent()
    this.initSearchEvent()
    if (this.$sidebar) {
      if (window.app.info.utilts.checkDesign()) {
        const appMenu = document.getElementById('app').querySelector('.app-unit-header-menu__box')
        if (appMenu) appMenu.remove()
        this.$sidebar.classList.add('app-unit-header-menu__box')
      }

      const parents = this.utilts.getParentsByAttr(this.$dom, 'package-item', 'module')
      const headerStyle = window.getComputedStyle(parents[0] || document.querySelector('[package-block-type="header"]'))
      let styleStr = this.$sidebar.getAttribute('style')
      styleStr = (styleStr ? styleStr + ' ' : '') + '--header-bg: ' + headerStyle['backgroundColor'] + ';'
      styleStr += ' --header-color: ' + headerStyle['color'] + ';'
      this.$sidebar.setAttribute('style', styleStr)
      document.getElementById('app').append(this.$sidebar)
      const multiLanguage = this.$sidebar.querySelector('.unit-header-menu__box-item a');
      if(multiLanguage){
        multiLanguage.addEventListener('click',(e)=>{
          e.preventDefault();
          sessionStorage.setItem("languageUrl", window.app.info.page.page_url);
          window.location.href =  globalThis.Server.getRinseHref('/multi-language.html', window.app.info.site)
        })
      }

    }
  }
  /** 弹窗事件 */
  initPopEvent() {
    this.$switch.addEventListener('click', () => {
      setTimeout(()=>{
        // 为了防止window.app.info.user未更新完就开始判断,所以加上定时器延迟执行判断
        this.checkoutLoginOpen()
      },100)
      
      this.$sidebar.classList.add('show')
      document.body.style.overflow = 'hidden'
    })
    if (this.$close) {
      this.$close.addEventListener('click', () => {
        this.$sidebar.classList.remove('show')
        document.body.style.overflow = 'auto'
      })
    }
    if (window.app.info.client.is_mobile) {
      this.initWindowHeight()
      window.addEventListener('resize', () => {
        this.initWindowHeight()
      })
    }
  }
  initWindowHeight() {
    this.$sidebar.style.height = window.innerHeight + 'px'
    this.$sidebar.querySelector('.unit-header-menu__nav').style.height = window.innerHeight - 184 + 'px'
  }
  /** 下拉事件 */
  initDropEvent() {
    for (let $el of this.$drop) {
      $el.addEventListener('click', (e) => {
        e.stopPropagation()
        e.preventDefault()
        $el.classList.toggle('active')
        const $content = $el.parentNode.parentNode.children[1] || null
        if ($content) {
          $content.classList.toggle('show')
        }
      })
    }
  }
  /** 搜索事件 */
  initSearchEvent() {
    if (this.$searchBtn) {
      this.$searchBtn.addEventListener('click', () => {
        const content = this.$searchInput.value
        if (content) {
          // 清除缓存里的搜索参数
          this.utilts.removeItem('search-pattern')
          window.location.href = globalThis.Server.getRinseHref(`/search.html?keyword=${content}`, window.app.info.site)
        }
      })
    }
    if (this.$searchInput) {
      this.$searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const content = this.$searchInput.value
          if (content) {
            // 清除缓存里的搜索参数
            this.utilts.removeItem('search-pattern')
            window.location.href = globalThis.Server.getRinseHref(`/search.html?keyword=${content}`, window.app.info.site)
          }
        }
      })
    }
  }
  /** 登录弹窗 */
  initLoginPopver(n) {
    if (window.app.info.utilts.checkDesign()) return
    const $login = document.querySelector('.unit-header-menu-login__icon')
    if (!$login && n > 0) {
      n--
      setTimeout(this.initLoginPopver(n), 500)
    }
    const $login_list = document.querySelector('.unit-header-menu-login__list')
    if ($login && $login_list) $login.addEventListener('click', () => $login_list.classList.toggle('show'))
  }
}