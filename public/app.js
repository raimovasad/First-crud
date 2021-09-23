const toCurrency = function(price){
    return new Intl.NumberFormat('en-EN',{
        currency:'usd',
        style: 'currency'
    }).format(price)
}

const toDate = function(date){
return new Intl.DateTimeFormat('ru-RU',{
day: '2-digit',
month: 'long',
year: 'numeric',
hour: '2-digit',
minute: '2-digit',
second: '2-digit'
}).format(new Date(date))
}

 M.Tabs.init(document.querySelectorAll('.tabs'));

document.querySelectorAll('.date').forEach(elem=>{
elem.textContent = toDate(elem.textContent)
})

document.querySelectorAll('.small-price').forEach(elem=>{
    elem.textContent = toCurrency(elem.textContent)
})
document.querySelectorAll('.price').forEach(elem=>{ 
    elem.textContent = toCurrency(elem.textContent)
})
const $card = document.querySelector('.card')
$card.addEventListener('click',(e)=>{
    if(e.target.classList.contains('js-remove')){

        const id = e.target.dataset.id
        const csrf =e.target.dataset.csrf
        fetch('/card/remove/'+ id,{
            method:'delete',
            headers:{
                'X-XSRF-TOKEN':csrf
            },
        }).then(data=>{
            return data.json()
        }).then(card=>{
            if(card.clothes.length){

                const html = card.clothes.map(c=>{
                    return `<tr>
                    <td>${c.type}</td>
                    <td>(${c.count}x<span class="small-price">${c.price}</span>)</td>
                    <td><button class="btn btn-small red js-remove" data-id="${c.id}" data-csrf="${csrf}">Cancel</button></td>
                   </tr>`
                }).join('')

                $card.querySelector('tbody').innerHTML = html
                $card.querySelector('.price').textContent= toCurrency(card.price)
                $card.querySelectorAll('.small-price').forEach(elem=>{
                    elem.textContent = toCurrency(elem.textContent)
                })
            }
            else{
                $card.innerHTML = `<p>Card is Empty!!</p>`
            }
        }) 
    }
})
