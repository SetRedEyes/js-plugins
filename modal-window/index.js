let fruits = [
  {id: 1, title: 'Apples', price: 20, img: 'https://e1.edimdoma.ru/data/ingredients/0000/2374/2374-ed4_wide.jpg?1487746348'},
  {id: 2, title: 'Oranges', price: 30, img: 'https://fashion-stil.ru/wp-content/uploads/2019/04/apelsin-ispaniya-kg-92383155888981_small6.jpg'},
  {id: 3, title: 'Mangoes', price: 40, img: 'https://itsfresh.ru/upload/iblock/178/178d8253202ef1c7af13bdbd67ce65cd.jpg'},
]

/*
* 1. Динамически на основе массива вывести список карточек
* 2. Показать цену в модалке (и это должна быть 1 модалка)
* 3. Модалка для удаления с 2мя кнопками
* ---------
* 4. На основе $.modal нужно сделать другой плагин $.confirm (Promise)
* */

const toHTML = fruit => `
     <div class="col">
         <div class="card" >
             <img class="card-img-top" style="height: 300px; width: 348px" src="${fruit.img}" alt="${fruit.title}">
             <div class="card-body">
                 <h5 class="card-title">${fruit.title}</h5>
                 <a href="#" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">Price</a>
                 <a href="#" class="btn btn-danger" data-btn="remove" data-id="${fruit.id}">Delete</a> 
             </div>
         </div>
     </div>
`

function render() {
  const html = fruits.map(toHTML).join('')// СИНТАКСИС fruits.map(fruit => toHTML(fruit))
  document.querySelector("#fruits").innerHTML = html
}

render()

const priceModal = $.modal({
  title: 'Product Price',
  closable: true,
  width:'400px',
  footerButtons : [
    {text:'Close', type: 'primary', handler(){//type - bootstrap class
        console.log('Primary btn clicked')
        priceModal.close()
      }}
  ]
})


document.addEventListener('click', event=>{
  event.preventDefault()// появляется хэш в адресной строке. отменяем дефолтное поведение
  const btnType = event.target.dataset.btn
  const id = +event.target.dataset.id//забирая из строчки велечину. она являеться строчкой
  const fruit = fruits.find(f => f.id === id)

  if (btnType === 'price') {
        priceModal.setContent(`
    <p>${fruit.title}: <strong>${fruit.price}$</strong></p>  
    `)
    priceModal.open()
  }else if(btnType === 'remove'){
    $.confirm({
      title: 'Are you sure?',
      content:`<p> Delete fruit: <strong>${fruit.title}</strong></p>`
    }).then(()=>{
      fruits = fruits.filter(f => f.id !== id)
      render()
    }).catch((err) => {console.log('Error', err)})
  }
})