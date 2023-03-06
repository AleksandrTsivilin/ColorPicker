const countByRow = 5;



colorInfos = [];




startLoad();

document.addEventListener("keydown",(event)=>{
    event.preventDefault();
    const keyword = event.code.toLocaleLowerCase();
    if (keyword !== "space") return;
    document.querySelectorAll("li").forEach(item=>reloadColor(item));
    
});

document.addEventListener('click',(event)=>{
    event.preventDefault();
    const type = event.target.dataset.type;
    switch(type){
        case "add":
            list = addRow();
            break;
        case "remove":
            list = removeRow();
            break;
        case "lock":
            changeLock(event);
            break;
        case "copy":
            copyToClipBoard(event);        
    }
});

function startLoad(){
    state =  getData()
    return state ? loadData(state) : addRow();
}


function getRelativeColor(color){
    return chroma(color).luminance()<0.5 ? "white" : "black";
}

function setTextColor(item, color){
    const itemHex = item.querySelector("h2");
    const itemLock = item.querySelector("i");
    const itemTooltip = item.querySelector('div');

    const currentColor = getRelativeColor(color);

    itemHex.style.color = currentColor;
    itemHex.textContent = color;    

    itemLock.style.color = currentColor;

    itemTooltip.style.color = currentColor;
}

function reloadColor(item){
    if (isLocked(item)) return;

    const prevColor = item.querySelector('h2').textContent;

    
    const newColor = chroma.random();
    item.style.backgroundColor = newColor;

    setTextColor(item, newColor); 
    
    colorInfos.forEach(item => {
        if (item.color === prevColor.toString()){
            item.color = chroma(newColor).name();
        }
    });
    saveData();
}


function createItem(color, isLocked){
    
    const h2 = document.createElement("h2");
    h2.dataset.type = "copy"

    const button = document.createElement("button");

    isLocked 
        ? button.innerHTML = `
                <i data-type="lock" class="fa-solid fa-lock"></i>
            `
        : button.innerHTML = `
                <i data-type="lock" class="fa-solid fa-lock-open"></i>
            `

   
    button.dataset.type = "lock";

    const div = document.createElement("div")
    div.innerText="copied"
    div.classList.add('tooltip')

    let li = document.createElement('li');

    li.appendChild(h2);
    li.appendChild(button);
    li.appendChild(div)

    
    li.style.backgroundColor = color;

    setTextColor(li,color);
    
    return li;
}

function loadData(state){
    colorInfos = state;

    const ul = document.querySelector('ul')
    colorInfos.forEach(item => {        
        const li = createItem(item.color,item.isLocked);
        ul.appendChild(li);
    })
}

function addRow(){
    const ul = document.querySelector('ul');
   
    for(let i=0;i<countByRow;i++){    
        const color = chroma.random()    
        const li = createItem(chroma(color).name());
        ul.appendChild(li);
        colorInfos.push({
            color : chroma(color).name(),
            isLocked : false
        })
    }   
    saveData();
}


function removeRow(){    
    const ul = document.querySelector("ul");
    const li = document.querySelectorAll("li");
    if (li.length === countByRow) return;
    for (let i=0;i<countByRow;i++){
        const li = ul.lastElementChild;
        const removedColor = li.querySelector("h2").textContent;
        colorInfos = colorInfos.filter(item=>item.color !== removedColor);
        saveData(colorInfos);
        ul.removeChild(li);
    }
}

function changeLock(event){
    const li = event.composedPath()
        .find(item=>item.tagName === 'LI' );

    if (!li) return;
    const color = li.querySelector('h2').textContent;
    const itemLock = getItemLock(event.target); 
    itemLock.classList.toggle('fa-lock-open');
    itemLock.classList.toggle('fa-lock');  

    colorInfos.forEach(item => {
        if (item.color === color) {
            console.log(itemLock.classList)
            item.isLocked = !itemLock.classList.contains('fa-lock-open');
             console.log("find changes")
            }
    });
    saveData();
}


function copyToClipBoard(event){
    const target = event.target
    console.log('target',target)
    const title = target.textContent;
    
    const li = event.composedPath()
        .find(item=>item.tagName === 'LI' );

    if (!li) return;
    const div = li.querySelector('div');
    div.classList.add('tooltip-visible')
    setTimeout(()=>{
        div.classList.remove('tooltip-visible')
    },3000)
    return navigator.clipboard.writeText(title);
}

function getItemLock(node){
    const name = node.tagName.toLocaleLowerCase();
    return  name === "button" 
        ? node.children[0]
        : node;
}

function isLocked(item){
    const itemLock = item.querySelector("i")
    const classList  =itemLock.classList;
    return classList.contains('fa-lock');
}

function saveData(){
    const json = JSON.stringify(colorInfos)
    localStorage.setItem('colors',json)
}

function getData(){
    const obj = localStorage.getItem('colors');
    return JSON.parse(obj)
}
