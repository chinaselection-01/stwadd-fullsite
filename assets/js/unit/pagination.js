class ScriptPagination extends Script {
  constructor(params) {
    super(params)
    this.style_type_pagination = params.style_type_pagination
    this.pageInfo = JSON.parse(this.utilts.htmlDecode(params.pageInfo))
  }
  async init() {
    // 获取客户端需要分页的信息
    this.clientPagination = new ScriptPaginationClient(this.attrId,
      this.pageInfo, this.style_type_pagination)
    await this.clientPagination.init()
    this.initSelector()
    this._bindInputEvent()
  }

  initSelector() {
    this.$pagination = document.querySelector(`#${this.attrId}`)
    this.$inputInner = this.$pagination.querySelector('.base-pagination__input-inner')
    this.$input = this.$pagination.querySelector('.base-pagination__input')
    if (!this.$input) return

    this.pageNumber = Number(this.$input.dataset.current)
    this.pageCount = Number(this.$input.dataset.count)
    this.$inputHref = this.$pagination.querySelector('.base-pagination__input-href')
    const urlStr = this.$inputHref.getAttribute('data-href')
    if (urlStr) this.baseUrl = urlStr.replace('.html', '')
  }

  /**
   * 分页输入框操作
   * @param {boolean} isClient 是否客户端不刷新分页
   * @returns
   */
  _bindInputEvent(isClient = false) {
    // 键入时判断是否页数正确
    if (!this.$inputInner) return
    this.$inputInner.addEventListener('input', () => {
      const val = Number(this.$inputInner.value.replace(/\D/g, ''))
      if (val > this.pageCount) this.$inputInner.value = this.pageCount
      else this.$inputInner.value = val
      this.$inputHref.setAttribute('href', `${this.baseUrl}${this.$inputInner.value}.html`)
      this.$inputHref.setAttribute('data-num', `${this.$inputInner.value}`)
    })
    if (isClient) return
    // 回车跳转
    this.$inputInner.addEventListener('keydown', (event) => {
      event = event || window.event;
      if (event.keyCode === 13) {
        if (this.$inputInner.value) location.href = `${this.baseUrl}${this.$inputInner.value}.html`
      }
    })
  }

  /**
   * 属性参数查找，客户端无刷新渲染数据
   */
  async renderList(keywork='') {
    this.pageInfo.page_number = window.app.info.pagination.page_number || 1
    // 如果当前为产品列表页，并且内容为page_content
    const page_type = window.app.info.page.page_type
    const isPageContent = page_type === 'product_list' || page_type === 'reduction_detail'
    if (isPageContent) this.clientPagination.type = 'page_content'
    await this.clientPagination.initLoad(this.pageInfo.page_base_url, true,keywork)
    this.initSelector()
    this._bindInputEvent(true)
  }
}

/** 获取客户端需要分页的数据 */
class ScriptPaginationClient {
  constructor(attrId, pageInfo, style_type_pagination) {
    this.attrId = attrId
    // 分页信息
    this.pageInfo = pageInfo
    // 分页组件
    this.$pagination = document.querySelector(`#${this.attrId}`)

    this.style_type_pagination = style_type_pagination
  }

  async init() {
    // 初始化选择器
    this.initSelector()
    // 加载分页信息
    await this.initLoadData()
  }

  initSelector() {
    // 产品列表组件dom
    this.type = ''
    const $discountNowPage = document.querySelector('[page-type="product_discount_now"]')
    const $discountUpcomingPage = document.querySelector('[page-type="product_discount_upcoming"]')
    // 如果当前是正在进行的限时折扣
    if ($discountNowPage) this.type = 'now'
    // 如果当前是即将进行的限时折扣
    else if ($discountUpcomingPage) this.type = 'upcoming'
  }

  async initLoadData() {
    if (this.type) await this.initLoad(`product_discount_${this.type}`)
  }

