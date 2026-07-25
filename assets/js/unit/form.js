const countryPhoneCodes = [
  { name: "United States / Canada", code: "+1", countryCode: "US" },
  { name: "Russia", code: "+7", countryCode: "RU" },
  { name: "Egypt", code: "+20", countryCode: "EG" },
  { name: "South Africa", code: "+27", countryCode: "ZA" },
  { name: "Greece", code: "+30", countryCode: "GR" },
  { name: "Netherlands", code: "+31", countryCode: "NL" },
  { name: "Belgium", code: "+32", countryCode: "BE" },
  { name: "France", code: "+33", countryCode: "FR" },
  { name: "Spain", code: "+34", countryCode: "ES" },
  { name: "Italy", code: "+39", countryCode: "IT" },
  { name: "Romania", code: "+40", countryCode: "RO" },
  { name: "Switzerland", code: "+41", countryCode: "CH" },
  { name: "Austria", code: "+43", countryCode: "AT" },
  { name: "United Kingdom", code: "+44", countryCode: "GB" },
  { name: "Denmark", code: "+45", countryCode: "DK" },
  { name: "Sweden", code: "+46", countryCode: "SE" },
  { name: "Norway", code: "+47", countryCode: "NO" },
  { name: "Poland", code: "+48", countryCode: "PL" },
  { name: "Germany", code: "+49", countryCode: "DE" },
  { name: "Peru", code: "+51", countryCode: "PE" },
  { name: "Mexico", code: "+52", countryCode: "MX" },
  { name: "Cuba", code: "+53", countryCode: "CU" },
  { name: "Argentina", code: "+54", countryCode: "AR" },
  { name: "Brazil", code: "+55", countryCode: "BR" },
  { name: "Chile", code: "+56", countryCode: "CL" },
  { name: "Colombia", code: "+57", countryCode: "CO" },
  { name: "Venezuela", code: "+58", countryCode: "VE" },
  { name: "Malaysia", code: "+60", countryCode: "MY" },
  { name: "Australia", code: "+61", countryCode: "AU" },
  { name: "Indonesia", code: "+62", countryCode: "ID" },
  { name: "Philippines", code: "+63", countryCode: "PH" },
  { name: "New Zealand", code: "+64", countryCode: "NZ" },
  { name: "Singapore", code: "+65", countryCode: "SG" },
  { name: "Thailand", code: "+66", countryCode: "TH" },
  { name: "Japan", code: "+81", countryCode: "JP" },
  { name: "South Korea", code: "+82", countryCode: "KR" },
  { name: "Vietnam", code: "+84", countryCode: "VN" },
  { name: "China", code: "+86", countryCode: "CN" },
  { name: "Hong Kong", code: "+852", countryCode: "HK" },
  { name: "Macau", code: "+853", countryCode: "MO" },
  { name: "Taiwan", code: "+886", countryCode: "TW" },
  { name: "Turkey", code: "+90", countryCode: "TR" },
  { name: "India", code: "+91", countryCode: "IN" },
  { name: "Pakistan", code: "+92", countryCode: "PK" },
  { name: "Sri Lanka", code: "+94", countryCode: "LK" },
  { name: "Myanmar", code: "+95", countryCode: "MM" },
  { name: "Iran", code: "+98", countryCode: "IR" },
  { name: "Morocco", code: "+212", countryCode: "MA" },
  { name: "Algeria", code: "+213", countryCode: "DZ" },
  { name: "Tunisia", code: "+216", countryCode: "TN" },
  { name: "Nigeria", code: "+234", countryCode: "NG" },
  { name: "Ghana", code: "+233", countryCode: "GH" },
  { name: "Kenya", code: "+254", countryCode: "KE" },
  { name: "Tanzania", code: "+255", countryCode: "TZ" },
  { name: "Saudi Arabia", code: "+966", countryCode: "SA" },
  { name: "Lebanon", code: "+961", countryCode: "LB" },
  { name: "United Arab Emirates", code: "+971", countryCode: "AE" },
  { name: "Israel", code: "+972", countryCode: "IL" },
  { name: "Bahrain", code: "+973", countryCode: "BH" },
  { name: "Qatar", code: "+974", countryCode: "QA" },
  { name: "Oman", code: "+968", countryCode: "OM" },
  { name: "Jordan", code: "+962", countryCode: "JO" },
  { name: "Syria", code: "+963", countryCode: "SY" },
  { name: "Iraq", code: "+964", countryCode: "IQ" },
  { name: "Ukraine", code: "+380", countryCode: "UA" },
  { name: "Croatia", code: "+385", countryCode: "HR" },
  { name: "Slovenia", code: "+386", countryCode: "SI" },
  { name: "Czech Republic", code: "+420", countryCode: "CZ" },
  { name: "Slovakia", code: "+421", countryCode: "SK" },
  { name: "Latvia", code: "+371", countryCode: "LV" },
  { name: "Lithuania", code: "+370", countryCode: "LT" },
  { name: "Estonia", code: "+372", countryCode: "EE" },
  { name: "Belarus", code: "+375", countryCode: "BY" }
];

