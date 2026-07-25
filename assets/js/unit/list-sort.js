class ScriptListSort extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.attrIdBym = `${this.attrId}_by-m`;
    this.$link = this.$dom.querySelectorAll('.unit-list-sort__menu-icon')
    this.$title = this.$dom.querySelectorAll('.unit-list-sort__title')
    this.type = params.type
    this.isCustomer = params.column !== ''
    this.$mobOverlay = null
		this.foldMethod = params.foldMethod
    console.log('this.foldMethod', this.foldMethod);
		this.mySwiper = null; // 保存 Swiper 实例的引用
    this.$subNavBox = this.$dom.querySelector('.unit-list-sort__subcontent')
    this.$navBox = this.$dom.querySelector('.unit-list-sort')
		this.config = params.config ? JSON.parse(this.utilts.htmlDecode(params.config)) : {column_type: 1, column_style: 1}
    this.$flatSubmenu = this.$dom.querySelector('.unit-list-sort__subcontent-flat')
    this.$submenuCover = this.$dom.querySelector('.navigation-submenu__cover')
  }
  async init() {
    this._initEvent()
    this._initMSortEvent()
  }
  /** 初始化事件绑定 */
  _initEvent() {
    if (Number(this.type) === 3) {
      this.$dom.querySelector('.unit-list-sort').style.setProperty('--width', this.$dom.querySelector('.unit-list-sort').offsetWidth + 'px');
		  let attrId = this.attrId
      if (this.config.column_type === 1) {
        this.mySwiper = new Swiper(`#${attrId} .swiper-container`, {
          speed: 1000,
          slidesPerView: 'auto',
          navigation: {
            nextEl: `#${attrId} .next`,
            prevEl: `#${attrId} .prev`,
          },
          on: {
            sliderMove: () => {
              if (this.config.column_style === 1) {
                this.$subNavBox.classList.remove('show')
              }
            }
          }
        })
        if (this.$dom.querySelector(`[aria-disabled="false"]`)) {
          this.$dom.querySelector('.unit-list-sort__menu').style.justifyContent = 'unset'
        } else {
          this.$dom.querySelector('.unit-list-sort__menu').justifyContent = ''
        }
      }
      const sortItems = this.$dom.querySelectorAll('.swiper-slide')
      for (let $el of sortItems) {
        $el.addEventListener('mouseenter', () => {
          if (this.config.column_style === 2) {
            const menuId = $el.getAttribute('id')
            const currentWrapper = this.$flatSubmenu.querySelector(`.list-sort-flat_wrapper.container-${menuId}`)
            if (!currentWrapper) return
            if (this.$submenuCover) {
              const $content = $el.children[1]
              if (!$content) {
                this.$flatSubmenu.style.height = '0px'
                this.$submenuCover.classList.remove('navigation-submenu__cover-show')
              } else {
                // const currentEleStyle = window.getComputedStyle(this.$navBox)
                // const borderBottomVal = currentEleStyle.borderBottomStyle !== 'none' && currentEleStyle.borderBottomWidth || '0px'
                this.$submenuCover.classList.add('navigation-submenu__cover-show')
                const elRect = $el.getBoundingClientRect()
                this.$submenuCover.style.top = elRect.bottom + 'px'
                this.$flatSubmenu.style.position = 'fixed'
                this.$flatSubmenu.style.top = elRect.bottom + 'px'
                const maxHeightVal = window.innerHeight - elRect.bottom
                if (currentWrapper.offsetHeight <= maxHeightVal) {
                  this.$flatSubmenu.style.height = currentWrapper.offsetHeight + 'px'
                  this.$flatSubmenu.style['overflow-y'] = 'hidden'
                } else {
                  this.$flatSubmenu.style.height = maxHeightVal + 'px'
                  this.$flatSubmenu.style['overflow-y'] = 'auto'
                }
              }
            }
            const allWrapper = this.$flatSubmenu.querySelectorAll('.list-sort-flat_wrapper')
            allWrapper.forEach(val => {
              val.classList.remove('submenu-wrapper-show')
            })
            this.$flatSubmenu.classList.add('navigation-submenu-open')
            currentWrapper.classList.add('submenu-wrapper-show')
            currentWrapper.style.width = this.$navBox.offsetWidth + 'px'
            currentWrapper.style.left = this.$navBox.getBoundingClientRect().left + 'px'
          } else {
            this.$subNavBox.classList.remove('show')
            const $content = $el.children[1]
            this.$subNavBox.innerHTML = $content ? $content.innerHTML : ''
            if ($content) {
              this.$subNavBox.classList.add('show')
              this.setSecondPosition(this.$subNavBox, $el)
              let domRect = this.$dom.getBoundingClientRect()
              let elRect = $el.getBoundingClientRect()
              this.$subNavBox.style.top = (elRect.top - domRect.top + elRect.height) + 'px'
            }
          }
          replaceZindex('set')
        })
      }
      const hideSubmenu = () => {
        if (this.$submenuCover) {
          this.$submenuCover.classList.remove('navigation-submenu__cover-show')
          this.$submenuCover.style.removeProperty('top')
          this.$submenuCover.style.removeProperty('position')
        }
        this.$flatSubmenu.classList.remove('navigation-submenu-open')
        this.$flatSubmenu.style.height = '0px'
        const allWrapper = this.$flatSubmenu.querySelectorAll('.list-sort-flat_wrapper')
        allWrapper.forEach(val => {
          val.classList.remove('submenu-wrapper-show')
        })
        replaceZindex()
      }
      const replaceZindex = (attr) => {
        if (attr) this.$dom.style.zIndex = 99
        else this.$dom.style.removeProperty('z-index')
        const currentCell = this.utilts.getParents(this.$navBox, { attrName: 'package-item', attrValue: 'cell' })[0]
        if (currentCell) {
          if (attr) currentCell.style.zIndex = 99
          else currentCell.style.removeProperty('z-index')
          if (attr) currentCell.style.position = 'relative'
          else currentCell.style.removeProperty('position')
        }
        const currentGrid = this.utilts.getParents(this.$navBox, { attrName: 'package-item', attrValue: 'grid' })[0]
        if (currentGrid) {
          if (attr) currentGrid.style.zIndex = 99
          else currentGrid.style.removeProperty('z-index')
          if (attr) currentGrid.style.position = 'relative'
          else currentGrid.style.removeProperty('position')
        }
        const currentModule = this.utilts.getParents(this.$navBox, { attrName: 'package-item', attrValue: 'module' })[0]
        if (currentModule) {
          if (attr) currentModule.style.zIndex = 99
          else currentModule.style.removeProperty('z-index')
          if (attr) currentModule.style.position = 'relative'
          else currentModule.style.removeProperty('position')
        }
        const currentBlock = this.utilts.getParents(this.$navBox, { attrName: 'package-item', attrValue: 'block' })[0]
        if (currentBlock) {
          if (attr) currentBlock.style.zIndex = 99
          else currentBlock.style.removeProperty('z-index')
          if (attr) currentBlock.style.position = 'relative'
          else currentBlock.style.removeProperty('position')
        }
      }
      this.$dom.addEventListener('mouseleave', () => {
        if (this.config.column_style === 2) {
          hideSubmenu()
        } else {
          this.$subNavBox.classList.remove('show')
          this.$subNavBox.style.left = '0px'
          replaceZindex()
        }
      })
      if (this.config.column_style === 2) {
        window.addEventListener('scroll', () => {
          if (this.$flatSubmenu.classList.contains('navigation-submenu-open')) {
            hideSubmenu()
          }
        })
      } else {
        if (this.$dom.querySelector('.prev')) {
          this.$dom.querySelector('.prev').addEventListener('click', () => {
            this.$subNavBox.classList.remove('show')
            replaceZindex()
          })
        }
        if (this.$dom.querySelector('.next')) {
          this.$dom.querySelector('.next').addEventListener('click', () => {
            this.$subNavBox.classList.remove('show')
            replaceZindex()
          })
        }
      }
    }
    if (Number(this.type) === 2) {
      const parentCell = this.$dom.parentNode
      // if (parentCell) parentCell.style.zIndex = 8
      // 产品列表存在属性 unit-attr-text-search__items 引起层级问题
      if (parentCell) {
        parentCell.style.zIndex = 8
        const cellAllstyle = window.getComputedStyle(parentCell)
        if (cellAllstyle.position === 'static') {
          parentCell.style.position = 'relative'
          if (this.utilts.checkDesign()) {
            parentCell.parentNode.style.zIndex = 8
          }
        }
      }

      const $grateson = this.$dom.querySelectorAll('.unit-list-sort__grateson')
      if ($grateson && Object.keys($grateson).length > 0) {
        const domstyle = window.getComputedStyle(this.$dom, null)
        for (const $i of $grateson) {
          $i.style.backgroundColor = domstyle['backgroundColor'];
          // if (domstyle['border'] !== '0px') {
          //   $i.style.right = 'calc(-100% - ' + domstyle['borderBlockWidth'] + ')'
          // }
        }
      }
      let sortMenuItemEles = this.$dom.querySelectorAll('.unit-list-sort__son>.unit-list-sort__menu-item')
      // Array.from(sortMenuItemEles).forEach((_val, index) => {
      //   if (index == 0 && _val.className.includes('active')) {
      //     _val.children[1]?.children[0].classList.add('active')
      //   }
      // })
      let hasActive = Array.from(sortMenuItemEles).some(el => {
        return el.classList.contains('active')
      })
      if (!hasActive && sortMenuItemEles.length) {
        sortMenuItemEles[0]?.classList.add('active')
      }
    }
    if (this.foldMethod !== '') {
      let sortMenuItemEles = this.$dom.querySelector('.unit-list-sort__menu').children
      Array.from(sortMenuItemEles).forEach((_val, index) => {
        _val.classList.remove('active')
        if (this.foldMethod == 1 && index === 0) {
          _val.classList.add('active')
        }
        if (this.foldMethod == 2) {
          _val.classList.add('active')
        }
      })
      // 全部展开时，递归展开所有有子菜单的节点
      if (this.foldMethod == 2) {
        // 找到所有有子菜单的菜单项（有 .unit-list-sort__menu-content 子元素）
        const allMenuItemsWithChildren = this.$dom.querySelectorAll('.unit-list-sort__menu-item')
        allMenuItemsWithChildren.forEach(menuItem => {
          const hasChildren = Array.from(menuItem.children).some(child =>
            child.classList.contains('unit-list-sort__menu-content')
          )
          if (hasChildren) {
            menuItem.classList.add('active')
            // console.log('menuItem', menuItem)

            const $Grateson = Array.from(menuItem.children).find(child =>
              child.classList.contains('unit-list-sort__grateson')
            )
            if ($Grateson) {
              // console.log('$Grateson',$Grateson)
              $Grateson.classList.add('expend-all')
            }
          }

        })
      }
    }

    if (!this.utilts.checkDesign()) {
      if (Object.keys(this.$title).length > 0) {
        for (const $li of this.$title) {
          $li.addEventListener('click', (e) => {
            location.href = $li.parentNode.parentNode.href;
          })
        }
      }
    }
    if (Number(this.type) !== 3) {
      for (const $li of this.$link) {
        $li.addEventListener('click', (e) => {
          if (e.target.className) {
            e.preventDefault()
            const parentNodes = $li.parentNode.parentNode.parentNode
            const brother = this.utilts.getSiblings(parentNodes)
            parentNodes.classList.toggle('active')
            if (Number(this.type) === 1 && (this.foldMethod != 2 || (this.foldMethod == 2 && parentNodes.parentNode?.classList.contains('unit-list-sort__menu-content')))) {
              for (let $el of brother) $el.classList.remove('active')
            }
            if (Number(this.type) === 2) {
              for (let $el of brother) $el.classList.remove('active')
              const $activeList = $li.parentNode.parentNode.parentNode.querySelectorAll('.active')
              $activeList.forEach(item => item.classList.remove('active'))
              // this.$unitList = this.$dom.querySelectorAll('.unit-list-sort__menu-item')
              // for (let $el of this.$unitList) $el.classList.remove('current');
              // parentNodes.classList.add('current')
            }
          }
        })
      }
    }
  }
  setSecondPosition($target, $parent) {
    const pLeft = this.utilts.getOffset($parent).left
    const boxLeft = this.utilts.getOffset(this.$navBox).left
    if (pLeft < 0) {
      $target.style.left = 0 + 'px'
    } else if (pLeft + 250 > window.innerWidth) {
      $target.style.left = (pLeft + $parent.offsetWidth - boxLeft - $target.offsetWidth) + 'px'
    } else {
      $target.style.left = (pLeft - boxLeft) + 'px'
    }
    if (Number(this.type) === 3) {
      $target.style.left = `calc(${$target.style.left} + ${window.getComputedStyle(this.$dom)['paddingLeft']})`
    }
    $target.style.width = 'auto'
  }
  setLevelNavTree(item, level = 0) {
    if (!item) return []
    const sonNav = []
    const sonMenuEles = item.children
    level = ++level
    Array.from(sonMenuEles).forEach(_val => {
      const menuLinkEle = _val.children[0]
      const menuItemContent = _val.children[1]
      const menuText = menuLinkEle.querySelector('.unit-list-sort__title').innerText
      sonNav.push({
        title: menuText,
        href: menuLinkEle.href,
        level,
        is_active: _val.classList.contains("active") || _val.classList.contains("fill-active"),
        is_current: menuLinkEle.children[0].classList.contains("unit-list-sort__link-current"),
        children: menuItemContent ? this.setLevelNavTree(menuItemContent, level) : []
      })
    })
    return sonNav
  }
  setMenuOverlay() {
    if (!document.querySelector('.mobile_menu_overlay')) {
      const $overlay = document.createElement('div')
      $overlay.classList.add('mobile_menu_overlay')
      document.body.append($overlay)
    }
    document.querySelector('.mobile_menu_overlay').style.position = 'fixed'
    this.$mobOverlay = document.querySelector('.mobile_menu_overlay')
  }
  setTreeHtml(data) {
    let levelObj = {
      1: 'first',
      2: 'second',
      3: 'third',
      4: 'fourth'
    }
    let str = ``
    str += `
      ${data.map(item => {
      return `
          <div class="${levelObj[this.isCustomer ? item.level : item.level - 1]}-item sort-menu-content_item ${item.is_active ? 'active' : ''}">
            <a href="${item.href}" class="unit-sort-menu_link ${item.is_current ? 'current-link' : ''}">
              <div class="sort-menu-name_box"><span class="unit-sort-menu_name follow-font-family" text-style="3">${item.title}</span></div>
              ${item.children.length ? `<span class="unit-sort-menu_drop iconfont icon-action-left-lighter"></span>` : ''}
            </a>
            ${item.children.length ? `
              <div class="sort-menu-${levelObj[this.isCustomer ? item.level + 1 : item.level]}_item-content sort-menu-content ${item.is_active ? 'show' : ''}">
                ${this.setTreeHtml(item.children)}
              </div>
            ` : ''}
          </div>`
    }).join('')
      }
    `
    return str
  }
  setSonContent(contentArr, isShowFirst) {
    let str = ``
    if (contentArr && contentArr.length) {
      str += `
        <div class="sort-menu-${isShowFirst ? 'first' : 'second'}_item-content sort-menu-content ${!isShowFirst ? 'hidden-first-content' : ''}">
          ${this.setTreeHtml(isShowFirst ? contentArr : contentArr[0].children, isShowFirst ? true : false)}
        </div>
      `
    }
    return str
  }
  _initMSortEvent() {
    let allSortMenuEle = this.$dom.querySelector('[package-unit-type="list_sort"]:not([hide-phone]) .unit-list-sort__menu')
    if (!allSortMenuEle) return
    const cSortMenuByM = document.querySelector(`#${this.attrIdBym}`);
    if (!cSortMenuByM) {
      return;
    }
    if (this.utilts.checkDesign()) {
      const $header = document.querySelector('[package-item="block"][package-type="header"]');
      const cSortMenuByM = this.$dom.querySelector(`#${this.attrIdBym}`);
      if (!cSortMenuByM) return
      // 更新dom
      $header?.querySelector(`#${this.attrIdBym}`)?.remove();
      cSortMenuByM.classList.add('only-pc-design')
      $header?.appendChild(cSortMenuByM)
      return
    }
    if (cSortMenuByM.hasAttribute('data-rendered')) {
      return;
    } else {
      cSortMenuByM.setAttribute('data-rendered', '');
    }
    let menuArr = []
    try {
      const script = cSortMenuByM.querySelector(`script[data-id="${this.attrIdBym}"]`);
      const menuData = script?.innerText;
      if (menuData) {
        menuArr = JSON.parse(menuData)
      }
    } catch (e) {
      console.error(e)
    }
    // menuArr = this.setLevelNavTree(allSortMenuEle);
    // 不展示一级
    // if (!this.isCustomer) menuArr = menuArr.reduce((prev, next) => prev.concat(next.children), [])
    // console.log(' menuArr', menuArr);
    if (!menuArr.length) return;
    // alert(JSON.stringify(menuArr))
    // if (document.querySelector('.unit-sort-menu_by-m')) return
    // if (!document.querySelector('.unit-sort-menu_by-m')) {
    //   cSortMenuByM = document.createElement('div')
    //   cSortMenuByM.classList.add('unit-sort-menu_by-m')
    // }
    let sonContentStr = ``
    // let menuStr =
    //   `<div class="unit-sort-menu_body">
    //     <div>
    //       <div class="unit-sort-menu_list">
    //         ${menuArr.map((_val, index) => {
    //     return `
    //       <div class="unit-sort-menu_item">
    //         <a href="${_val.href}" data-index="${index}">
    //           <span>${_val.title}</span>
    //           ${_val.children.length ? `<span class="iconfont-box iconfont icon-action-bottom-lighter"></span>` : ''}
    //         </a>
    //       </div>
    //   `
    //   }).join('')}
    //       </div>
    //       <div class="menu-show-icon">
    //         <span class="iconfont-box iconfont icon-base-list"></span>
    //       </div>
    //     </div>
    //     <div class="unit-sort-menu_content-box sort-menu-content_item active">
    //       ${sonContentStr}
    //     </div>
    //   </div>
    //   <div class="unit-sort-menu_line"></div>
    // `;
    // cSortMenuByM.innerHTML = menuStr;
    // document.querySelector('[package-type="header"]')?.appendChild(cSortMenuByM)
    cSortMenuByM.addEventListener('click', (e) => {
      const fMenuSortBody = this.utilts.getParentsByAttr(e.target, 'class', 'unit-sort-menu_body')[0]
      const fMenuSortContent = fMenuSortBody.querySelector('.unit-sort-menu_content-box')
      if (e.target.className.includes('iconfont-box') || e.target.className.includes('menu-show-icon')) {
        e.preventDefault()
        let isFlag = true
        if (e.target.className.includes('menu-show-icon') || e.target.className.includes('icon-base-list')) {
          Array.from(fMenuSortBody.querySelectorAll('.unit-sort-menu_list .unit-sort-menu_item')).forEach(_val => _val.classList.remove('active'))
          if (e.target.className.includes('menu-show-icon')) {
            if (e.target.className.includes('active')) {
              fMenuSortContent.classList.remove('show')
              fMenuSortContent.children[0].classList.remove('show')
              if (this.$mobOverlay) this.$mobOverlay.style.display = 'none'
              e.target.classList.remove('active')
              isFlag = false
            } else {
              e.target.classList.add('active')
            }
          }
          if (e.target.className.includes('icon-base-list')) {
            if (e.target.parentNode.className.includes('active')) {
              fMenuSortContent.classList.remove('show')
              fMenuSortContent.children[0].classList.remove('show')
              if (this.$mobOverlay) this.$mobOverlay.style.display = 'none'
              e.target.parentNode.classList.remove('active')
              isFlag = false
            } else {
              e.target.parentNode.classList.add('active')
            }
          }
          if (isFlag) sonContentStr = this.setSonContent(menuArr, true)
        }
        if (e.target.className.includes('icon-action-bottom-lighter')) {
          fMenuSortBody.querySelector('.menu-show-icon').classList.remove('active')
          let unitSortMenuItem = e.target.parentNode.parentNode
          Array.from(unitSortMenuItem.parentNode.children).filter(child => child !== unitSortMenuItem).forEach(sibling => {
            sibling.classList.remove('active')
          })
          if (unitSortMenuItem.className.includes('active')) {
            unitSortMenuItem.classList.remove('active')
            if (cSortMenuByM.querySelector('.hidden-first-content') && cSortMenuByM.querySelector('.hidden-first-content').className.includes('show')) {
              fMenuSortContent.classList.remove('show')
              fMenuSortContent.children[0].classList.remove('show')
              if (this.$mobOverlay) this.$mobOverlay.style.display = 'none'
              isFlag = false
            }
          } else {
            unitSortMenuItem.classList.add('active')
            isFlag = true
          }
          if (isFlag) sonContentStr = this.setSonContent([menuArr[e.target.parentNode.getAttribute('data-index')]])
        }
        if (!isFlag) return
        cSortMenuByM.querySelector('.unit-sort-menu_content-box').innerHTML = sonContentStr
        this.setMenuOverlay()
        if (this.$mobOverlay) this.$mobOverlay.style.display = 'block'
        fMenuSortContent.classList.add('show')
        fMenuSortContent.children[0].classList.add('show')
      }
      if (e.target.className.includes('icon-action-left-lighter')) {
        e.preventDefault()
        let sortMenuContentItem = e.target.parentNode.parentNode
        Array.from(sortMenuContentItem.parentNode.children).filter(child => child !== sortMenuContentItem).forEach(sibling => {
          sibling.classList.remove('active')
          Array.from(sibling.querySelectorAll('.sort-menu-content')).forEach(_val => _val.classList.remove('show'))
        })
        if (sortMenuContentItem.children[1].className.includes('show')) {
          sortMenuContentItem.classList.remove('active')
          sortMenuContentItem.children[1].classList.remove('show')
        } else {
          sortMenuContentItem.classList.add('active')
          sortMenuContentItem.children[1].classList.add('show')
        }
      }
    })
  }
}
