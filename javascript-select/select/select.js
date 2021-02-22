const getTemplate = (data=[], placeholder, selectedId) => {// data -поумолчанию пустой массив. что бы не было проблем
  let text = placeholder ?? 'Default placeholder '//?? - оператор если placeholdera нет

  const items = data.map(item=> {//item -объект{id,value} - необходимо преобразовать в <li class="select__item">123</li>
    let cls = ''
    if (item.id === selectedId){
      text=item.value
      cls = 'selected'
    }
    return `
        <li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
    `
  })

  return`
  <div class="select__backdrop" data-type="backdrop"></div>
  <div class="select__input" data-type="input"><!--data-type - кликабельный элеметн для дропдаун листа. Классы для стилистики. даты для функционала-->
     <div class="span" data-type="value">${text}</div>
    <i class="fa fa-chevron-down" data-type="arrow"></i><!-- data-type - закэшировать обращение к дом дереву-->
 </div>
 <div class="select__dropdown">
     <ul class="select__list">
         ${items.join('')}   <!--// массив без join будут запятые-->
     </ul>
 </div> 
  `
}

export class Select {
  constructor(selector, options) {
    this.$el = document.querySelector(selector)// $сигнал о DOM элемент
    this.options=options
    this.selectedId = options.selectedId

    this.#render()// после рендер. когда будет доступенHTML для плагина
    this.#setup()
  }
//раблота с шаблоном
  #render(){//#приватный метод доступен только внутри класса select
    const {data, placeholder} = this.options
    this.$el.classList.add('select')//корневому элементу перед тем как его рендерить - задаем класс
    this.$el.innerHTML = getTemplate(data ,placeholder, this.selectedId)

  }
//работа с настройками
  #setup() {
    this.clickHandler = this.clickHandler.bind(this)//не получиться воспользоваться контекстом в clickhandler(event)
    this.$el.addEventListener('click', this.clickHandler)//потому что передаем f как ссылку и текряеться контекст. нужен bind(привязать к контексту this)
    this.$arrow = this.$el.querySelector('[data-type="arrow"]') //$ -потому что ДОМ-нода
    this.$value = this.$el.querySelector('[data-type="value"]')//что бы один раз сделать запрос к дом-дереву, а в дальнейшем к закэшированому элементу обращаться
  }

  clickHandler(event) {
    const {type} = event.target.dataset

    if(type === 'input'){
    this.toggle()
    }else if (type==='item'){
      const id = event.target.dataset.id
      this.select(id)
    } else if (type==='backdrop'){//клик вне селекта закрывает
      this.close()
    }
  }

  get isOpen(){
    return this.$el.classList.contains('open')
  }

  get current(){
    return this.options.data.find(item => item.id === this.selectedId)
  }

  select(id){
    this.selectedId = id
    this.$value.textContent = this.current.value

    this.$el.querySelectorAll(`[data-type="item"]`).forEach(el => {
      el.classList.remove('selected')
    })
    this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')

    this.options.onSelect ? this.options.onSelect(this.current) : null

    this.close()
  }

  toggle(){
    this.isOpen ? this.close() : this.open()
  }

  open(){
    this.$el.classList.add('open')
    this.$arrow.classList.remove('fa-chevron-down')
    this.$arrow.classList.add('fa-chevron-up')
  }

  close(){
    this.$el.classList.remove('open')
    this.$arrow.classList.add('fa-chevron-down')
    this.$arrow.classList.remove('fa-chevron-up')
  }

  destroy(){
    this.$el.removeEventListener('click', this.clickHandler)
    this.$el.innerHTML=""
  }
}