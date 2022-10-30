const list = document.querySelectorAll("li");

document.addEventListener("keydown",(event)=>{
    event.preventDefault();
    const keyword = event.code.toLocaleLowerCase();
    if (keyword !== "space") return;
    setStyles();
});

document.addEventListener("click",(event)=>{
    const type = event.target.dataset.type;
    const target = event.target;
    switch (type) {
        case "lock":  
            changeLock(target);       
            break;
        default:            
            break;
    }
})  

// setStyles();
test();


function setStyles(){
    list.forEach(item=>{  
        if (isLocked(item)) return;
        let color =  chroma.random();    
        item.style.backgroundColor = color; 
        setTextColor(item, color);
    })
}


function setTextColor(item, color){
    const itemHex = item.querySelector("h2");
    const itemLock = item.querySelector("i");
    const currentColor = getRelativeColor(color);

    itemHex.style.color = currentColor;
    itemHex.textContent = color;    

    itemLock.style.color = currentColor;
}

function getRelativeColor(color){
    return chroma(color).luminance()<0.5 ? "white" : "black";
}

function getItemLock(node){
    const name = node.tagName.toLocaleLowerCase();
    return  name === "button" 
        ? node.children[0]
        : node;
}

function changeLock(target){
    const itemLock = getItemLock(target); 
    itemLock.classList.toggle('fa-lock-open');
    itemLock.classList.toggle('fa-lock');
}

function isLocked(item){
    const itemLock = item.querySelector("i")
    const classList  =itemLock.classList;
    return classList.contains('fa-lock');
}

function test(){

    const count = list.length;
    const testColors = chroma.scale(['black', 'green']).colors(count);
    
    list.forEach((item,index) => {
        if (isLocked(item)) return;
            
        item.style.backgroundColor = testColors[index]; 
        setTextColor(item, testColors[index]);
    })
}
