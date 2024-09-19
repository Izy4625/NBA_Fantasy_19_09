
const submitButton = document.getElementById('searchPlayers') as HTMLInputElement;
const BASE_URL: string = "https://nbaserver-q21u.onrender.com/api/";
// const Bonus_Url: string = "localhost:8000/api/AddTeam"
submitButton.addEventListener('click', postPlayers);
const addTeamButton = document.getElementById('addTeamButton') as HTMLButtonElement;
const positions: string[] = ["PG", "SG","SF","PF","C"]
addTeamButton?.addEventListener('click', addTeam) 

function apiMessage(msg: any){
    let div = document.getElementById("apiMessage") as HTMLDivElement;
    if(msg == 200){
        // div.innerText = `${y}`
    }
    div.innerText = msg;
    div.style.backgroundColor = "green";

    setTimeout(function(){
       div.innerHTML = '';
       div.style.backgroundColor =''
    }, 1000);
}

interface player{

    position: string;
twoPercent: number;
threePercent: number;
points: number;
playerName?: string;
}
async function addTeam(){
        const teamPlayers: any = {
            players: []
        }
        for(let i: number =0; i< positions.length; i++){
            let data = getDataLocalStorage(positions[i]);
            teamPlayers.players.push(data);
        }
        try{
            let data: any = await fetch(`${BASE_URL}AddTeam`,{
                method: "POST",
                headers: {'content-Type' : 'application/json'},
                body: JSON.stringify(teamPlayers)
            });
            console.log(data)
            let res: any =  await data.json();
                 renderPlayers(res)
                  apiMessage(data.status);
                 return res
        }
        catch(err){
            console.log(err)
        }
        localStorage.clear()
        renderDiVCards()

}
function getDataLocalStorage(position: string): player|undefined{
    let data : any = localStorage.getItem(position)
    if(typeof data === 'string'){
        const player: player = JSON.parse(data) || []
        return player
    }
   
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
   
    try{
        let data: any = await fetch(`${BASE_URL}filter`,{
            method: "POST",
            headers: {'content-Type' : 'application/json'},
            body: JSON.stringify(searchFactors)
           
        });
        let res: any =  await data.json();          
             apiMessage(data.status)
             renderPlayers(res)
             return res
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
            const player: Partial<player> = {}
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
                player[ALL_PROPERTIES[i]] = val;
                tr.appendChild(td)
                     }
                const actionTd = document.createElement('td') as HTMLTableCellElement;
                const addButton = document.createElement('button') as HTMLButtonElement;
                addButton.innerHTML = ` Add${element.playerName} ${"<br> </br>"} to Current Team`;
                addButton.onclick = () => addPlaerToTeam(player);
                actionTd.appendChild(addButton);
                tr.appendChild(actionTd);
                tableBody.appendChild(tr);
        })
    }
}
function addPlaerToTeam(targetedPlayer: Partial<player>|undefined){
    if(targetedPlayer){
        localStorage.setItem(`${targetedPlayer.position}`,JSON.stringify(targetedPlayer))
    }
    addToCardDiv(targetedPlayer?.position)
}
function addToCardDiv(position: string | undefined){
    // const listPositions: string[] = [""]
    if(position){
   const cardPlayerdiv = document.getElementById(`${position}`) as HTMLDivElement;
   if(cardPlayerdiv.childNodes.length > 0){
    cardPlayerdiv.innerHTML =""
   }
    
//    let p = document.createElement('p') as HTMLParagraphElement;
//    p.textContent = `${targetedPlayer[ALL_PROPERTIES[3]]}`
//    p.classList.add('title-Position');
//    cardPlayerdiv.appendChild(p);
   let targetedPlayer = getDataLocalStorage(position);
   if(targetedPlayer){
   
    for(let i: number = 0; i< ALL_PROPERTIES1.length; i++){
        if(i == 3){continue};
        let p = document.createElement('p') as HTMLParagraphElement;
        if(i == 0){ p.textContent = `${ALL_PROPERTIES1[4]}: ${targetedPlayer[ALL_PROPERTIES1[4]]} ` 
    }
        else if( i == 1 || i == 2){
             p.textContent = `${ALL_PROPERTIES1[i -1]}: ${targetedPlayer[ALL_PROPERTIES1[i-1]]}% `
        }else{
            p.textContent = `${ALL_PROPERTIES1[i-2]}: ${targetedPlayer[ALL_PROPERTIES1[i-2]]} `
        }
        
        cardPlayerdiv.appendChild(p);}
    
    }
}
}


function renderDiVCards(){
   
    for(let i: number = 0; i< positions.length; i++){
        addToCardDiv(positions[i]);
    }
}
renderDiVCards();
