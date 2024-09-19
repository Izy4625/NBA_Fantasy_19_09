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
const position = document.getElementById('selectPosition"');
const Points = document.getElementById("inputTotalPoints");
const threePointes = document.getElementById("input3Pointers");
const twoPointers = document.getElementById("input2Pointers");
const submitButton = document.getElementById('searchPlayers');
const BASE_URL = "https://nbaserver-q21u.onrender.com/api/filter";
submitButton.addEventListener('click', postPlayers);
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
        console.log(searchFactors);
        try {
            let data = yield fetch(BASE_URL, {
                method: "POST",
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify(searchFactors)
            });
            let res = yield data.json();
            console.log(res);
            renderPlayers(res);
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
                tr.appendChild(td);
            }
            const actionTd = document.createElement('td');
            const addButton = document.createElement('button');
            addButton.textContent = ` Add${element.playerName} to Current Team`;
            addButton.onclick = () => addPlaerToTeam(element);
            actionTd.appendChild(addButton);
            tr.appendChild(actionTd);
            tableBody.appendChild(tr);
        });
    }
}
function addPlaerToTeam(player) {
    if (player) {
        localStorage.setItem(`${player.position}`, JSON.stringify(player));
    }
    addToCardDiv(player);
}
function addToCardDiv(player) {
    if (player) {
        const cardPlayerdiv = document.getElementById(`${player === null || player === void 0 ? void 0 : player.position}`);
        cardPlayerdiv.innerHTML = "";
        console.log(ALL_PROPERTIES1);
        for (let i = 0; i < ALL_PROPERTIES1.length; i++) {
            if (i == 1) {
                continue;
            }
            ;
            let p = document.createElement('p');
            if (i == 0) {
                p.textContent = `${ALL_PROPERTIES1[4]}: ${player[ALL_PROPERTIES1[4]]} `;
            }
            else if (i == 2 || i == 3) {
                p.textContent = `${ALL_PROPERTIES1[i - 2]}: ${player[ALL_PROPERTIES1[i - 2]]}% `;
            }
            else {
                p.textContent = `${ALL_PROPERTIES1[i - 2]}: ${player[ALL_PROPERTIES1[i]]} `;
            }
            cardPlayerdiv.appendChild(p);
        }
    }
}