  /**
   * 加载正在进行的限时
   */
  async initLoad(baseUrl, isClient = false,keywork='') {
    const num = this.pageInfo.page_number
    const size = this.pageInfo.page_size || 12
    let isDownloadSearch = window.app.info.page.page_type === 'download_list'
    let isFaqList = window.app.info.page.page_type === 'faq_list'
    let downloadSearchDom = document.querySelector('.form-control.download-search')
    let downloadKw = ''
    if (downloadSearchDom) {
      downloadKw = downloadSearchDom.value
    }
    // let storeDom = document.querySelector('.store-search .ss-input')
    // let storeKw = {}
    // if (storeDom) {
    //   storeKw = window.app.info.storeAddress
    // }
    let cur_page_category_id = window.app.info.page.cur_page_category_id || 0
    let data = null
    if (isFaqList) {
      data = {...window.app.info.pagination}
      // data = await window.app.getFAQListPageBySearch({
      //   keywork,
      //   page_number: num,
      //   page_size: size,
      //   faq_type_id: window.app.info.faq_type_id,
      //   page_category_id: window.app.info.page.page_category_id
      // })
    } else if (isDownloadSearch) {
      data = await window.app.getDownloadListPageBySearch(num, size,downloadKw, cur_page_category_id)
    } else if (window.app.info.page.page_type === 'store_list') {
      // 门店列表搜索
      data = await window.app.getStoreListPageBySearch(num, size,window.app.info.storeAddress)
    } else {
      data = await window.app.getProductListPageBySearch(this.type, num, size,keywork)
    }
    // data = isDownloadSearch? (await window.app.getDownloadListPageBySearch(num, size,downloadKw, cur_page_category_id)) : (await window.app.getProductListPageBySearch(this.type, num, size,keywork))
    const page = this.getPaginationInfo(baseUrl, data)
    this.$pagination.innerHTML = ''
    if (!page.total || page.total === 0) return
    const pagination = new ScriptPaginationElement(this.attrId, page, isClient)
    this.$pagination.append(pagination.$unitPagination)
    pagination.clientEvent()
  }

  /**
   * 获取返回的分页信息
   * @param {*} page_base_url
   * @param {*} data
   * @returns
   */
  getPaginationInfo(page_base_url, data) {
    const page = {
      page_base_url,
      page_count: data.page_count,
      page_number: data.page_number,
      page_size: data.page_size,
      total: data.total
    }
    return page
  }
}

/** 生成分页的节点元素 **/
class ScriptPaginationElement {
  constructor(attrId, page, isClient) {
    // 组件id
    this.attrId = attrId
    // 分页信息
    this.page = page
    // 是否js分页
    this.isClient = isClient
    // li 基本类名
    this.baseItemClassName = 'base-pagination__item'
    // a 基本类名
    this.baseLinkClassName = 'base-pagination__link'
    // 无效的类名
    this.disabledClassName = 'disabled'
    // 分页箭头iconfont
    this.iconfontLeft = '<span class="iconfont icon-action-left-lighter"></span>'
    this.init()
  }

  init() {
    this.initMainNode()
  }

  /** 初始化主节点，分为分页列表和输入信息 **/
  initMainNode() {
    // 分页节点
    this.$unitPagination = this.createNode('unit-pagination')
    this.$unitPagination.setAttribute('pagination-style', this.style_type_pagination)
    // 页码信息
    const $nav = this.createNode('base-pagination')
    this.$items = this.createNode('base-pagination__items')
    $nav.append(this.$items)
    this.getItem()
    // 输入框信息
    const $input = this.getInput()

    this.$unitPagination.append($nav)
    this.$unitPagination.append($input)
  }

  /** 加载客户端不刷新分页事件 */
  clientEvent() {
    if (this.isClient) {
      // 分页组a
      this.$pagination = document.querySelector(`#${this.attrId}`)
      const $links = this.$pagination.querySelectorAll(`a`)
      $links.forEach($link => {
        $link.addEventListener('click', (event) => {
          if (event.preventDefault) event.preventDefault()
          if ($link.parentNode.classList.contains('disabled')) {
            return
          }
          const num = +$link.getAttribute('data-num')
          if (Number.isNaN(num) || num === 0) return
          this.clientPagination(num)
        })
      })

      this.$inputInner = this.$pagination.querySelector('.base-pagination__input-inner')
      // 回车跳转
      this.$inputInner.addEventListener('keydown', (e) => {
        e = e || window.event;
        if (e.keyCode === 13) {
          const num = +this.$inputInner.value
          if (!Number.isNaN(num)) this.clientPagination(num)
        }
      })
    }
  }

