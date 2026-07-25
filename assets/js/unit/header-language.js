class ScriptHeaderLanguage extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.$headerLanguage = this.$dom.querySelector('.unit-header-language')
    this.target = this.$dom.querySelector('.unit-header-language__items')
    this.language_mode = params.language_mode
    params.language = this.utilts.htmlDecode(params.language)
    this.lan_list = this.$dom.querySelectorAll('.unit-header-language__items .unit-header-language__item')
    this.cur_lan = params.languageCode
    this.config = {
      'Asia': ['ar', 'az', 'bn', 'ceb', 'eo', 'fa', 'gu', 'hi', 'hmn', 'hy', 'id', 'iw', 'ja', 'jw', 'ka', 'kk', 'km', 'kn', 'ko', 'ku', 'ky', 'lo', 'mi', 'ml', 'mn', 'mr', 'ms', 'my', 'ne', 'or', 'pa', 'ps', 'sd', 'si', 'su', 'ta', 'te', 'tg', 'th', 'tl', 'tr', 'ug', 'ur', 'uz', 'vi', 'zh', 'zh-tw'],
      'Africa': ['af', 'am', 'ar', 'ha', 'ig', 'mg', 'sn', 'so', 'st', 'sw', 'xh', 'yo', 'zu'],
      'Europe': ['en', 'az', 'be', 'bg', 'bs', 'ca', 'co', 'cs', 'cy', 'da', 'de', 'el', 'eo', 'es', 'et', 'eu', 'fi', 'fr', 'fy', 'ga', 'gd', 'gl', 'hu', 'hy', 'is', 'it', 'la', 'lb', 'lt', 'lv', 'mg', 'mk', 'mt', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sq', 'sr', 'sv', 'tr', 'uk', 'yi', 'hr'],
      'North America': ['en', 'da', 'eo', 'gd', 'haw', 'ht', 'sm'],
      'Oceania': ['eo', 'hi', 'mi', 'sm'],
      'South America': ['ny']
    }
    try {
      this.language_config = JSON.parse(this.utilts.htmlDecode(params.language_config))
    } catch (err) {
      this.language_config = {}
      console.warn(err)
    }
  }
  init() {
    this.initConfig()
    if (!window.app.info.utilts.checkDesign()) {
      this.initEvent()
    }
  }
  initConfig() {
    const codeArr = []
    this.lan_list.forEach(_val => {
      const lan_code = _val.querySelector('.unit-header-language__item--code').innerText
      codeArr.push(lan_code)
    })
    Object.keys(this.config).forEach(key => {
      this.config[key] = codeArr.filter(val => this.config[key].includes(val))
    })
  }
  initEvent() {
    let languageCodes = Array.from(this.$dom.querySelectorAll('.unit-header-language__item--code'))
    let result_code = 'English'
    if (languageCodes.length) {
      languageCodes.forEach(item => {
        if (item.classList[1].split('code-text--')[1] == window.app.info.site.language_code) {
          result_code = item.innerHTML
        }
      })
    }
    // if (parseInt(this.language_mode) === 1) this.target = this.setLanguageModalbody()
    this.target = this.setLanguageModalbody()
    const modal = new Modal().init({
      title: `<a href="${globalThis.Server.getRinseHref('/multi-language.html', window.app.info.site)}">${window.app.utilts.$t('Choose a different language')}</a>`,
      isHideCancel: true,
      isHideSubmit: true,
      body: this.target,
      className: 'unit-header-language__modal',
      size: 'lg',
      footerHtml: `${window.app.utilts.$t('Current language')}：${result_code}`
    })
    if (this.$headerLanguage) {
      const languageListDoms = this.$headerLanguage.querySelector('.unit-header-language__items')
      this.$headerLanguage.addEventListener('click', () => {
        if (this.language_config.language_type === 1) {
          const imgList = this.target.querySelectorAll('[data-src]')
          imgList.forEach(item => {
            if (!item.getAttribute('src')) {
              item.setAttribute('src', item.getAttribute('data-src'))
              item.setAttribute('data-lazy', 2)
            }
          })
          modal.open()
        } else {
          if (languageListDoms.classList.contains('is-language-code')) {
            languageListDoms.classList.remove('is-language-code')
            languageListDoms.classList.add('hide')
          } else {
            languageListDoms.classList.add('is-language-code')
            languageListDoms.classList.remove('hide')
          }
        }
      })
      if (this.language_config.language_type === 2) {
        this.$headerLanguage.parentNode.addEventListener('mouseleave', () => {
          languageListDoms.classList.remove('is-language-code')
          languageListDoms.classList.add('hide')
        })
        // languageListDoms.addEventListener('mouseenter', (event) => {
        //   languageListDoms.classList.add('is-language-code')
        // })
      }
    }
  }

  createFlatIcon(code) {
    const $icon = document.createElement('i')
    $icon.classList.add('flag-icon', `flag-icon-${code}`)
    return $icon
  }

  loadFlagsSprite(targetHtml) {
    targetHtml.setAttribute('lazy-src', '/assets/images/flags-sprite.webp')
    targetHtml.setAttribute('lazy-type', 'background')
    targetHtml.classList.add('flags-sprite-loader')
    this._lazyFlags = new LazyImg(targetHtml)
  }

  setLanguageModalbody() {
    // 切换到非英文语种，加入英文
    // if (this.cur_lan !== 'en') this.config['Europe'].unshift('en')
    let targetHtml = document.createElement('div')
    targetHtml.classList.add('unit-region-language__list')
    this.loadFlagsSprite(targetHtml)
    if (parseInt(this.language_mode) === 1) targetHtml.classList.add('unit-region-language__list-by-continent')
    const setSonItem = ($title, $item, $sonItems, code, key) => {
      this.lan_list.forEach((_val) => {
        if (code === '' || _val.querySelector('.unit-header-language__item--code').innerText === code) {
          // if (code === '') {
          //   code = _val.querySelector('.unit-header-language__item--code').innerText
          // }
          const langCode = _val.querySelector('.unit-header-language__item--code').innerText
          const $sonItem = document.createElement('div')
          $sonItem.classList.add('unit-header-language__item')
          const $a = document.createElement('a')
          const $img = document.createElement('img')
          const $span = document.createElement('span')

          $span.classList.add('unit-header-language__item--code', 'code-text--sm')
          // $img.setAttribute('data-src', _val.querySelector('img').getAttribute('data-src'))
          // $img.setAttribute('data-lazy', 2)
          $a.setAttribute('href', _val.querySelector('a').getAttribute('href'))
          const lang =_val.querySelector('.unit-header-language__item--title').innerText
          $img.setAttribute('alt', lang)
          $img.style.setProperty('display', 'none')
          $a.setAttribute('title', lang)
          $a.append(this.createFlatIcon(langCode))
          $span.innerText = _val.querySelector('.unit-header-language__item--title').innerText
          if ($title && parseInt(this.language_mode) === 1) $title.innerText = key
          $a.append($img)
          $a.append($span)
          if ($title && parseInt(this.language_mode) === 1) $item.append($title)
          $sonItem.append($a)
          $sonItems.append($sonItem)
          $item.append($sonItems)
        }
      })
      if ($item.childNodes.length) targetHtml.append($item)
    }
    if (parseInt(this.language_mode) !== 1) {
      const $item = document.createElement('div')
      const $sonItems = document.createElement('div')
      $item.classList.add('unit-region-language__item')
      $sonItems.classList.add('unit-header-language__items')
      setSonItem(null, $item, $sonItems, '')
    } else {
      Object.keys(this.config).forEach(key => {
        const $item = document.createElement('div')
        const $title = document.createElement('div')
        const $sonItems = document.createElement('div')
        $item.classList.add('unit-region-language__item')
        $title.classList.add('unit-region-language__title')
        $sonItems.classList.add('unit-header-language__items')
        // 遍历地区语言
        this.config[key].forEach(code => {
          // 根据站点语种匹配地区
          setSonItem($title, $item, $sonItems, code, key)
        })
      })
    }
    return targetHtml
  }
}
