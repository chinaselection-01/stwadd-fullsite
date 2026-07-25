class ScriptInquireList extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.$list_box = this.$dom.querySelector('.unit-inquire-lists')
    this.$allSelect = this.$dom.querySelector('input[name="unit-select-all-product"]')
    this.$nodata = this.$dom.querySelector('.unit-inquire-notdata')
    this.attrId = params.attrId
    this.utils = Utilts.ins()
  }
  /** 初始化，支持异步 */
  async init() {
    this.initContentHtml()
  }

  get list() {
    return window.app.info.productInquireList
  }
  get productQuoteIdList() {
    return window.app.info.productQuoteIdList
  }
  get productQuoteList() {
    return window.app.info.productQuoteList
  }
  set productQuoteList(data) {
    window.app.info.updateProductQuoteList(data)
  }
  initQuoteListTips() {
    const $title = document.querySelector('.title')
    const $desc = document.querySelector('.desc')
    $title.innerText = window.app.utilts.$t(`Get in touch with us`)
    $title.parentNode.parentNode.parentNode.parentNode.style.textAlign = 'left'
    $desc.innerText = window.app.utilts.$t(`Just leave your email or phone number in the contact form so we can send you a free quote for our wide range of designs!`)
    $desc.parentNode.parentNode.parentNode.parentNode.style.textAlign = 'left'
    $desc.parentNode.parentNode.parentNode.parentNode.style.width = '100%'


  }
  async initQuoteList() {
    this.productQuoteList = []
    if (this.productQuoteIdList.length > 0) {
      const res = await this.getProductData(this.productQuoteIdList.toString(),'title,price,thumb')
      this.productQuoteList = res.data.map(i => {
        return {
          ...i,
          page_url: location.origin + globalThis.Server.getRinseHref(i.page_url,window.app.info.site),
          amount: 1
        }
      })

      // updateProductQuoteList(this.productQuoteList)
    }
    const $header = document.querySelector('.unit-selet-all')
    $header.style.display = 'flex'
    const count = this.productQuoteList.length
    $header.innerHTML = `<div style="width: 80%;flex: 1" class="product-quote-title">${window.app.utilts.$t('products')}(${count})</div><div style="width: 180px">${window.app.utilts.$t('quantity')}</div>`
    if (this.productQuoteList.length === 0) {
      this.$nodata.classList.add('show')
      this.$list_box.classList.add('d-none')
      // this.$allSelect.setAttribute('disabled', 'disabled')
      return
    }
    const contentHtml = []

    for (let index = 0; index < this.productQuoteList.length; index++) {
      const item = this.productQuoteList[index]
      if (!item) return
      contentHtml.push(this.getQuoteContentHtml(item, index))
    }
    this.$list_box.innerHTML = contentHtml.join('')
  }
  initQuoteListEvent() {
    const max_amount = 99999
    const _this = this
    const $quoteList = document.querySelector('.quote-list')
    const items = $quoteList.querySelectorAll('.unit-inquire-list-items')
    items.forEach(item => {
      const contentId = item.getAttribute('content-id')
      const $inputIncrease = item.querySelector('.input-number__increase')
      const $inputDecrease = item.querySelector('.input-number__decrease')
      const $input = item.querySelector('.input-number input')
      function checkDisable() {
        if ($input.value <= 1) {
          $inputDecrease.classList.add('disabled')
        } else {
          $inputDecrease.classList.remove('disabled')
        }
      }
      $inputDecrease.addEventListener('click',function (){
        if($input.value <= 1) return
        $input.value = $input.value - 0 - 1
        const curr = _this.productQuoteList.find(i => i.id == contentId)
        curr.amount = $input.value - 0
        window.app.info.updateProductQuoteList(_this.productQuoteList)

        checkDisable()
      })
      $inputIncrease.addEventListener('click',function (){
        if ($input.value - 0 >= max_amount) return
        $input.value = $input.value - 0 + 1
        const curr = _this.productQuoteList.find(i => i.id == contentId)
        curr.amount = $input.value - 0
        window.app.info.updateProductQuoteList(_this.productQuoteList)
        checkDisable()
      })
      $input.addEventListener('change',function (){
        $input.value = Math.floor(Number($input.value))
        if (Number.isNaN(Number($input.value))||$input.value<1) {
          $input.value = 1
        }
        if ($input.value - 0 >= max_amount) {
          $input.value = max_amount
        }
        const curr = _this.productQuoteList.find(i => i.id == contentId)
        curr.amount = $input.value - 0
        window.app.info.updateProductQuoteList(_this.productQuoteList)
        checkDisable()
      })
      item.querySelector('.unit-inquire-list-remove').addEventListener('click',function (){
        const contentId = item.getAttribute('content-id')
        window.app.info.delProductQuote(contentId)
        _this.productQuoteList = _this.productQuoteList.filter(i => i.id != contentId)
        item.remove()
        const items = $quoteList.querySelectorAll('.unit-inquire-list-items')
        $quoteList.querySelector('.product-quote-title').innerHTML = `${window.app.utilts.$t(`products`)}(${items.length})`
        if (items.length === 0) {
          _this.$nodata.classList.add('show')
        }
      })
    })
  }

  /** 获取产品数据 */
  getProductData(ids, columns) {
    return new Promise((resolve, reject) => {
      const params = {
        site_id: window.app.info.site.site_id,
        language_code: window.app.info.site.language_code,
        columns: columns,
        ids: ids,
        page_size: 50
      }
      // if (columns.indexOf('video') > -1) {
      //   params['is_video'] = 1
      // }
      this.utilts.request({
        url: '/product/get-list-by-filter',
        method: 'GET',
        params
      }).then(res => {
        resolve(res)
      })
          .catch(error => reject(error))
    })
  }

  /**询盘列表内容初始化 */
  async initContentHtml() {
    const type = this.utils.urlParams.type
    if (type==='quoteList') {
      this.initQuoteListTips()
      document.querySelector('.unit-inquire-list').classList.add('quote-list')
      await this.initQuoteList()
      this.initQuoteListEvent()
      return
    }
    if (this.list.length === 0) {
      this.$nodata.classList.add('show')
      this.$list_box.classList.add('d-none')
      this.$allSelect.setAttribute('disabled', 'disabled')
      return
    }
    let contentHtml = []
    for (let index = 0; index < this.list.length; index++) {
      const item = this.list[index]
      if (!item) return
      contentHtml.push(this.getContentHtml(item, index))
    }
    
    // 产品搭配的询盘,只显示选中的搭配产品
    let matchProducts = JSON.parse(sessionStorage.getItem('matchProducts') || '[]')
    let mainProduct = JSON.parse(sessionStorage.getItem('mainProduct') || '{}')
    if (window.app.info.isMatchProducts && matchProducts.length) {
      contentHtml = []
      let matchInquires = matchProducts.map(el => {
        return {
          href: el.page_url,
          detail_title: el.title,
          detail_thumb: el.thumb_prefix,
          selected: 1,
          page_url: el.page_url,
        }
      })
      matchInquires.unshift(mainProduct)
      for (let index = 0; index < matchInquires.length; index++) {
        const item = matchInquires[index]
        if (!item) return
        contentHtml.push(this.getContentHtml(item, index))
      }
    }
    
    this.$list_box.innerHTML = contentHtml.join('')
    this.initDetailEvent()
    this.delEvent()
    this.selectAllEvent()

  }
  /**询盘列表数据绑定事件 */
  initDetailEvent() {
    let $inputList = this.$list_box.querySelectorAll('input[name="product"]')
    for (let $input of $inputList) {
      $input.onchange = () => {
        window.app.info.toogleSelectProductInquire($input.value)
        this.setCheckAllBox()
      }
    }
  }

  /**删除按钮事件绑定 */
  delEvent() {
    const $delBtnList = this.$list_box.querySelectorAll('.unit-icon-action-close')
    for (let $delBtnItem of $delBtnList) {
      $delBtnItem.onclick = () => {
        new Modal().confirm(window.app.utilts.$t('Are you sure you want to delete it?'))
          .then(() => {
            const index = $delBtnItem.dataset.id
            window.app.info.delProductInquire(index)
            const $li = this.$list_box.querySelector(`[inquire-index="${index}"]`)
            if ($li) $li.remove($li)
            this.setCheckAllBox()
            new Message().success(window.app.utilts.$t('Successfully delete'))
          })
          .catch(() => new Message().warn(window.app.utilts.$t('Not deleted')))
      }
    }
  }

  /**询盘列表数据全选 */
  selectAllEvent() {
    // 初始时，是否选中全选
    this.setCheckAllBox()
    // 全选事件
    this.$allSelect.onchange = () => {
      // 修改询盘全选或不全选
      window.app.info.selectAllProductInquire(this.$allSelect.checked ? 1 : 0)
      const $checkBoxs = this.$list_box.querySelectorAll('[type="checkbox"]')
      $checkBoxs.forEach($checkBox => $checkBox.checked = this.$allSelect.checked)
    }
  }

  /** 如果所有的数据是选中的，设置全选为选中，反之不选中 */
  setCheckAllBox() {
    this.$allSelect.checked = this.list.length >= 1 ? this.list.every(p => p.selected === 1) : false
  }

  /** 拼接的li html */
  getContentHtml(item, index) {
    let iopcmd = { convert: { quality: 100 }, thumbnail: { type: 4, width: 100 } }
    let query_arr = item.detail_thumb.split('?')
    if (query_arr.length > 1) {
      let iopcmd_arr = query_arr[1].split('iopcmd=')
      if (iopcmd_arr.length > 1) {
        iopcmd_arr.shift()
        iopcmd.query = 'iopcmd=' + iopcmd_arr.join('iopcmd=')
      }
    }

    const liHtml = []
    const href = globalThis.Server.getRinseHref(item.page_url, window.app.info.site)
    liHtml.push(`<li class="unit-inquire-list-items" inquire-index="${item.page_id}">`)
    liHtml.push(`    <div class="custom-control custom-checkbox">`)
    liHtml.push(`      <input type="checkbox" class="custom-control-input" name="product" ${item.selected === 1 ? 'checked' : ''} value="${item.page_id}" id="${this.attrId}-${item.detail_title}">`)
    liHtml.push(`      <label class="custom-control-label" for="${this.attrId}-${item.detail_title}"></label>`)
    liHtml.push(`    </div>`)
    liHtml.push(`    <a class="unit-inquire-list-a follow-font-family" text-style="3" href="${href}">`)
    liHtml.push(`      <div class="unit-inquire-list-img"><img class="" src="${globalThis.Server.getTransferImgUrl(query_arr[0], iopcmd, 'webp', window.app.info.site)}" /></div>`)
    liHtml.push(`      <div class="unit-inquire-list-title">${item.detail_title}</div>`)
    liHtml.push(`    </a>`)
    liHtml.push(`    <span class="iconfont unit_del_icon icon-action-close unit-icon-action-close" data-toggle="modal" data-target="#exampleModal" data-id="${item.page_id}"></span>`)
    liHtml.push(`</li>`)
    return liHtml.join('')
  }
  getQuoteContentHtml(item, index) {
    let iopcmd = { convert: { quality: 100 }, thumbnail: { type: 4, width: 100 } }
    let query_arr = item.thumb.split('?')
    if (query_arr.length > 1) {
      let iopcmd_arr = query_arr[1].split('iopcmd=')
      if (iopcmd_arr.length > 1) {
        iopcmd_arr.shift()
        iopcmd.query = 'iopcmd=' + iopcmd_arr.join('iopcmd=')
      }
    }

    const liHtml = []
    const href = globalThis.Server.getRinseHref(item.page_url, window.app.info.site)
    liHtml.push(`<li class="unit-inquire-list-items" content-id="${item.id}">`)
    liHtml.push(`    <div class="unit-inquire-list-a follow-font-family" text-style="3" >`)
    liHtml.push(`      <div class="unit-inquire-list-img"><img class="" src="${globalThis.Server.getTransferImgUrl(query_arr[0], iopcmd, 'webp', window.app.info.site)}" /></div>`)
    liHtml.push(`      <div class="unit-inquire-list-product">`)
    liHtml.push(`        <a href="${href}">`)
    liHtml.push(`          <div class="unit-inquire-list-title">${item.title}</div>`)
    liHtml.push(`        </a>`)
    liHtml.push(`        <div class="unit-inquire-list-remove">${window.app.utilts.$t('Remove')}</div>`)
    liHtml.push(`      </div>`)
    liHtml.push(`    </div>`)
    liHtml.push(`    <div class="input-number"><span class="input-number__decrease disabled">-</span><input type="text" value="1"><span class="input-number__increase">+</span></div>`)
    liHtml.push(`</li>`)
    return liHtml.join('')
  }

  render() {
    this.initContentHtml()
  }
}
