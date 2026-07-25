class ScriptAiProductBuy extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)
    this.$inqury = this.$dom.querySelector('.ai_product_detail__inquire')
  }
  init() {
    this.initEvent()
  }
  initEvent() {
    this.$inqury.addEventListener('click', async () => {
      await this.utilts.setInquiryRecord('inquiry_jump')
      window.location.href = globalThis.Server.getRinseHref('/inquire_form.html', window.app.info.site)
    })
  }
}