  /** 客户端不刷新分页 */
  clientPagination(num) {
    this.page.page_number = num
    window.app.info.pagination.page_number = num
    this.$pagination.innerHTML = ''
    this.initMainNode()
    this.$pagination.append(this.$unitPagination)
    let downloadSearchDom = document.querySelector('.form-control.download-search')
    let downloadKw = ''
    if (downloadSearchDom) {
      downloadKw = downloadSearchDom.value
    }
    let isFaqList = window.app.info.page.page_type === 'faq_list'
    if (isFaqList) {
      const keyworkEl = document.querySelector('.faq-text-input')
      let keywork = keyworkEl ? keyworkEl.value : ''
      // todo keywork
      window.app.info.renderFAQList({
        keywork,
        page_number: num,
        page_size: this.page.page_size,
        faq_type_id: window.app.info.faq_type_id
      })
    } else if (window.app.info.page.page_type === 'download_list') {
      window.app.info.renderDownloadList({
        page_number:num,
        keyword:downloadKw
      })
    } else if (window.app.info.page.page_type === 'store_list') {
      window.app.info.renderStoreList({
        page_number:num,
        area:window.app.info.storeAddress || {}
      })
    } else{
      window.app.info.renderListView()
    }

    window.scrollTo(0,0)
  }

  /** 页码信息 **/
  getItem() {
    this.getFirstPrevItem()
    this.getThanTwoItem()
    this.getThanOneItem()
    this.getActiveItem()
    this.getCountThanOne()
    this.getCountThanTwo()
    this.getCountThanNum()
    this.getNextItem()
    // this.getLastItem()
  }

  /** 第一页，上一页 */
  getFirstPrevItem() {
    // const firstClassList = ['base-pagination__item', 'base-pagination__item--first']
    // let href = ''
    // if (this.page.page_number === 1 || this.page.page_count === 1) {
    //   firstClassList.push('disabled')
    //   href = 'javascript:;'
    // }
    // const $firstItem = this.getUlLi(firstClassList)
    // const $firstLink = this.getUlLiLink(href, this.iconfontLeft, 1)
    // $firstItem.append($firstLink)
    // this.$items.append($firstItem)

    const prevClassList = ['base-pagination__item', 'base-pagination__item--prev']
    if (this.page.page_number === 1) {
      prevClassList.push('disabled')
    }
    const $prevItem = this.getUlLi(prevClassList)
    const prevHref = `${this.page.page_base_url}_list${this.page.page_number - 1}.html`
    const $prevLink = this.getUlLiLink(prevHref, this.iconfontLeft, this.page.page_number - 1)
    $prevItem.append($prevLink)
    // this.$items.append($firstItem)
    this.$items.append($prevItem)
  }

  /** 页数大于2时 */
  getThanTwoItem() {
    if (this.page.page_number > 2) {
      const $item = this.getUlLi(this.baseItemClassName)
      const $link = this.getUlLiLink(`${this.page.page_base_url}_list1.html`, 1, 1)
      $item.append($link)
      this.$items.append($item)
    }

    if (this.page.page_number > 2 && this.page.page_number - 2 > 1) {
      const classList = [this.baseItemClassName, this.disabledClassName]
      const $item2 = this.getUlLi(classList)
      $item2.append(this.getUlLiLink('javascript:;', '...', 0))
      this.$items.append($item2)
    }
  }

  /**
   * 页数大于1时
   */
  getThanOneItem() {
    if (this.page.page_number > 1) {
      const $liItem = this.getUlLi(this.baseItemClassName)
      $liItem.append(
        this.getUlLiLink(
          `${this.page.page_base_url}_list${this.page.page_number - 1}.html`,
          `${this.page.page_number - 1}`,
          this.page.page_number - 1
        )
      )
      this.$items.append($liItem)
    }
  }

  /**
   * 当前页时
   */
  getActiveItem() {
    const $liItem = this.getUlLi([this.baseItemClassName, 'active'])
    $liItem.append(
      this.getUlLiLink(
        `${this.page.page_base_url}_list${this.page.page_number}.html`,
        `${this.page.page_number}`,
        this.page.page_number
      )
    )
    this.$items.append($liItem)
  }

  /**
   * 总数减去页数大于1时
   */
  getCountThanOne() {
    if (this.page.page_count - this.page.page_number > 1) {
      const $liItem = this.getUlLi(this.baseItemClassName)
      $liItem.append(
        this.getUlLiLink(
          `${this.page.page_base_url}_list${this.page.page_number + 1}.html`,
          `${this.page.page_number + 1}`,
          this.page.page_number + 1
        )
      )
      this.$items.append($liItem)
    }
  }

