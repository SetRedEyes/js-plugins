$.confirm = function (options) {
  return new Promise((resolve, reject) => {
    const modal = $.modal({
      title: options.title,
      width: '400px',
      closable: false,
      content: options.content,
      onClose() {
        modal.destroy()
      },
      footerButtons: [
        {
          text: 'Cancel',
          type: 'secondary',
          handler() {
            //type - bootstrap class
            console.log('Primary btn clicked')
            modal.close()
            reject()
          }
        },
        {
          text: 'Delete',
          type: 'danger',
          handler() {
            //type - bootstrap class
            console.log('Primary btn clicked')
            modal.close()
            resolve()
          }
        }
      ]
    })

    setTimeout(() => modal.open(), 100)
    //сеттаймаут. появление анимации, работа с дом деревом(когда вызываем $modal) сразу же создаем в дом дереве новый элемент модалки- это асbнхронная операция
  })
}
