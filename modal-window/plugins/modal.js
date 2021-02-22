Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling) //this-footer
}

function _createModalFooter(buttons = []) {
  if (buttons.length === 0) {
    return document.createElement('div')
  }

  function noop() {}

  const wrap = document.createElement('div')
  wrap.classList.add('modal-footer')

  buttons.forEach((btn) => {
    const $btn = document.createElement('button')
    $btn.textContent = btn.text
    $btn.classList.add('btn')
    $btn.classList.add(`btn-${btn.type || 'secondary'}`)
    $btn.onclick = btn.handler || noop

    wrap.appendChild($btn)
  })

  return wrap
}

function _createModal(options) {
  //_ - приватная(системная),которая не должна быть вызвана отдельно f доступна только внутри
  const DEFAULT_WIDTH = '600px'
  const modal = document.createElement('div')
  modal.classList.add('vmodal')
  modal.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="modal-overlay" data-close="true">
        <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
            <div class="modal-header">
                <span class="modal-tittle">${options.title || 'Modal window'}</span>
              ${options.closable ? `  <span class="modal-close" data-close="true">&times;</span>` : ''}
            </div>
            <div class="modal-body" data-content>
                ${options.content || ''}
            </div>
           
        </div>
    </div>
  `
  )
  const footer = _createModalFooter(options.footerButtons)
  footer.appendAfter(modal.querySelector('[data-content]'))
  document.body.appendChild(modal)
  return modal
}

$.modal = function (options) {
  const ANIMATION_SPEED = 200
  const $modal = _createModal(options) //обозначение dom элемента
  let closing = false //защита если во время close  вызовем open - не корректное поведеник
  let destroyed = false //доп.защита

  const modal = {
    open() {
      if (destroyed) {
        //если тру то не запускать open
        return console.log('Modal is destroyed')
      }
      !closing && $modal.classList.add('open') //если не closing то добавляем класс open
    },
    close() {
      closing = true
      $modal.classList.remove('open')
      $modal.classList.add('hide')
      setTimeout(() => {
        $modal.classList.remove('hide')
        closing = false
        if (typeof options.onClose === 'function') {
          options.onClose()
        }
      }, ANIMATION_SPEED)
    }
  }

  const listener = (event) => {
    if (event.target.dataset.close) {
      //вызов метода должен быть после объявления
      modal.close()
    }
  }

  $modal.addEventListener('click', listener)

  return Object.assign(modal, {
    //добавление новых методов d объект modal
    destroy() {
      $modal.parentNode.removeChild($modal) //удаление дрм-ноды из дом дерева
      $modal.removeEventListener('click', listener)
      destroyed = true
    },
    setContent(html) {
      $modal.querySelector('[data-content]').innerHTML = html
    }
  })
}
