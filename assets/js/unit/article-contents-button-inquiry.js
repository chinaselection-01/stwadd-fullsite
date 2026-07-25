class ScriptArticleContentsInquiry extends Script {
  constructor(params) {
    super(params)
    this.$dom = document.querySelector(`#${this.attrId}`)


    this.modal = null
  }
  async init() {
      this.initModal()
      this.$dom.querySelector('.article-button-inquiry-button').addEventListener('click',()=>{
        this.modal.open();
      })
  }
  initModal() {
    this.modal = new Modal()
    const $modal = this.$dom.querySelector('.inquiry-modal-inner')
    if (!$modal) return
    this.modal.init({
      body: $modal,
      title_style: 1,
      title: this.utilts.$t('Send Inquiry'),
      size: 'lg',
      className: 'inquiry-modal articleContentsbuttonInquiry',
      isHideCancel: true,
      isHideSubmit: true,
      onSubmit: () => {
        $modal.querySelector(`.btn`).click()
      }
    })
  }
}