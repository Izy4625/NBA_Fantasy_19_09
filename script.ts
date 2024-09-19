const position = document.getElementById('selectPosition"')as HTMLSelectElement;
const Points = document.getElementById("inputTotalPoints") as HTMLInputElement;
const threePointes = document.getElementById("input3Pointers") as HTMLInputElement;
const twoPointers = document.getElementById("input2Pointers") as HTMLInputElement;

const submitButton = document.getElementById('searchPlayers') as HTMLInputElement;
const BASE_URL: string = "https://nbaserver-q21u.onrender.com/api/filter";
submitButton.addEventListener('click', postPlayers);

interface player{

    position: string;
twoPercent: number;
threePercent: number;
points: number;
playerName?: string;
}
async function postPlayers(event:any):Promise<player[]|undefined> {
    event?.preventDefault();

    let arr: any = [...document.forms[0].getElementsByTagName("input")].map(input => input.value);
    let position: any = document.getElementById("selectPosition") as HTMLSelectElement;

    let searchFactors: player ={
        position: position.value,
        twoPercent: arr[2],
        threePercent: arr[1],
        points: arr[0]
    }
    console.log(searchFactors);
    try{
        let data: any = await fetch(BASE_URL,{
            method: "POST",
            headers: {'content-Type' : 'application/json'},
            body: JSON.stringify(searchFactors)
        });
        let res: any =  await data.json();
             console.log(res)
             renderPlayers(res)
    }
    catch(err){
        console.log(err)
    }
    

}
type keysPlayer = Record<(keyof player), undefined>


const playerProperties: keysPlayer = {
    playerName: undefined,
    position: undefined,
    points: undefined,
    twoPercent: undefined,
    threePercent: undefined, 
   
  };
  const ALL_PROPERTIES = Object.keys(playerProperties) as (keyof keysPlayer)[];
 const ALL_PROPERTIES1 = ALL_PROPERTIES.reverse() as (keyof keysPlayer)[];
function renderPlayers(players: player[]| undefined){
    const tableBody = document.getElementById("table-body") as HTMLTableElement
    tableBody.innerHTML = "";

    if(players){
        players.forEach(element =>{
            let tr = document.createElement('tr') as HTMLTableRowElement;
            for(let i: number = 0; i < ALL_PROPERTIES.length; i++){
                let td = document.createElement('td') as HTMLTableCellElement;
                let val: any = element[ALL_PROPERTIES[i]];
                if(typeof val === 'string' ){
                    td.textContent = val
                }
                else if(typeof val === 'number'){
                    td.innerText = val.toString();
                }
                tr.appendChild(td)
                     }
                const actionTd = document.createElement('td') as HTMLTableCellElement;
                const addButton = document.createElement('button') as HTMLButtonElement;
                addButton.textContent = ` Add${element.playerName} to Current Team`;
                addButton.onclick = () => addPlaerToTeam(element);
                actionTd.appendChild(addButton);
                tr.appendChild(actionTd);
                tableBody.appendChild(tr);
        })
    }
}
function addPlaerToTeam(player: player|undefined){
    if(player){
        localStorage.setItem(`${player.position}`,JSON.stringify(player))
    }
    addToCardDiv(player)
}
function addToCardDiv(player: player|undefined){
    if(player){
   const cardPlayerdiv = document.getElementById(`${player?.position}`) as HTMLDivElement;
   cardPlayerdiv.innerHTML =""
   console.log(ALL_PROPERTIES1)
    for(let i: number = 0; i< ALL_PROPERTIES1.length; i++){
        if(i == 1){continue};
        let p = document.createElement('p') as HTMLParagraphElement;
        if(i == 0){ p.textContent = `${ALL_PROPERTIES1[4]}: ${player[ALL_PROPERTIES1[4]]} ` 
    }
        else if( i == 2 || i == 3){
             p.textContent = `${ALL_PROPERTIES1[i-2]}: ${player[ALL_PROPERTIES1[i-2]]}% `
        }else{
            p.textContent = `${ALL_PROPERTIES1[i-2]}: ${player[ALL_PROPERTIES1[i]]} `
        }
        
        cardPlayerdiv.appendChild(p);
    
    }
}
}


