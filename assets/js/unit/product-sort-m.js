/**
 * 产品排序组件
 */
class ScriptProductSortMobile extends Script {
	constructor(params) {
		super(params)
		this.$unit = document.querySelector(`#${this.attrId}`)
		if (!this.$unit) return
		this.prefx = 'unit-product-sort-m'
		this.$main = this.$unit.querySelector(`.${this.prefx}__items`)
		if(this.$main) this.$main.innerHTML = ''
		// 排序项
		this.sortName = Utilts.ins().$t('Sort By')
		this.$drop = this.$unit.querySelectorAll('.unit-header-menu__nav__item-drop')
		this.templateType = params.templateType 
		// 排序项
		this.sortList = [
			{ id: 5, name: Utilts.ins().$t('Default'), active: false, sort: 'sort desc,create_time desc' },
			{ id: 1, name: Utilts.ins().$t('Newest'), active: false, sort: 'create_time desc,id desc' },
			{ id: 2, name: Utilts.ins().$t('Lowest Price'), active: false, sort: 'price asc' },
			{ id: 3, name: Utilts.ins().$t('Highest Price'), active: false, sort: 'price desc' },
			{ id: 4, name: Utilts.ins().$t('Hot Sale'), active: false, sort: 'order desc' },
			{ id: 5, name: Utilts.ins().$t('Most Popular'), active: false, sort: 'favorite desc' }
		]
		if(this.templateType==='b2b'){
			this.sortList = [
				{ id: 5, name: Utilts.ins().$t('Default'), active: false, sort: 'sort desc,create_time desc' },
				{ id: 1, name: Utilts.ins().$t('Newest'), active: false, sort: 'create_time desc,id desc' },
			]
		}
		this.$maintwo = this.$unit.querySelectorAll(`.unit-header-menu_right_slide_view .unit-attr-search__items`)
		// this.$maintwo.innerHTML = ''
		const that = this;
		/**
		 * 选中的checkbox
		 * @type {{}}
		 */
		this.checkedAttrs = new Proxy({}, {
		  set(target, p, value) {
			if (value?.id && value?.product_attr_id) {
				that.$maintwo.forEach(a=>{
					var checkboxWrapNode = a.querySelector(`.unit-attr-search__content--checkbox[data-checkbox_uid="${value.product_attr_id}-${value.id}"]`)
			  		checkboxWrapNode && (value.checked ? checkboxWrapNode.classList.add('is_active') : checkboxWrapNode.classList.remove('is_active'))
				})
			}
			return Reflect.set(target, p, value);
		  }
		});
		//搜索项
		this.$mainthree = this.$unit.querySelector('.unit-attr-text-search-right_slide__items')
		this.product_attr_id = ''
		this.showSearchItemName = '--Please Selected--'
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
				if(this.$droupDowm){
					this.$droupDowm.classList.remove('show')
				}
				$content.classList.toggle('show')
			}
			})
		}
	}
	async init() {
		var that = this;
		if(this.$maintwo){
			this.initDropEvent()
			this.initListeners();
		}
		if(this.$mainthree){
			this.createdSearchElement()
			this.initLoadData()
			this.initEvent()
		}
		if(this.$main){
			this.initSort()
			this.initHideElement()
			const sortItems = document.querySelector(`#${this.attrId} .unit-product-sort-m__items`)
			const prefix = this.prefx
			const unitElem = this.$unit
			const sortList = this.sortList
			sortItems.addEventListener('click', function (evt) {
				const clickElem = evt.target
				const elemFilterTextReg = new RegExp(`${prefix}__filter(-text)?\\b(?!-)`, 'i')
				const elemFilterPosiText = new RegExp(`${prefix}__filter-posi(-text)?\\b(?!-)`, 'i')
				if (elemFilterTextReg.test(clickElem.className) || elemFilterTextReg.test(clickElem.parentElement.className)) {
					// 打开下拉排序列表
					evt.stopPropagation()
					const itemSearchFilterBox = unitElem.querySelector(`.${prefix}__filter-text`)
					itemSearchFilterBox && itemSearchFilterBox.classList.toggle('is_active')
				} else if (clickElem instanceof HTMLParagraphElement && elemFilterPosiText.test(clickElem.parentElement.className)) {
					// 排序下拉列表选中元素点击
					evt.stopPropagation()
					const list = Array.prototype.filter.call(clickElem.parentElement.children, function (node) {
						return node instanceof HTMLParagraphElement
					})
					const idx = list.indexOf(clickElem)
					list.forEach(function (elem) {
						elem === clickElem ? (elem.classList.add('is_active')) : (elem.classList.remove('is_active'))
					})
					if (idx > -1 && sortList[idx]) {
						const filter = sortList[idx]
						window.app.info.product_sort = filter.sort
						if (window.app.info && window.app.info.renderListView) {
							window.app.info.renderListView()
						}
					}
					const itemSearchFilterBox = unitElem.querySelector(`.${prefix}__filter-text`)
					itemSearchFilterBox.classList.toggle('is_active')
					itemSearchFilterBox.firstChild.innerText = clickElem.innerText
				}
			})
			document.querySelector('body').addEventListener('touchmove', () => {
				const itemSearchFilterBox = unitElem.querySelector(`.${prefix}__filter-text`)
				itemSearchFilterBox && itemSearchFilterBox.classList.remove('is_active')
			})
		}
		var rightSlideView = document.querySelector(`.unit-header-menu_right_slide_view`);
		var filterBtn = document.querySelector(`.unit-product-sort__filter_btn`)
		if(filterBtn){
			filterBtn.addEventListener('click', function (evt) {
				console.log(document.getElementById('app'))
				if(document.getElementById('app').querySelectorAll('.unit-header-menu_right_slide_view').length>0){
					rightSlideView.remove()
					document.getElementById('app').appendChild(rightSlideView)
				}
				rightSlideView.style.display = 'block'
				document.body.style.overflow = 'hidden'
			})
			var rightSlideClose = document.querySelectorAll(`.unit-header_right_slide-close`)
			rightSlideClose.forEach(a=>{
				a.addEventListener('click', function (evt) {
					rightSlideView.style.display = 'none'
					document.body.style.overflow = 'auto'
					setTimeout(()=>{
						document.documentElement.scrollTop=0
					},200)
				})
			})
			var rightSlideDeselect = document.querySelector(`.unit-header_right_slide-deselect`)
			rightSlideDeselect.addEventListener('click', function (evt) {
				that.initListeners(true)
				that.$input.value = ''
				that.searchData()
			})
		}
	}
	initListeners(flat) {
		const that = this;
		this.$maintwo.forEach(a=>{
			if(flat){
					var checkboxList =  a.querySelectorAll('.unit-attr-search__content--checkbox');
					checkboxList.forEach(i=>{
						i.classList.remove('is_active')
						var checkbox = i.querySelector('input[type="checkbox"]')
						var checked = false
						const checkboxInputType = parseInt(checkbox.getAttribute('data-input_type'));
						const checkboxGroup = parseInt(checkbox.getAttribute('data-product_attr_id'));
						const checkboxAttr = checkbox.getAttribute('data-attr_param') || 'attr';  // 属性参数
						const checkboxDataId = parseInt(checkbox.getAttribute('data-id'));
						that.checkedAttrs[checkbox.value] = {
							product_attr_id: checkboxGroup,
							attr: checkboxAttr,
							id: parseInt(checkbox.getAttribute('data-id')),
							input_type: checkboxInputType, // 单选/多选
							content: checkbox.getAttribute('data-content'),
							checked
						};
						// 显示隐藏
						if (a.classList?.contains('icon-action-left-lighter')) {
							evt.stopPropagation();
							const hide_cls = 'unit-attr-search__content--hide';
							a.classList.toggle('up');
							a.parentNode.parentNode.querySelector('.unit-attr-search__content')?.classList?.toggle(hide_cls)
						}
					})
			}else{
				a.addEventListener('click', (evt) => {
					console.log(evt.target)
					const el = evt.target;
					if(this.$droupDowm){
						this.$droupDowm.classList.remove('show')
					}
					// 属性筛选
					if (el.classList?.contains('unit-attr-search__content--checkbox') || el.parentNode.classList?.contains('unit-attr-search__content--checkbox')) {
						evt.stopPropagation();
						const pointer = evt.target.classList.contains('unit-attr-search__content--checkbox') ? evt.target : evt.target.parentNode;
						const checkbox = pointer.querySelector('input[type="checkbox"]');
						const checked = !(that.checkedAttrs[checkbox.value]?.checked);
						const checkboxInputType = parseInt(checkbox.getAttribute('data-input_type'));
						const checkboxGroup = parseInt(checkbox.getAttribute('data-product_attr_id'));
						const checkboxAttr = checkbox.getAttribute('data-attr_param') || 'attr';  // 属性参数
						const checkboxDataId = parseInt(checkbox.getAttribute('data-id'));
						that.checkedAttrs[checkbox.value] = {
							product_attr_id: checkboxGroup,
							attr: checkboxAttr,
							id: parseInt(checkbox.getAttribute('data-id')),
							input_type: checkboxInputType, // 单选/多选
							content: checkbox.getAttribute('data-content'),
							checked
						};
						if (checkboxInputType === 2 && checked) {
							// 单选 取消同分组下的其他checkbox选中状态
							for (let k in that.checkedAttrs) {
								const attr = that.checkedAttrs[k];
								if (attr.product_attr_id === checkboxGroup && attr.checked && attr.id !== checkboxDataId) {
									attr.checked = false;
									that.checkedAttrs[k] = attr;
								}
							}
						}
						/**
						 * @type {{[string]?: {product_attr_id: number, content: string[]}}}
						 */
						const attr_params = {};
						const checkedBoxes = Object.values(that.checkedAttrs).filter(box => box?.checked && box.attr === 'attr');
						[...new Set(checkedBoxes.map(box => box.product_attr_id))].forEach(group => attr_params[group] = {
						product_attr_id: parseInt(group),
						content: []
						});
						checkedBoxes.forEach(box => attr_params[box.product_attr_id]?.content?.push(box.content));
						window.app.info.attr_params = Object.values(attr_params);
						const attr_detail_id = Object.values(that.checkedAttrs).filter(box => box?.checked && box.attr === 'attr_detail_id').map(box => parseInt(box.id))
						window.app.info.attr_detail_id = Array.from(new Set(attr_detail_id))
						// const detailAttr
						window.app.info.renderListView();
					}
					// 显示隐藏
					if (el.classList?.contains('icon-action-left-lighter')) {
						evt.stopPropagation();
						const hide_cls = 'unit-attr-search__content--hide';
						el.classList.toggle('up');
						el.parentNode.parentNode.querySelector('.unit-attr-search__content')?.classList?.toggle(hide_cls)
					}
			
				});
			}
		})
		if(flat){
			const attr_params = {};
			const checkedBoxes = Object.values(that.checkedAttrs).filter(box => box?.checked && box.attr === 'attr');
			[...new Set(checkedBoxes.map(box => box.product_attr_id))].forEach(group => attr_params[group] = {
			product_attr_id: parseInt(group),
			content: []
			});
			checkedBoxes.forEach(box => attr_params[box.product_attr_id]?.content?.push(box.content));
			window.app.info.attr_params = Object.values(attr_params);
			const attr_detail_id = Object.values(that.checkedAttrs).filter(box => box?.checked && box.attr === 'attr_detail_id').map(box => parseInt(box.id))
			window.app.info.attr_detail_id = Array.from(new Set(attr_detail_id))
			// const detailAttr
			window.app.info.renderListView();
		}
	}
	// 点击页面空白，折叠已展开栏目
	initHideElement() {
		document.querySelector('body').addEventListener('click', () => {
			this.$itemSearchFilterBox.classList.remove('is_active')
		})
	}

	initSort() {
		this.$main.innerHTML = ''
		this.$main.append(this.getSortListElement())
	}

	h(tag, props, text) {
		const $item = document.createElement(tag)
		for (const key in props) {
			if (Object.hasOwnProperty.call(props, key)) {
				const element = props[key];
				if (key === 'class') {
					if (Array.isArray(element)) $item.classList.add(...element)
					else $item.classList.add(element)
				}
				else $item.setAttribute(key, element)
			}
		}
		if (text) $item.innerHTML = text
		return $item
	}
	/**
	* 获取排序项 
	* @param {Object} data 排序信息 
	* @returns 
	*/
	getSortListElement() {
		const $itemBox = this.h('div', { class: `${this.prefx}__filter` })
		this.$itemSearchFilterBox = this.h('div', { class: `${this.prefx}__filter-text` })
		const $span = this.h('span', {}, this.sortName)
		this.$itemSearchFilterBox.append($span)
		const $icon = this.h('span', { class: ['iconfont', 'icon-action-bottom-lighter', 'ml-1'] })
		this.$itemSearchFilterBox.append($icon)
		$itemBox.append(this.$itemSearchFilterBox)

		const $filterPosiBox = this.h('div', { class: `${this.prefx}__filter-posi` })

		const attr = { class: [`${this.prefx}__filter-posi-text`, `${this.prefx}__sanjiao`, `${this.prefx}__isChoose`] }
		const $filterPosiBoxText = this.h('div', attr)

		this.sortList.forEach((data, index) => {
			const $pItem = this.h('p', {}, data.name)
			if (data.active) $pItem.classList.add('is_active')
			$filterPosiBoxText.append($pItem)
		})
		$filterPosiBox.append($filterPosiBoxText)
		this.$itemSearchFilterBox.append($filterPosiBox)
		return $itemBox
	}
	// 搜索框~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	createdSearchElement() {
		// 清空旧的数据
		this.$mainthree.innerHTML = ''
		// 创建divBox
		const $searchBox = document.createElement('div')
		$searchBox.classList.add('input-group-right_slide')

		const $inputGroup = document.createElement('div')
		$inputGroup.classList.add('input-group-prepend-right_slide')
		// 创建下拉属性项
		this.$button = null
		this.$button = document.createElement('button')
		this.$button.classList.add('btn', 'btn-outline-secondary-right_slide')
		const html = `<span class="btn-text text-truncate"> ${this.showSearchItemName} </span>
			<span class="iconfont icon-action-bottom-lighter ml-1"></span>`
		this.$button.innerHTML = html
		$inputGroup.append(this.$button)

		// 创建搜索文本项
		this.$droupDowm = document.createElement('div')
		this.$droupDowm.classList.add('dropdown-menu-right_slide')
		$inputGroup.append(this.$droupDowm)

		this.$input = null
		this.$input = document.createElement('input')
		this.$input.classList.add('form-control-right_slide')
		$inputGroup.append(this.$input)
		// 创建搜索图标
		this.$incofont = null
		this.$incofont = document.createElement('span')
		this.$incofont.classList.add('iconfont', 'icon-action-search-lighter', 'btnSearch')

		$searchBox.append($inputGroup)
		$searchBox.append(this.$input)
		$searchBox.append(this.$incofont)
		this.$mainthree.append($searchBox)
	}
	async initLoadData() {
		this.$droupDowm.innerHTML = ''
		const params = { site_id: window.app.info.site.site_id, type: '1,2,3', status: 1, is_show: 1, language_code: window.app.info.site.language_code }
		const url = '/product-attr/list-page'
		const res = await this.utilts.request({ url, method: 'GET', params })
		var resList = res.data.list || [];
		var list = resList.filter(p => p.input_type === 1 && p.status && p.is_show)
		list = list.map((p, i) => ({ id: p.id, name: p.sign || `name${i}`, type: p.input_type }))
		if (list.length > 0){
			this.product_attr_id = list[0].id
			for (const item of list) {
				const $item = document.createElement('div')
				$item.classList.add('dropdown-item')
				$item.setAttribute('data-id', item.id)
				$item.setAttribute('href', '#')
				$item.innerText = item.name
				this.$droupDowm.append($item)
				$item.onclick = () => {
					this.sibling($item).forEach(a=>{
						a.classList.remove('is_active')
					})
					$item.classList.add('is_active')
					this.product_attr_id = item.id
					const $btnText = this.$button.querySelector('.btn-text')
					$btnText.innerText = item.name
					this.$droupDowm.classList.toggle('show')
				}
			}
		} else {
			const tip = window.app.utilts.$t('no data')
			this.$droupDowm.innerHTML = `<div class='dropdown-item' style='color:grey;text-align:center;'>${tip}<div>`
		} 
	}
	sibling(elem) {
		var r = [];
		var n = elem.parentNode.firstChild;
		for(; n; n = n.nextSibling) {
			if(n.nodeType === 1 && n !== elem) {
				r.push(n);
			}
		}
		return r;
	}
	initEvent() {
		// 下拉属性名改变事件
		this.$button.addEventListener('click', (event) => {
			event.stopPropagation()
			this.$droupDowm.classList.toggle('show')
		})

		// 搜索图标点击查找事件
		this.$incofont.addEventListener('click', (event) => {
			event.stopPropagation()
			this.searchData()
		})

		// 回车跳转
		this.$input.addEventListener('keydown', (event) => {
			event = event || window.event;
			event.stopPropagation()
			if (event.keyCode === 13) this.searchData()
		})

		// 点击页面空白，折叠已展开栏目
		document.querySelector('body').addEventListener('touchmove', () => {
			this.$droupDowm.classList.remove('show')
		})
	}
		/**
	 * 搜索数据
	 */
	searchData() {
		window.app.info.pagination.page_number = 1
		const content = this.$input.value
		this.setAttrParams(content)
		window.app.info.renderListView()
		const product_list_el= this.$unit.parentNode.parentNode.parentNode.querySelector('[package-unit-type="product-list"]')
		const list_el = this.$unit.parentNode.parentNode.parentNode.querySelector('[package-unit-type="list"]')
		if (!list_el && !product_list_el) return
		if(list_el) {
			list_el.parentNode.parentNode.style.overflow = 'auto'
			window.scrollTo({ top: list_el.getBoundingClientRect().top - 85})
		}
		if(product_list_el) window.scrollTo({ behavior: 'smooth', top: product_list_el.getBoundingClientRect().top - 85})
	}

	/**
	 * 设置全局attr_params参数
	 * @param {string} content 查找的内容 
	 * @returns 
	 */
	setAttrParams(content) {
		// 如果没有内容,删除存在的
		let attrs = window.app.info.attr_params
		if (!content) {
			// 清空文本查找项
			if (attrs.length > 0) {
				window.app.info.attr_params = attrs.filter(p => typeof p.content !== 'string')
			}
			return
		}
		// 如果当前属性查找参数为空，添加一条数组记录
		const params = { product_attr_id: this.product_attr_id, content }
		if (attrs.length === 0) window.app.info.attr_params = [params]
		else {
			// 是否有文本查找项
			const attrInfo = attrs.find(p => typeof p.content === 'string')
			if (attrInfo) {
				attrInfo.product_attr_id = this.product_attr_id
				attrInfo.content = content
			}
			else window.app.info.attr_params.push(params)
		}
	}

	/** 
	 * 获取产品属性参数
	 */
}