// 全局缓存：防止页面多个询盘组件重复请求 IP 信息
let _ipInfoPromise = null  // 共享的 Promise，确保只发起一次请求
let _cachedAreaCode = null // 缓存匹配到的电话区号（如 +86）
class ScriptForm extends Script {
  constructor(params) {
    super(params)
    this.formType = params.formType
    this.is_inquiry_captcha = Number(params.is_inquiry_captcha) || 0
  this.$form = document.querySelector(`#inquiry-${this.attrId}`)
    if (!this.$form) throw new Error('$form not found')
    this.$submit = this.$form.querySelector('.base-button__inner')
    this.$file = this.$form.querySelector('[type="file"]')
    this.$file_box = this.$form.querySelector('.unit-form__control--file')
    this.$file_list = this.$form.querySelector('.unit-form__file-list')
    this.file_config = []
    this.is_record_input = false
    this.is_record_submit = false
    this.utils = Utilts.ins()

  }
  /** 初始化，支持异步 */
  async init() {
    this._initTel()
    this._fix()
    this._initCheckboxGroup()
    this._initDropdownList()
    this._observeFormVisible()
    this._initInquiry()
    // console.log('init')
  }
  // 使用 IntersectionObserver 懒加载：表单进入视口后才请求 IP 信息
  _observeFormVisible() {
    if (!this.$form) return
    // console.log('form', this.$form)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // console.log('entry', entry)
        if (entry.isIntersecting) {
          this._getIpInfo()
          observer.disconnect()
        }
      })
    }, { threshold: 0 })
    observer.observe(this.$form)
  }
  _initTel() {
    const phoneList = this.$form.querySelectorAll('[name="phone"]')
    phoneList.forEach((inputDom, index) => {
      if (!inputDom.classList.contains('phone-input')) return
      const has = !!inputDom.parentElement?.querySelector('.area-code-display');
      if(has) return
      const displaySelectDom = Object.assign(document.createElement('div'), {
        className: 'unit-form__control form-control phone-area-code area-code-display dropdown-toggle',
        // textContent: countryPhoneCodes[0].code
        textContent: '+86'
      })
      const selectDom = Object.assign(document.createElement('select'), {
        className: 'phone-area-code unit-form__control form-control area-code-select',
        name: 'phone-area-code'
      })
      countryPhoneCodes.forEach(item => {
        const option = document.createElement('option');
        option.value = item.code;
        option.textContent = `（${item.code}） ${window.app.utilts.$t(item.name)}`;
        selectDom.appendChild(option)
      })
      selectDom.addEventListener('change', function(event) {
        displaySelectDom.innerText = event.target.value
      })
      inputDom.classList.add('phone-input')
      inputDom.before(displaySelectDom, selectDom)
      // 优先使用已缓存的区号（内存或 sessionStorage），否则默认 +86
      selectDom.value = _cachedAreaCode || sessionStorage.getItem('areaCode') || '+86'
      displaySelectDom.textContent = _cachedAreaCode || sessionStorage.getItem('areaCode') || '+86'
    })
  }
  _fix() {
    console.log(`this.formType`, this.formType);
    if (this.formType === 'subscription') return
    let hasContent = false
    this.$form.querySelectorAll('textarea').forEach(item => {
      if (item.getAttribute('name') === 'content') hasContent = true
    })

    if (!hasContent) {
      console.log(43, this.$form.querySelector('.unit-form__item.unit-form__item-submit'));
      this.$form.querySelector('.unit-form__item.unit-form__item-submit').outerHTML = `<div text-style="3" class="follow-font-family_size unit-form__item form-group col-12 ">
        <label class="unit-form__item-inner ">

          <textarea class="unit-form__control form-control" rows="5" name="content" data-title="content" maxlength="65530" placeholder="content" required="required" minlength="1"></textarea>
          <div class="invalid-feedback">textarea must not exceed 65530 in length!</div>

          <span class="unit-form__label col-form-label">${this.utils.$t('content')}</span>
        </label>
      </div>` + this.$form.querySelector('.unit-form__item.unit-form__item-submit').outerHTML
    }
  }
  _initCheckboxGroup(){
    this.$form.addEventListener('click', function(evt){
      if (evt.target.classList.contains('unit-form__checkbox-list-inner')) {
        evt.stopPropagation()
        evt.preventDefault()
        return false
      }
      const elem = evt.target.closest('.unit-form__checkbox-inner')
      if (elem) {
        evt.stopPropagation()
        const checkbox = elem.querySelector('input[type="checkbox"]')
        if(checkbox && evt.target !== checkbox){
          evt.preventDefault()
          checkbox.checked = !checkbox.checked
        }
      } else if (evt.target.closest('.unit-form__checkbox-list')) {
        evt.preventDefault()
      }
    })
  }

  _initDropdownList() {
    var _t = this;
    const dropdownList = this.$form.querySelectorAll('.dropdown')
    const showMap = new WeakMap()
    function showDropdownMenu(dropdownMenu, show) {
      if (show) {
        dropdownMenu.classList.add('show')
        showMap.set(dropdownMenu, true)
      } else {
        dropdownMenu.classList.remove('show')
        showMap.set(dropdownMenu, false)
      }
    }
    document.addEventListener('click', function (evt) {
      let elem = evt.target.closest('.dropdown')
      dropdownList.forEach(function (dropdown) {
        if (dropdown && elem !== dropdown) {
          const dropdownMenu = dropdown.querySelector('.dropdown-menu')
          // dropdownMenu.classList.remove('show')
          showDropdownMenu(dropdownMenu, false)
        }
      })
    })
    dropdownList.forEach(function (dropdown) {
      const dropdownToggle = dropdown.querySelector('.dropdown-toggle')
      const dropdownMenu = dropdown.querySelector('.dropdown-menu')
      if (dropdownToggle && dropdownMenu) {
        const input = dropdown.querySelector('input.form-control')
        const popperInstance = Popper.createPopper(dropdownToggle, dropdownMenu, {
          placement: 'bottom',
          strategy: 'absolute',
          adaptive: false,
          roundOffsets: false,
          modifiers: [
            {
              name: 'computeStyles',
              options: {
                roundOffsets: ({ x, y }) => ({
                  x: 0,
                  y: input.parentNode.offsetHeight || 47,
                }),
              },
            },
          ],
        })
        dropdownToggle.addEventListener('click', function () {
          // dropdownMenu.classList.toggle('show')
          showDropdownMenu(dropdownMenu, !showMap.get(dropdownMenu)) // 避免移动端 show 添加又移除
          popperInstance.update() // 触发重新计算定位
        })
        dropdownMenu.addEventListener('click', function (evt) {
          if (evt.target.classList.contains('dropdown-item')) {
            evt.stopPropagation()
            evt.preventDefault()
            if (input&&!(evt.target.classList.contains('multi_select'))) {
              input.value = evt.target.innerText
            }
            // dropdownMenu.classList.remove('show')
            showDropdownMenu(dropdownMenu, false)
          }
          if (evt.target.classList.contains('multi_select')) {
            evt.stopPropagation()
            evt.preventDefault()
            if(evt.target.classList.contains('current_multi_select')){
              evt.target.classList.remove('current_multi_select')
            }else{
              evt.target.classList.add('current_multi_select')
            }
            input.style.color = 'transparent'
            updateTags(dropdownMenu,input)
          }
        })
        var multiListInpur = dropdownMenu.querySelectorAll('input[type="checkbox"]')
        if(multiListInpur){
          multiListInpur.forEach((checkbox)=>{
            checkbox.addEventListener('click', function (evt) {
              if(checkbox.parentNode.classList.contains('current_multi_select')){
                checkbox.parentNode.classList.remove('current_multi_select')
              }else{
                checkbox.parentNode.classList.add('current_multi_select')
              }
              updateTags(dropdownMenu,input)
            })
          })
        }
        // multiListInpur?.map.addEventListener('click', function (evt) {
        //   console.log(evt)
        // })
      }
    })
    function updateTags(dropdown,input) {
      const $tags_wrap = dropdown.parentNode.querySelector('.multi_select__tags-wrap')
      const $tags = dropdown.parentNode.querySelector('.multi_select__tags')
      const $rest = $tags_wrap.querySelector('.multi_select__tags-rest')
      $rest.classList.add('d-none')
      let multiList = Array.from(dropdown.querySelectorAll('.multi_select')).forEach(a=>{
        a.querySelector('input').checked = false;
      })
      let list = Array.from(dropdown.querySelectorAll('.current_multi_select'))
      input.value = ''
      $tags.innerHTML = list?.map(it => {
        input.value = input.value + it.title+','
        it.querySelector('input').checked = true;
        return `<div class="multi_select__tag">
          <div class="multi_select__tag-inner">
          <span class="multi_select__tag-text">${it.title}</span><i class="multi_select__tag-close iconfont icon-action-close-2"></i>
          </div>
        </div>`
      }).join('') || '';

     let tagsSelect =Array.from($tags.querySelectorAll('.multi_select__tag-inner'))
     tagsSelect.forEach(tag=>{

        var multiSelectClose =  tag.querySelector('.multi_select__tag-close')
        multiSelectClose.addEventListener('click',function(evt){
          evt.stopPropagation()
          evt.preventDefault()
          let title = tag.querySelector('.multi_select__tag-text').innerText
          list?.map(it => {
            if(it.title.trim().toLowerCase() == title.trim().toLowerCase()){
              it?.click()
            }
          })
        })
     })
      // 强制一行 省略后续标签------------------------------------------------------------
      const $tag_list = $tags.querySelectorAll('.multi_select__tag-inner')
      const wrapRight =  $tags_wrap.getBoundingClientRect().right
      let hideCount = 0
      for (let i = $tag_list.length-1; i >= 1; i--) {
        const item = $tag_list[i];
        const rect = item.getBoundingClientRect();
        if (rect.right > wrapRight) {
          item.parentNode.classList.add('d-none')
          hideCount++
        } else {
          break
        }
      }
      if (hideCount) {
        $rest.querySelector('.multi_select__tag-text').innerText = `+ ${hideCount}`
          for (let i = 1; i < $tag_list.length; i++) { // 检查是否和$rest重叠
            const item = $tag_list[i];
            if (!item.parentNode.classList.contains('d-none') && item.getBoundingClientRect().right > $rest.getBoundingClientRect().left - 6) {
              item.parentNode.classList.add('d-none')
              hideCount++
              $rest.querySelector('.multi_select__tag-text').innerText = `+ ${hideCount}`
              break
            } else if (item.parentNode.classList.contains('d-none')){
              break
            }
          }
          $rest.classList.remove('d-none')
      } else {
        $rest.classList.add('d-none')
      }
      // 标签换行，更新高度 ------------------------------------------------------------
      // if ($tags_wrap.offsetHeight) {
      //   $input_wrap.style.height = $tags_wrap.offsetHeight + 8 + 'px'
      // } else {
      //   $input_wrap.style.height = ''
      // }
      // popperInstance.update()
    }
  }

  // 根据访客 IP 获取国家信息，并自动匹配设置电话区号
  async _getIpInfo() {
    // 若已有缓存（内存或 sessionStorage），直接应用
    const cached = _cachedAreaCode || sessionStorage.getItem('areaCode')
    if (cached) {
      _cachedAreaCode = cached
      this._applyAreaCode(cached)
      return
    }
    // 若其他组件正在请求（包括获取IP和获取区号），等待其结果即可
    if (_ipInfoPromise) {
      await _ipInfoPromise
      return
    }
    // 将获取IP + 获取区号合并为一个 Promise，防止任何环节重复请求
    _ipInfoPromise = this._fetchAreaCode()
    try {
      const areaCode = await _ipInfoPromise
      if (areaCode) {
        _cachedAreaCode = areaCode
        sessionStorage.setItem('areaCode', areaCode)
        this._applyAreaCode(areaCode)
      }
    } catch (err) {
      console.error('_getIpInfo error:', err)
    }
  }

  // 获取 IP 并请求区号信息，返回匹配到的区号
  async _fetchAreaCode() {
    // 参考 setInquiryRecord 中的 IP 获取方式：先读 sessionStorage，没有则请求 ifconfig.me
    let ip = sessionStorage.getItem('ip')
    if (!ip) {
      try {
        ip = await new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest()
          xhr.timeout = 5000
          xhr.open('GET', 'https://www.ifconfig.me/ip', true)
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              resolve(xhr.responseText)
            } else if (xhr.status !== 200) {
              reject('Error: ' + xhr.status)
            }
          }
          xhr.send()
        })
        sessionStorage.setItem('ip', ip)
      } catch {
        console.log('ip请求失败')
        return null
      }
    }
    const res = await this.utilts.request({
      url: '/visitor/get-ip-info',
      method: 'GET',
      params: {
        ip,
        lang: 'en'
      }
    })
    if (res.code === 0 && res.data && res.data.countryCode) {
      const match = countryPhoneCodes.find(item =>
        item.countryCode && item.countryCode.toUpperCase() === res.data.countryCode.toUpperCase()
      )
      return match ? match.code : '+86'
    }
    return null
  }

  // 将匹配到的区号应用到页面所有电话区号选择器
  _applyAreaCode(areaCode) {
    document.querySelectorAll('.area-code-select').forEach(selectDom => {
      selectDom.value = areaCode
      const display = selectDom.parentElement?.querySelector('.area-code-display')
      if (display) display.textContent = areaCode
    })
  }

  /**
* 初始化询盘
  */
  _initInquiry() {
    window.isInquiry = true
    this._initEvent()
    this._submitInquiryForm()
    this._uploadFileChange()
  }
  _initEvent() {
    // 记录填写记录
    this.$form.querySelectorAll('input').forEach($el => {
      $el.addEventListener('focus', () => {
        if (!this.is_record_input) {
          this.is_record_input = true
          this.utilts.setInquiryRecord('inquiry_start').then(res => console.log(res.msg))
        }
      })
    })
    this.$form.querySelectorAll('input[type="text"],input[type="email"],input[type="tel"]').forEach($el => {
      $el.addEventListener('input', () => { this.checkText($el) })
      $el.addEventListener('blur', () => { $el.value = $el.value.trim() })
    })
    this.$form.querySelectorAll('textarea').forEach($el => {
      $el.addEventListener('focus', () => {
        if (!this.is_record_input) {
          this.is_record_input = true
          this.utilts.setInquiryRecord('inquiry_start').then(res => console.log(res.msg))
        }
      })
      $el.addEventListener('input', () => { this.checkText($el) })
      $el.addEventListener('blur', () => { $el.value = $el.value.trim() })
    })
    /** form email 输入的文字转小写 */
    if (this.$form.querySelectorAll('[type="email"]').length > 0) {
      this.$form.querySelectorAll('[type="email"]').forEach(formItem => {
        formItem.addEventListener('blur', function () {
          this.value = this.value.toLowerCase()
        })
      })
    }
  }

  // 注册form 提交事件
  _submitInquiryForm() {
    this.$form.addEventListener('submit', async (event) => {
      event.preventDefault()
      // 验证表单信息是否合法，不合法不提交
      if (!this._inquirySet(event)) return console.warn('this._inquirySet() return false')
      this.utilts.setBtnLoadingStatus(this.$submit, true)
      // 记录提交记录
      // const data = await this.utilts.setInquiryRecord('inquiry_submit')
      // 设置，获取要保存的表单信息
      const { preset_config, custom_config } = this._inquiryConfig()
      const type = this.utils.urlParams.type
      switch (this.formType) {
        // 产品详情询盘
        case 'product-detail-inquiry': {
          // 获取其它产品详情信息
          const inquire_pro = type === 'quoteList' ? this._inquiryQuoteList() : this._inquiryDetailList()
          // 记录提交记录
          await this.utilts.setInquiryRecord('inquiry_submit', this._getConfigParams(preset_config, custom_config, inquire_pro))
          //提交保存表单
          this._inquiryRequest(preset_config, custom_config, inquire_pro)
          if(type === 'quoteList') {
            localStorage.removeItem('productQuoteList')
            localStorage.removeItem('productQuoteIdList')
          }
          break
        }
        // 普通询盘
        case 'inquiry':
          // 获取其它产品详情信息
          const inquire_pro = type === 'quoteList' ? this._inquiryQuoteList() : this._inquiryDetailList()
          // 记录提交记录
          await this.utilts.setInquiryRecord('inquiry_submit', this._getConfigParams(preset_config, custom_config, inquire_pro))
          //提交保存表单
          this._inquiryRequest(preset_config, custom_config, inquire_pro)
          if(type === 'quoteList') {
            localStorage.removeItem('productQuoteList')
            localStorage.removeItem('productQuoteIdList')
          }
          break
        // 社媒询盘
        case 'socialMedia':
          // 记录提交记录
          await this.utilts.setInquiryRecord('inquiry_submit', this._getConfigParams(preset_config, custom_config, {}))
          //提交保存表单
          this._inquiryRequest(preset_config, custom_config, {})
          break
        // 邮票订阅
        case 'subscription':
          await this.utilts.setInquiryRecord('inquiry_submit', this._getConfigParams(preset_config))
          this._subscriptionsRequest(preset_config)
          break
        default:
          break
      }
    })
  }

  // 检查设置
  _inquirySet(event) {
    event.preventDefault()
    event.stopPropagation()
    this.is_record_submit = true
    // 装修模式下不能保存表单
    if (this.utilts.checkDesign() || !window.isInquiry) return false
    window.isInquiry = false
    setTimeout(function () { window.isInquiry = true }, 2000)
    // this.$form.classList.add('was-validated')
    let success = true
    // 验证表单项
    for (const $formItem of this.$form) {
      // if (!$formItem.checkValidity()) { success = false; break }
      let res = this.checkText($formItem)
      if (!res) { success = false }
    }
    const formData = new FormData(this.$form)
    this.$form.querySelectorAll('.unit-form__checkbox-list[required]').forEach(function(groupNode){
      const name = groupNode.getAttribute('name')
      if (name) {
        const checked = formData.getAll(name)
        if (checked.length) {
          groupNode.classList.remove('is-invalid')
        } else {
          success = false
          groupNode.classList.add('is-invalid')
        }
      }
    })
    this.$form.querySelectorAll('.unit-form__select-box [required]').forEach(function(selectNode){
      const name = selectNode.getAttribute('name')
      if (name) {
        const selectedVal = formData.get(name)
        if (selectedVal) {
          selectNode.classList.remove('is-invalid')
        } else {
          success = false
          selectNode.classList.add('is-invalid')
        }
      }
    })
    // 上传文件验证
    if (this.$file && !this._fileCheck()) success = false
    return success
  }
  checkText($formItem) {
    if (!this.is_record_submit) return true
    let type = $formItem.getAttribute('type')
    let readonly = $formItem.getAttribute('readonly') !== null
    if (readonly) return true
    let checkMap = {  // 校验的输入框类型
      isText: $formItem.nodeName === 'INPUT' && type === 'text',
      isEmail: $formItem.nodeName === 'INPUT' && type === 'email',
      isTel: $formItem.nodeName === 'INPUT' && type === 'tel',
      isTextarea: $formItem.nodeName === 'TEXTAREA',
    }
    let hasValidate = false
    for (const key in checkMap) {
      if (checkMap[key]) {
        hasValidate = true
        break
      }
    }
    if (!hasValidate) return true

    let required = $formItem.getAttribute('required') !== null
    let minlength = required ? (parseInt($formItem.getAttribute('minlength')) || 1) : 0
    let pattern = $formItem.getAttribute('pattern') ? new RegExp($formItem.getAttribute('pattern'), 'ig') : null
    let value = $formItem.value.toString().trim()
    let success = true

    if (pattern && !pattern.test(value)) {
      success = false
    }
    if (checkMap['isText'] || checkMap['isTextarea'] || checkMap['isTel']) {
      if (required && value.length < minlength) {
        success = false
      }
    } else if (checkMap['isEmail'] && !$formItem.checkValidity()) {
      console.log('isEmail');

      success = false
    }
    if (success) {
      $formItem.classList.remove('is-invalid')
      $formItem.classList.add('is-valid')
    } else {
      $formItem.classList.add('is-invalid')
      $formItem.classList.remove('is-valid')
    }

    return success
  }
  // 获取config
  _inquiryConfig() {
    // 获取要保存的信息
    var preset_config = {} //默认的表单项
    var custom_config = [] //自定义的表单项
    var formControls = this.$form.querySelectorAll('.form-control[name]')
    /**
     * @type {{[string]: {custom_config?, multiple_value?}}}
     */
    const formControlsMap = Array.from(formControls).reduce(function (map, elem) {
      const mapKey = elem.getAttribute('name')
      map[mapKey] = Object.assign({}, elem.dataset)
      try {
        if (elem.dataset.custom_config) {
          map[mapKey].custom_config = JSON.parse(elem.dataset.custom_config)
        }
      } catch (e) {

      }
      return map
    }, {})

    const _$form = document.querySelector(`#inquiry-${this.attrId}`)
    const formData = new FormData(_$form)
    const serializeArray = []
    const formNames = Array.from(new Set(formData.keys()))
    for (const fieldName of formNames) {
      if (formControlsMap[fieldName] && formControlsMap[fieldName].multiple_value && formControlsMap[fieldName].multiple_value !== 'false') {
        // multiple value
        serializeArray.push({name: fieldName, value: formData.getAll(fieldName)})
      } else {
        // single value
        serializeArray.push({name: fieldName, value: formData.get(fieldName)})
      }
    }
    // 区分自定义表单元素和系统表单元素
    serializeArray.forEach(function (item, index) {
      const formItemConfig = formControlsMap[item.name]
      const formItemCustomConfig = formItemConfig.custom_config || {}
      const customFromType = formItemCustomConfig.define_type;
      if (Array.isArray(item.value)) {
        if ('multi_image' === customFromType) {
          item.value = item.value.map(function (val, idx) {
            try {
              val = JSON.parse(val)
            } catch (e) {
              console.warn(idx, e)
            }
            return val
          })
          item.value = JSON.stringify(item.value)
        } else {
          item.value = item.value.join(',')
        }
      }
      if (item.name.indexOf('form_') === 0) {
        if (!formItemCustomConfig.define_type) {
          formItemCustomConfig.define_type = 'text'
        }

        custom_config.push(Object.assign(formItemCustomConfig, item, {
          // title: formControls[index].getAttribute('data-title') || formControls[index].placeholder || formControls[index].getAttribute('placeholder')
          title: formControlsMap[item.name].title || _$form.querySelector(`[name="${item.name}"]`)?.getAttribute('placeholder')
        }))

      } else if (typeof item.value !== 'object') {
        preset_config[item.name] = item.value
      }
    })
    // 合并区号和电话号码
    if(preset_config['phone-area-code'] && preset_config['phone']){
      preset_config['phone'] = preset_config['phone-area-code'] + ' ' + preset_config['phone']
    }
    delete preset_config['phone-area-code']
    // 如果有上传文件，添加到自定义config里面
    if (this.file_config.length > 0) {
      custom_config = [...custom_config, ...this.file_config]
    }

    return { preset_config, custom_config }
  }

  // 获取DetailList
  _inquiryDetailList() {
    return window.app.info.productInquireList
      .filter(item => item.selected)
      .map(item => {
        return {
          id: item.content_id,
          page_url: item.href,
          thumb: (item.detail_thumb || '').replace(/&amp;/gi, '&'),
          title: item.detail_title
        }
      })  }

  // 获取多产品询盘列表
  _inquiryQuoteList() {
    return window.app.info.productQuoteList
      .map(item => {
        return {
          id: item.id,
          page_url: item.page_url,
          thumb: item.thumb.replace(/&amp;/gi, '&'),
          title: item.title,
          amount: item.amount
        }
      })
  }

  // 询盘表单提交
  async _inquiryRequest(preset_config, custom_config, inquire_pro) {
    let params = this._getConfigParams(preset_config, custom_config, inquire_pro)
    // 产品搭配的询盘只需提交选中的搭配产品
    let matchProducts = JSON.parse(sessionStorage.getItem('matchProducts') || '[]')
    let mainProduct = JSON.parse(sessionStorage.getItem('mainProduct'))
    if (window.app.info.isMatchProducts && matchProducts && matchProducts.length && mainProduct) {
      params.product_list = matchProducts.map(el => {
        return {
          id: el.product_id,
          page_url: el.page_url,
          thumb: el.thumb_prefix,
          title: el.title
        }
      })
      params.product_list.unshift(mainProduct)
    }
    const utilts = window.app.utilts
    const that = this
    // let flagRetry = false
    const _handleInquiry = async function (captcha, flagRetry) {
      if (captcha) {
        // 腾讯验证
        const captcha_token = await that.utilts.checkTCaptcha('inquiry')
        if (captcha_token) params.token = captcha_token
        else {
          utilts.setBtnLoadingStatus(that.$submit, false)
          return
        }
      }
      const stringify = 1
      const url = '/inquiry/insert'
      const method = 'POST'
      if(sessionStorage.getItem('ip')){
        params.ip = sessionStorage.getItem('ip')
      }
      return utilts.request({stringify, url, method, params})
          .then(res => {
            utilts.recordClientInquiredTimes()
            that.handleInquireSuccess(res, params)
          })
          .catch((res) => {
            if (res && res.code && parseInt(res.code) === 103) {
              // 103 验证码
              if (flagRetry) {
                // 防止无限弹验证码
                throw new Error('retry captcha')
              }
              return _handleInquiry(true, true)
            } else if (res && res.msg) {
              new Modal().warning(res.msg, 'Prompt').open()
            } else {
              new Modal().warning('Unknown error', 'Prompt').open()
            }
            utilts.setBtnLoadingStatus(that.$submit, false)
          })
    }
    let needleCaptcha = false
    const cfgRes = await this.getSiteData()
    if (cfgRes && cfgRes.data && cfgRes.data.tencent_verify_id) {
      // 设置最新的验证码客户端id
      window.app.info.site.tencent_verify_id = cfgRes.data.tencent_verify_id
    }
    if (cfgRes.data && cfgRes.data.site_config) {
      const site_config = cfgRes.data.site_config
      const tencent_verify_id = cfgRes.data.tencent_verify_id
      console.log('tencent_verify_id ~~~~~~~~~', tencent_verify_id)
      const page_type = window.app.info.page.page_type || ''
      const is_landing_page = page_type === 'landing_page'
      const captcha_switch = is_landing_page ? site_config.ads_inquiry_captcha_switch : site_config.inquiry_captcha_switch
      const first_no_check = is_landing_page ? site_config.ads_inquiry_captcha_first_no_check_switch : site_config.inquiry_captcha_first_no_check_switch
      const count = utilts.getClientInquiredTimes()
      needleCaptcha = captcha_switch ? ( first_no_check ? count > 0 : true ) : false
      if (site_config.inquiry_success_redirect_time && !isNaN(site_config.inquiry_success_redirect_time)) {
        sessionStorage.setItem('success_redirect_time', Number(site_config.inquiry_success_redirect_time))
      }
    }
    return _handleInquiry(needleCaptcha, false)
  }

  /**
   * 询盘成功
   * @param res
   * @param {{email?:string}} params
   */
  handleInquireSuccess(res, params) {
    this.$form.dispatchEvent(new CustomEvent('form-inquire:success', {id: this.$form.id}))
    this.utilts.setBtnLoadingStatus(this.$submit, false)
    this.file_config = []
    // 社媒询盘记录, 2:表示询盘成功后回到首页时弹出聊天列表
    if (this.formType === 'socialMedia') this.utilts.setItem('social_status', 2)
    if (this.formType === 'inquiry' || this.formType === 'product-detail-inquiry') {
      this.utilts.setGtag('begin_inquiy')
      const contentId = window.renderInfo && window.renderInfo.page && window.renderInfo.page.content_id || 0
      this.utilts.recordInquiredProduct(contentId)
    }
    sessionStorage.setItem('prev_url', location.pathname)
    window.app.info.user.guest_id = res.data.member_id
    sessionStorage.setItem('prev_inquire_email', (params && params.email) || '')

    const type = this.utils.urlParams.type
    if(type === 'quoteList') {
      sessionStorage.removeItem('prev_url')
    }
    window.location.href = globalThis.Server.getRinseHref('/inquire_success.html', window.app.info.site)
  }

  /**
   * 获取是否开启广告页询盘验证
   * 迁移到 Utilts.getSiteData
   * @deprecated
   * @returns {Promise<unknown>}
   */
  async getSiteData() {
    const params = {
      site_id: window.app.info.site.site_id
    }
    return await this.utilts.request({
      url: '/site/info',
      method: 'get',
      params
    }).then(res => {
      if (res.code == 0) {
        if (window.app.info.page.page_type === 'landing_page') {
          this.is_inquiry_captcha = res.data.ads_inquiry_captcha
        } else {
          this.is_inquiry_captcha = res.data.inquiry_captcha
        }
      }
      return res
    })
  }

  // 邮件订阅提交
  async _subscriptionsRequest(config) {
    const params = {
      site_id: window.app.info.site.site_id,
      terminal: window.app.info.client.terminal_type,
      ip: window.app.info.user.visitor_ip,
      ...config
    }
    // 腾讯验证
    let captcha_token = await this.utilts.checkTCaptcha('inquiry')
    if (captcha_token) params.token = captcha_token
    else {
      this.utilts.setBtnLoadingStatus(this.$submit, false)
      return
    }
    this.utilts.request({
      url: '/member/email-subscribe/subscribe',
      method: 'POST',
      params
    })
      .then(res => {
        window.dispatchEvent(new CustomEvent('email-subscribe:success', {}))
        this.utilts.setBtnLoadingStatus(this.$submit, false)
        new Message().success(this.utilts.$t('The subscription is successful, thank you for your participation'))
      })
      .catch(() => {
        this.utilts.setBtnLoadingStatus(this.$submit, false)
      })
  }

  /** 获取表单要提交的参数 */
  _getConfigParams(preset_config, custom_config, inquire_pro) {
    let params = Object.assign({}, preset_config, {
      custom_config: custom_config,
      site_id: window.app.info.site.site_id,
      visitor_code: window.app.info.user.visitor_code,
      visitor_id: window.app.info.user.visitor_id,
      ip: window.app.info.user.visitor_ip,
      inquiry_record: this.utilts.getDevice(),
      // member_id: window.app.info.user.user_id,
      content_type: window.app.info.source.source_content_type,
      page_url: window.app.info.tempValidPage.href,
      page_type: window.app.info.page.page_type,
      source: window.app.info.source.source_result,
      referrer: window.app.info.source.referrer || '',
      language_code: window.app.info.site.language_code
    })
    // if (
    //   window.app.info.checkProductDetail(window.app.info.page.page_type) ||
    //   window.app.info.checkInquireForm(window.app.info.page.page_type) ||
    //   window.app.info.checkProductLives(window.app.info.page.page_type)
    // ) {
    //   params.product_list = inquire_pro
    // }
    params.product_list = inquire_pro
    if (window.app.info.page.page_type == 'product_detail') {
      let attrs = ``
      let pattern_item = document.querySelectorAll('.unit-detail-pattern__items .unit-detail-pattern__item')
      if (pattern_item && pattern_item.length) {
        pattern_item.forEach(item => {
          let pattern_lable = item.querySelector('.unit-detail-pattern__label')
          let pattern_value = item.querySelector('.unit-detail-pattern__child.active span')
          if (pattern_value) attrs += `${pattern_lable.innerHTML}: ${pattern_value.innerHTML}；`
        })
        attrs = attrs.slice(0, attrs.length - 1)
      }
      if (params.product_list && params.product_list.length) {
        params.product_list.forEach(_val => {
          if (_val.id == window.app.info.productDetail.product_id) {
            _val.attr = attrs
          }
        })
      }
    }
    // 客服询盘参数
    if (this.formType === 'socialMedia') params.type = 4
    return params
  }

  // 绑定上传文件表单事件
  _uploadFileChange() {
    if (!this.$file) { return }
    this.$file.parentNode.parentNode.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() !== 'input') e.preventDefault()
    })
    this.$file.addEventListener('change', async () => {
      if (!this._fileCheck()) return
      this._promiseUpload()
        .then(res => {
          this._removeLoading()
        })
        .catch(err => {
          this._removeLoading()
          console.log(err)
        })
    })
  }

  /** 处理异步上传图片 */
  _promiseUpload() {
    return new Promise(async (resolve, reject) => {
      const formName = this.$file.getAttribute('name')
      const files = this.$file.files
      if (files.length > 0) {
        //腾讯验证必须通过
        // if (!await this.utilts.checkTCaptcha('attach')) {
        //   reject(new Error('verify is error'))
        //   this.clearUploadFile()
        //   return
        // }
        this.utilts.setBtnLoadingStatus(this.$submit, true)
        this.$file.setAttribute('disabled', 'disabled')
        this._showLoading()
        // 上传文件
        this.utilts.uploadFile([...files])
          .then(fileList => {
            this.$file.removeAttribute('disabled')
            let fileArray = []
            // 处理要提交的格式
            fileList.forEach((info, index) => {
              const val = { name: info.name, url: `${info.host}/${info.cname}` }
              fileArray.push(val)
              this._setShowImg(info.size, info.name, index)
            })
            const _file = { name: formName, title: fileList[0].name, value: JSON.stringify(fileArray) }
            this.file_config.push(_file)
            this.$file_box.setAttribute('validated', '')
            fileArray = []
            resolve()
            this.utilts.setBtnLoadingStatus(this.$submit, false)
          })
          .catch(err => reject(err))
      } else {
        resolve()
      }
    })
  }

  /** 清空文件 */
  clearUploadFile() {
    this.$file.value = ''
    this.uploadCheck = false
  }

  /** 检查上传图片合法性 */
  _fileCheck() {
    //如果有图片列表，上传以后添加到promiseAll里面去，因为要处理异步
    const _type_ = ['txt', 'doc', 'docx', 'ppt', 'pptx', 'xlsx', 'xls', 'pdf', 'jpg', 'png', 'bmp', 'gif', 'jpeg', 'rar', 'zip', 'mp4']
    let isTrue = true
    if (this.$file.hasAttribute('required') && !this.$file.value) isTrue = false
    Array.from(this.$file.files).forEach(item => {
      // 限制格式
      const selfFileType = item.name.split('.')[item.name.split('.').length - 1].toLowerCase()
      if (isTrue) isTrue = _type_.includes(selfFileType)
      // 限制大小
      if (isTrue) isTrue = item.size <= 1024 * 1024 * 20
      // 文件名不能大于100
      if (isTrue) isTrue = item.name.length < 100
    })
    if (!isTrue) {
      this.$file.value = ''
      this.$file_box.classList.add('show_error')
      return false
    } else this.$file_box.classList.remove('show_error')
    return true
  }

  /** 设置显示图片 */
  _setShowImg(size, name, index) {
    // 文件大小
    if (size < 1024 * 1024) size = (size / 1024).toFixed(2) + 'KB'
    else size = (size / 1024 / 1024).toFixed(2) + 'MB'
    // 设置显示的html
    const divImg = document.createElement('div')
    divImg.className = 'unit-form__file-item'
    const formFileIndex = `form_file_${index}`
    divImg.id = formFileIndex
    let innerHTML = `<div><span class='iconfont icon-wenjian'></span> ${name}</div>`
    const span = document.createElement('span')
    span.className = 'icon iconfont'
    //删除图片
    span.addEventListener('click', () => {
      this.$file_list.querySelector(`#${formFileIndex}`).remove()
      this.file_config.splice(index, 1)
      this.$file_box.removeAttribute('validated')
      if (this.file_config.length === 0) this.clearUploadFile()
    })
    divImg.innerHTML = innerHTML
    divImg.append(span)
    this.$file_list.append(divImg)
  }

  // 添加上传加载的图片
  _showLoading() {
    const node = this._getLoadingDiv()
    this.$file_list.appendChild(node)
  }

  //  创建上传提示
  _getLoadingDiv() {
    const $div = document.createElement('div')
    $div.innerHTML = this.utilts.$t('uploading') + '...'
    $div.style.cssText = ';color: #908d8d;'
    $div.classList.add('div_loading')
    $div.width = 30
    $div.height = 30
    return $div
  }

  // 删除上传加载的图片
  _removeLoading() {
    const imgLoading = this.$file_list.querySelector('.div_loading')
    if (imgLoading) imgLoading.remove()
  }
}
