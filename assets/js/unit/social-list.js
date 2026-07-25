class ScriptSocialList extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    if (!this.$dom) return
    this.$mediaMore = this.$dom.querySelector('.unit-social-list__more')
    this.mediaList = JSON.parse(this.utilts.htmlDecode(params.mediaList))
    this.shareMedia = JSON.parse(this.utilts.htmlDecode(params.shareMedia))
    this.$mediaShare = this.$dom.querySelectorAll('a.unit-social-list__item')
    this.email = this.utilts.htmlDecode(params.email)
    this.sharingType = params.sharingType
    this.pageTarget = params.pageTarget

  }

  init() {
    if (!this.$dom) return
    this.bindModalEvent()
  }

  /**弹框事件 */
  bindModalEvent() {
    let mediaHtml = ''
    let url = document.querySelector('[property="og:url"]')?.content || ''
    let title = document.querySelector('[property="og:title"]')?.content || ''
    let media = document.querySelector('[property="og:image"]')?.content || ''
    let description = document.querySelector('[property="og:description"]')?.content || ''
    let { email } = this
    let linkType = {
      'Facebook': `https://www.facebook.com/sharer.php?u=${url}&quote=${title}`,
      'WhatsApp': `https://api.whatsapp.com/send?text=${title}%20${url}`,
      'Twitter': `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      // 'LinkedIn': `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
      'LinkedIn': `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      'Pinterest': `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`,
      'Telegram': `https://t.me/share/url?url=${url}&text=${title}`,
      'Reddit': `https://www.reddit.com/submit?url=${url}&title=${title}`,
      'Mail': `mailto:${email}?subject=${title}&body=Check%20out%20this%20link`
    }

    if (this.sharingType === '1') {
      this.mediaList.forEach(item => {
        mediaHtml += `<a href="${item.link}" target="${this.pageTarget}" class="unit-social-list__item bg-${item.media.toLowerCase()} col-lg-2dot4">
          <div class='unit-social-list__itemabox'>
            <div class="unit-social-list__icon"><span class="iconfont icon-${item.icon}"></span></div>
            <div class="unit-social-list__title">${item.media}</div>
          </div>
        </a>`
      })
    } else if (this.sharingType === '2') {
      this.shareMedia.forEach(item => {
        mediaHtml += `<a href="${linkType[item.media]}" target="${this.pageTarget}" data-type="${item.media}" target="_blank" class="unit-social-list__item bg-${item.media.toLowerCase()} col-lg-2dot4">
          <div class='unit-social-list__itemabox'>
            <div class="unit-social-list__icon"><span class="iconfont icon-${item.icon}"></span></div>
            <div class="unit-social-list__title">${item.media}</div>
          </div>
        </a>`
      })
      if (!this.utilts.checkDesign()) {
        this.$mediaShare.forEach((el) => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            let { type } = el.dataset;
            window.open(linkType[type], this.pageTarget);
          });
        });
      }
    }

    if (this.$mediaMore) {
      this.$mediaMore.addEventListener('click', () => {
        new Modal().init({
          title: window.app.utilts.$t('Social media sharing'),
          className: 'new-modal-social',
          content: '<div class="unit-social-list">' + mediaHtml + '</div>',
          isHideCancel: true,
          isHideSubmit: true
        }).open()
      })
    }

  }
}