  /**
   * 总数减去页数大于2时
   */
  getCountThanTwo() {
    if (this.page.page_count - this.page.page_number > 2) {
      const classList = [this.baseItemClassName, this.disabledClassName]
      const $liItem = this.getUlLi(classList)
      $liItem.append(this.getUlLiLink(`javascript:;`, `...`, 0))
      this.$items.append($liItem)
    }
  }

  /**
   * 总数大于页面时
   */
  getCountThanNum() {
    const ok = this.page.page_count !== this.page.page_number
      && this.page.page_count > this.page.page_number
    if (ok) {
      const $liItem = this.getUlLi(this.baseItemClassName)
      $liItem.append(
        this.getUlLiLink(
          `${this.page.page_base_url}_list${this.page.page_count}.html`,
          `${this.page.page_count}`,
          this.page.page_count
        )
      )
      this.$items.append($liItem)
    }
  }

  /**
   * 下一页
   */
  getNextItem() {
    const classList = [this.baseItemClassName, 'base-pagination__item--next', 'page-next']
    if (this.page.page_number === this.page.page_count) classList.push(this.disabledClassName)
    const $liItem = this.getUlLi(classList)
    $liItem.append(
      this.getUlLiLink(
        `${this.page.page_base_url}_list${this.page.page_number + 1}.html`,
        this.iconfontLeft,
        this.page.page_number + 1
      )
    )
    this.$items.append($liItem)
  }

  /**
   * 最后一页
   */
  // getLastItem() {
  //   const classList = [this.baseItemClassName, 'base-pagination__item--last']
  //   let href = 'javascript:;'
  //   let num = 0
  //   if (this.page.page_number === this.page.page_count ||
  //     this.page.page_count === 1) {
  //     classList.push(this.disabledClassName)
  //     num = 0
  //   } else {
  //     href = `${this.page.page_base_url}_list${this.page.page_count}.html`
  //     num = this.page.page_count
  //   }
  //   const $liItem = this.getUlLi(classList)
  //   $liItem.append(
  //     this.getUlLiLink(href, this.iconfontLeft, num)
  //   )
  //   this.$items.append($liItem)
  // }

  /**
   * 获取输入分页框
   */
  getInput() {
    const attrList = [
      { attrName: 'data-count', value: this.page.page_count },
      { attrName: 'data-current', value: this.page.page_number }
    ]
    // input
    const $inputDiv = this.createNode('base-pagination__input', attrList)
    const inputClass = 'base-pagination__input-inner'
    const inputAttr = [{ attrName: 'placeholder', value: window.app.utilts.$t('Go to Page') }]
    const $input = this.createNode(inputClass, inputAttr, 'input')
    $inputDiv.append($input)

    // a 标签
    const linkClass = ['iconfont', 'icon-action-left-lighter', 'base-pagination__input-href']
    const attrs = [{ attrName: 'data-href', value: `${this.page.page_base_url}_list.html` }]
    const $link = this.createNode(linkClass, attrs, 'a')
    $inputDiv.append($link)
    return $inputDiv
  }

  /**
   * 创建分页下nav里的li
   * @param {类名} classNames '' || []
   * @param {属性} attrs [{attrName:'', value:''}]
   */
  getUlLi(classNames, attrs) {
    return this.createNode(classNames, attrs, 'li')
  }

  /**
   * 获取分页li下的a标签
   * @param {链接} href
   * @param {a标签下的无素} html
   * @returns a标签节点
   */
  getUlLiLink(href, html, num) {
    const attrs = [
      { attrName: 'href', value: href },
      { attrName: 'data-num', value: num }
    ]
    const $link = this.createNode(this.baseLinkClassName, attrs, 'a')
    if (html) $link.innerHTML = html
    return $link
  }

  /**
   * 创建节点
   * @param {string} classNames '类名' || []
   * @param {Object} attrs [{attrName:'', value:''}]
   * @param {string} element 节点类型
   * @returns
   */
  createNode(classNames, attrs, element = 'div') {
    const $div = document.createElement(element)
    if (typeof classNames === 'string') {
      $div.classList.add(classNames)
    } else if (Array.isArray(classNames)) {
      classNames.forEach(p => $div.classList.add(p))
    }
    if (Array.isArray(attrs)) {
      attrs.forEach(p => {
        $div.setAttribute(p.attrName, p.value || '')
      })
    }
    return $div
  }
}
