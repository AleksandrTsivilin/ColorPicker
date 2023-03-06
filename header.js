//const isShowHint = true;
let isOpenedMenu = false

const hint = document.getElementById('hint')
const btn = document.getElementById('btn-hint')

const controls = document.getElementById('rows-control')
const btnMenu = document.getElementById('btn-menu')
const span = document.getElementById('btn-menu-span')

btn.addEventListener('click',()=>
    hint.classList.add('hidden'))

btnMenu.addEventListener('click',()=>{
    console.log('click menu')
    isOpenedMenu = !isOpenedMenu
    isOpenedMenu 
        ? controls.classList.add('rows-control-active') 
        : controls.classList.remove('rows-control-active')

    isOpenedMenu
        ? btnMenu.classList.add('menu-btn-active')
        : btnMenu.classList.remove('menu-btn-active')
})  