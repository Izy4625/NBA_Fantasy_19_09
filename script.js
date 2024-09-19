"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const submitButton = document.getElementById('searchPlayers');
const BASE_URL = "https://nbaserver-q21u.onrender.com/api/";
// const Bonus_Url: string = "localhost:8000/api/AddTeam"
submitButton.addEventListener('click', postPlayers);
const addTeamButton = document.getElementById('addTeamButton');
const positions = ["PG", "SG", "SF", "PF", "C"];
addTeamButton === null || addTeamButton === void 0 ? void 0 : addTeamButton.addEventListener('click', addTeam);
function apiMessage(msg) {
    let div = document.getElementById("apiMessage");
    if (msg == 200) {
        // div.innerText = `${y}`
    }
    div.innerText = msg;
    div.style.backgroundColor = "green";
    setTimeout(function () {
        div.innerHTML = '';
        div.style.backgroundColor = '';
    }, 1000);
}
function addTeam() {
    return __awaiter(this, void 0, void 0, function* () {
        const teamPlayers = {
            players: []
        };
        for (let i = 0; i < positions.length; i++) {
            let data = getDataLocalStorage(positions[i]);
            teamPlayers.players.push(data);
        }
        try {
            let data = yield fetch(`${BASE_URL}AddTeam`, {
                method: "POST",
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify(teamPlayers)
            });
            console.log(data);
            let res = yield data.json();
            renderPlayers(res);
            apiMessage(data.status);
            return res;
        }
        catch (err) {
            console.log(err);
        }
        localStorage.clear();
        renderDiVCards();
    });
}
function getDataLocalStorage(position) {
    let data = localStorage.getItem(position);
    if (typeof data === 'string') {
        const player = JSON.parse(data) || [];
        return player;
    }
}
function postPlayers(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        let arr = [...document.forms[0].getElementsByTagName("input")].map(input => input.value);
        let position = document.getElementById("selectPosition");
        let searchFactors = {
            position: position.value,
            twoPercent: arr[2],
            threePercent: arr[1],
            points: arr[0]
        };
        try {
            let data = yield fetch(`${BASE_URL}filter`, {
                method: "POST",
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify(searchFactors)
            });
            let res = yield data.json();
            apiMessage(data.status);
            renderPlayers(res);
            return res;
        }
        catch (err) {
            console.log(err);
        }
    });
}
const playerProperties = {
    playerName: undefined,
    position: undefined,
    points: undefined,
    twoPercent: undefined,
    threePercent: undefined,
};
const ALL_PROPERTIES = Object.keys(playerProperties);
const ALL_PROPERTIES1 = ALL_PROPERTIES.reverse();
function renderPlayers(players) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    if (players) {
        players.forEach(element => {
            const player = {};
            let tr = document.createElement('tr');
            for (let i = 0; i < ALL_PROPERTIES.length; i++) {
                let td = document.createElement('td');
                let val = element[ALL_PROPERTIES[i]];
                if (typeof val === 'string') {
                    td.textContent = val;
                }
                else if (typeof val === 'number') {
                    td.innerText = val.toString();
                }
                player[ALL_PROPERTIES[i]] = val;
                tr.appendChild(td);
            }
            const actionTd = document.createElement('td');
            const addButton = document.createElement('button');
            addButton.innerHTML = ` Add${element.playerName} ${"<br> </br>"} to Current Team`;
            addButton.onclick = () => addPlaerToTeam(player);
            actionTd.appendChild(addButton);
            tr.appendChild(actionTd);
            tableBody.appendChild(tr);
        });
    }
}
function addPlaerToTeam(targetedPlayer) {
    if (targetedPlayer) {
        localStorage.setItem(`${targetedPlayer.position}`, JSON.stringify(targetedPlayer));
    }
    addToCardDiv(targetedPlayer === null || targetedPlayer === void 0 ? void 0 : targetedPlayer.position);
}
function addToCardDiv(position) {
    // const listPositions: string[] = [""]
    if (position) {
        const cardPlayerdiv = document.getElementById(`${position}`);
        if (cardPlayerdiv.childNodes.length > 0) {
            cardPlayerdiv.innerHTML = "";
        }
        //    let p = document.createElement('p') as HTMLParagraphElement;
        //    p.textContent = `${targetedPlayer[ALL_PROPERTIES[3]]}`
        //    p.classList.add('title-Position');
        //    cardPlayerdiv.appendChild(p);
        let targetedPlayer = getDataLocalStorage(position);
        if (targetedPlayer) {
            for (let i = 0; i < ALL_PROPERTIES1.length; i++) {
                if (i == 3) {
                    continue;
                }
                ;
                let p = document.createElement('p');
                if (i == 0) {
                    p.textContent = `${ALL_PROPERTIES1[4]}: ${targetedPlayer[ALL_PROPERTIES1[4]]} `;
                }
                else if (i == 1 || i == 2) {
                    p.textContent = `${ALL_PROPERTIES1[i - 1]}: ${targetedPlayer[ALL_PROPERTIES1[i - 1]]}% `;
                }
                else {
                    p.textContent = `${ALL_PROPERTIES1[i - 2]}: ${targetedPlayer[ALL_PROPERTIES1[i - 2]]} `;
                }
                cardPlayerdiv.appendChild(p);
            }
        }
    }
}
function renderDiVCards() {
    for (let i = 0; i < positions.length; i++) {
        addToCardDiv(positions[i]);
    }
}
renderDiVCards();
