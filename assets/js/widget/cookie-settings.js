class WidgetCookieSettings extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.$actionAgree = this.$dom.querySelector('.action_agree')
    this.$actionSetting = this.$dom.querySelector('.action_setting')
    this.$actionReject = this.$dom.querySelector('.action_reject')
    this.$license = this.$dom.querySelector('.widget-cookie-settings__license')
    this.$content = this.$dom.querySelector('.widget-cookie-settings__content-wrap')
  }

  init() {
    const useCookie = this.utilts.getCookie('useCookie')
    if (this.utilts.checkDesign()) return
    if (!this.utilts.getCookie('useCookie')) {
      this.$dom.style.display = 'block'
    }
    this.bindAgreeEvent()
    this.bindSettingEvent()
    this.bindRejectEvent()
    if (useCookie) {
      if (useCookie === 'all' || useCookie.includes('advertisement')) {
        this.consentGrantedAdSetting()
      } else {
        this.consentDeniedAdSetting()
      }
    }
  }

  bindAgreeEvent() {
    this.$actionAgree.addEventListener('click', (event) => {
      const $div = document.createElement('div')
      $div.classList.add('loading')
      const $btn = this.$actionAgree.querySelector('.btn')
      $btn.insertBefore($div, $btn.firstChild)
      const $self = this
      setTimeout(function(){
        $self.utilts.setCookie('useCookie', 'all', {expires: new Date(new Date().getTime() + 3600 * 24 * 1000 * 30)})
        $self.$dom.style.display = 'none'
        $self.consentGrantedAdSetting()
      }, 1000)
    })
  }

  bindRejectEvent() {
    this.$actionReject.addEventListener('click', (event) => {
      const $div = document.createElement('div')
      $div.classList.add('loading')
      const $btn = this.$actionReject.querySelector('.btn')
      $btn.insertBefore($div, $btn.firstChild)
      const $self = this
      setTimeout(function(){
        $self.utilts.setCookie('useCookie', 'none', {expires: new Date(new Date().getTime() + 3600 * 24 * 1000 * 30)})
        $self.$dom.style.display = 'none'
        $self.consentDeniedAdSetting()
      }, 1000)
    })
  }

  bindSettingEvent() {
    const $licenseDom = document.createElement('div')
    $licenseDom.innerHTML = this.$license.innerHTML
    const $licenseList = $licenseDom.querySelectorAll('.available-checkbox')
    $licenseList.forEach(item => {
      item.addEventListener('click', (event) => {
        if (item.querySelector('[type="checkbox"]').getAttribute('checked')) {
          item.querySelector('[type="checkbox"]').removeAttribute('checked')
        } else {
          item.querySelector('[type="checkbox"]').setAttribute('checked', 'checked')
        }
      })
    })
    const $self = this
    const modal = new Modal().init({
      title: window.app.utilts.$t('Privacy Preference'),
      isHideCancel: true,
      body: $licenseDom,
      className: 'widget-cookie-settings__modal',
      size: 'lg',
      submitText: window.app.utilts.$t('Confirm My Choice'),
      onSubmit: function() {
        const $licenseList = this.body.querySelectorAll('.custom-checkbox')
        let range = []
        $licenseList.forEach(item => {
          const checked = item.querySelector('[checked]')
          if (checked) {
            range.push(checked.getAttribute('value'))
          }
        })
        const $span = document.createElement('span')
        $span.classList.add('loading')
        const $btn = document.querySelector('.widget-cookie-settings__modal .modal__footer-btn .btn')
        $btn.insertBefore($span, $btn.firstChild)
        const $modal = this
        setTimeout(function(){
          $self.$content.style.display = 'none'
          $self.utilts.setCookie('useCookie', range.join(','), {expires: new Date(new Date().getTime() + 3600 * 24 * 1000 * 30)})
          $modal.close()
          document.querySelector('#modal').style.zIndex = 101
          if (range.includes('advertisement')) {
            $self.consentGrantedAdSetting()
          } else {
            $self.consentDeniedAdSetting()
          }
        }, 1000)
      },
      onCancel: function() {
        this.close()
        document.querySelector('#modal').style.zIndex = 101
      }
    })

    this.$actionSetting.addEventListener('click', () => {
      document.querySelector('#modal').style.zIndex = 110
      modal.open()
    })
  }

  consentGrantedAdSetting() {
    try {
      if (gtag && typeof gtag === 'function') {
        gtag('consent', 'update', {
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted',
          'analytics_storage': 'granted'
        });
      }
    } catch (e) {}
  }
  consentDeniedAdSetting() {
    try {
      if (gtag && typeof gtag === 'function') {
        gtag('consent', 'update', {
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied',
          'analytics_storage': 'denied'
        });
      }
    } catch (e) {}
  }
}
