

const today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();

if (month <= 9) {
    month = "0" + month;
}

if (day <=9) {
    day = "0" + day;
}

afhent.value = `${year}-${month}-${day}`;
aflever.value = `${year}-${month}-${day}`;
afhent.min = afhent.value;
aflever.min = afhent.value;

afhent.addEventListener("change", function()
{
    if (afhent.value < afhent.min) {
        afhent.value=afhent.min;
    }
    aflever.min, aflever.value = afhent.value;

});
aflever.addEventListener("change", function()
{
    if (aflever.value < afhent.value) {
        aflever.value = afhent.value;
    }

});




let biler = [];
fetch("js/biler.json")
.then (function (data) {
    return data.json(); 
})
.then(function (post) {
    biler = post.billiste;
    
})

let req = new XMLHttpRequest();

req.onreadystatechange = () => {
  if (req.readyState == XMLHttpRequest.DONE) {
    console.log(req.responseText);
  }
};

req.open("POST", "https://api.jsonbin.io/b", true);
req.setRequestHeader("Content-Type", "application/json");
req.setRequestHeader("secret-key", "<SECRET_KEY>");



const sektion = document.getElementById("bil_sektion");
const skabelon = document.getElementById('skabelon_output');
const personer = document.getElementById('personer');
const kufferter = document.getElementById('kufferter');

function search() 
{

    let antalLejeDage = beregnAntalLejedage(afhent.value,aflever.value);
    
    sektion.innerHTML = '';

    for (const bil of biler)
    {
        if (bil.personer >= personer.value && bil.kufferter >= kufferter.value) 
        {
           
            const klon = skabelon.content.cloneNode(true);
            const bilMM = klon.querySelector(".bilMM");
            const billedtag = klon.querySelector("img");
            const kategori = klon.querySelector(".kategori");
            const antalpersoner = klon.querySelector(".antalpersoner");
            const antalkufferter = klon.querySelector(".antalkufferter");
            const lejeudgift = klon.querySelector(".lejeudgift");

            billedtag.src = bil.billede;
            billedtag.alt = bil.billedtekst;
            bilMM.textContent = bil.bilmaerke;
            kategori.textContent += bil.kategori;
            antalkufferter.textContent += bil.kufferter;
            antalpersoner.textContent += bil.personer;
            lejeudgift.textContent += beregnLejedgift(antalLejeDage, bil.tillaeg) + ",-";

            
            sektion.appendChild(klon);
        }  
    }  

    

    link.href = `udstyr.html?bil=${bil.bilmaerke}&
afhentning=${afhentningsdato.value}&
aflevering=${afleveringsdato.value}&
lejedage=${antaldage}&
lejeudgift=${beregnLejeudgift(antaldage, bil.tillaeg)}`;


function beregnAntalLejedage(afhentningsdato, afleveringsdato) 
        {
        const AFHENTNING = new Date(afhentningsdato);
        const AFLEVERING = new Date(afleveringsdato);
        const FORSKELITID = AFLEVERING.getTime() - AFHENTNING.getTime();
        const FORSKELIDAGE = FORSKELITID / (1000 * 3600 * 24) + 1;
        return FORSKELIDAGE; 
        }

function beregnLejedgift(antaldage, biltillaeg) 
    {
    const MOMS = 0.25;
    const GRUNDBELOEB = 495;
    const PRISPRDAG = 100;
    const LEJEUDGIFT = (GRUNDBELOEB + (antaldage * PRISPRDAG) + (antaldage * biltillaeg)) * (1 + MOMS);
    return Math.round (LEJEUDGIFT);


    
    }
};

search()
