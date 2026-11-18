let decks =
JSON.parse(
    localStorage.getItem("commanderLabDecks")
) || [];

let importedDeckList = "";
let currentDeckId = null;
let selectedCommanderImage = "";
let mainDeckSort =
"score";



const continueImportBtn =
document.getElementById("continueImportBtn");

const showImportBtn =
document.getElementById("showImportBtn");

const saveDeckBtn =
document.getElementById("saveDeckBtn");

const deckImport =
document.getElementById("deckImport");

const deckDetailsCard =
document.getElementById("deckDetailsCard");

showImportBtn?.addEventListener(
    "click",
    function () {

        deckImport.style.display =
        "block";

        continueImportBtn
        .style.display =
        "block";

        this.style.display =
        "none";
    }
);

const deckNameInput =
document.getElementById("deckName");

const commanderInput =
document.getElementById("commanderName");

const findCommanderImageBtn =
document.getElementById(
    "findCommanderImageBtn"
);

const bracketInput =
document.getElementById("bracket");

const colourInput =
document.getElementById("colourIdentity");

const notesInput =
document.getElementById("deckNotes");

findCommanderImageBtn?.addEventListener(
    "click",
    async function () {

        const commander =
        commanderInput.value.trim();

        if (!commander) {
            alert(
                "Enter a commander first."
            );
            return;
        }

        try {


            const response =
            await fetch(
                `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(commander)}`
            );

            const card =
            await response.json();

            selectedCommanderImage =
            card.image_uris?.art_crop ||
            card.image_uris?.normal ||
            "";

            if (!selectedCommanderImage) {

                alert(
                    "No image found."
                );

                return;
            }

            document.getElementById(
                "commanderImagePreview"
            ).innerHTML = `
                <img
                    src="${selectedCommanderImage}"
                    style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    border-radius:8px;
                    "
                >
            `;

        } catch (error) {

            console.error(error);

            alert(
                "Scryfall lookup failed."
            );
        }
    }
);


const deckList =
document.getElementById("deckList");

const dashboardPage =
document.getElementById("dashboardPage");

const deckViewPage =
document.getElementById("deckViewPage");

const gameLogPage =
document.getElementById("gameLogPage");

function saveData() {
    localStorage.setItem(
        "commanderLabDecks",
        JSON.stringify(decks)
    );
}

function showDashboard() {
    dashboardPage.style.display = "block";
    deckViewPage.style.display = "none";
    gameLogPage.style.display = "none";
    render();
}

function showDeckView() {
    dashboardPage.style.display = "none";
    deckViewPage.style.display = "block";
    gameLogPage.style.display = "none";
}

function showGameLog() {
    dashboardPage.style.display = "none";
    deckViewPage.style.display = "none";
    gameLogPage.style.display = "block";
}

function getTotalGames() {
    return decks.reduce(
        (total, deck) =>
            total +
            (deck.games
                ? deck.games.length
                : 0),
        0
    );
}

function render() {

    deckList.innerHTML = "";

    decks.forEach(deck => {

        const card =
        document.createElement("li");

        const version =
        deck.versions?.[
            deck.versions.length - 1
        ];

card.style.listStyle = "none";
card.style.marginBottom = "12px";
card.style.padding = "0";

const games =
deck.games?.length || 0;

const mainCount =
version.mainDeck.reduce(
    (sum, card) =>
    sum + card.qty,
    0
);

const sideCount =
version.sideboard.reduce(
    (sum, card) =>
    sum + card.qty,
    0
);

const maybeCount =
version.maybeboard.reduce(
    (sum, card) =>
    sum + card.qty,
    0
);

const wins =
deck.games?.filter(
    g => g.result === "Win"
).length || 0;

const winRate =
games > 0
?
((wins / games) * 100).toFixed(1)
:
"-";

card.innerHTML = `
<div
onclick="viewDeck(${deck.id})"
style="
padding:16px;
cursor:pointer;
display:flex;
align-items:center;
gap:16px;
"
>

<img
src="${
    deck.commanderImage ||
    'https://images.squarespace-cdn.com/content/v1/placeholder'
}"
style="
width:60px;
height:60px;
object-fit:cover;
border-radius:8px;
flex-shrink:0;
"
>

<div
style="
flex:1;
"
>
    <h3
    style="
    margin:0;
    "
    >
        ${deck.name}
    </h3>

    <p
    style="
    margin:4px 0;
    opacity:0.8;
    "
    >
        ${deck.commander}
    </p>

<p
style="
margin:0;
font-size:14px;
"
>
    ${mainCount}D |
    ${sideCount}S |
    ${maybeCount}M
</p>

<p
style="
margin:4px 0 0 0;
font-size:14px;
"
>
    ${games}G |
    ${winRate}${games > 0 ? "%" : ""}
</p>
</div>

<div
style="
display:flex;
gap:8px;
align-items:center;
"
>

<button
onclick="
event.stopPropagation();
deleteDeck(${deck.id});
"
style="
width:auto;
padding:6px 10px;
background:#dc2626;
"
>
🗑
</button>

<div
style="
font-size:28px;
opacity:0.6;
"
>
›
</div>

</div>

</div>
`;

        deckList.appendChild(card);

    });

    

}

function deleteDeck(id) {

    if (
        !confirm(
            "Delete this deck?"
        )
    ) {
        return;
    }

    decks =
    decks.filter(
        deck =>
        deck.id !== id
    );

    saveData();
    render();
}

window.deleteDeck =
deleteDeck;

function viewDeck(id) {

    currentDeckId = id;

    const deck =
    decks.find(
        d => d.id === id
    );

    if (!deck) return;

    const version =
    deck.versions[
        deck.versions.length - 1
    ];

    showDeckView();

    document.getElementById(
        "deckHero"
    ).src =
    deck.commanderImage;

    document.getElementById(
        "viewDeckName"
    ).textContent =
    deck.name;

    document.getElementById(
        "viewCommander"
    ).textContent =
    deck.commander;

    document.getElementById(
        "viewBracket"
    ).textContent =
    deck.bracket;

    document.getElementById(
    "viewColours"
    ).textContent =
    deck.colours;

    document.getElementById(
        "deckNotesDisplay"
    ).textContent =
    deck.notes || "No notes.";

    const totalGames =
    deck.games.length;

    const wins =
    deck.games.filter(
        g => g.result === "Win"
    ).length;

    const losses =
    deck.games.filter(
     g => g.result === "Loss"
    ).length;

    const winRate =
    totalGames > 0
    ?
    ((wins / totalGames) * 100)
    .toFixed(1)
    :
    0;

const gamesWithTurns =

deck.games.filter(
    game =>

    game.turns !== null &&
    game.turns !== undefined
);

const avgTurn =

gamesWithTurns.length > 0

?

(
    gamesWithTurns.reduce(
        (sum, game) =>

        sum +
        game.turns,

        0
    )

    /

    gamesWithTurns.length
).toFixed(1)

:

"-";

    document.getElementById(
        "deckSummary"
    ).innerHTML = `
       <p>Games: ${totalGames}</p>
       <p>Wins: ${wins}</p>
      <p>Losses: ${losses}</p>
      <p>Win Rate: ${winRate}%</p>
     <p>Average Turn: ${avgTurn}</p>
    `;

    const matchupMap = {};

    deck.games.forEach(game => {

        if (
            !game.opponentDeckId
        ) {
            return;
        }

        const opponent =
        decks.find(
            d =>
            d.id ==
            game.opponentDeckId
        );

        if (!opponent) {
            return;
        }

        if (
            !matchupMap[
             opponent.name
            ]
        ) {

            matchupMap[
                opponent.name
            ] = {

                wins: 0,
                losses: 0,

                turns: [],

                winConditions: {},
                lossConditions: {},

                lastPlayed: null

            };

        }
        if (
            game.result === "Win"
        ) {

if (
    game.turns !== null &&
    game.turns !== undefined
) {

    matchupMap[
        opponent.name
    ].turns.push(
        game.turns
    );

}if (
    game.date
) {

    const date =

    new Date(
        game.date
    );

    const existing =

    matchupMap[
        opponent.name
    ].lastPlayed;

    if (
        !existing ||

        date >

        existing
    ) {

        matchupMap[
            opponent.name
        ].lastPlayed =
        date;

    }

}

matchupMap[
    opponent.name
].wins++;

if (
    game.winCondition
) {

    matchupMap[
        opponent.name
    ].winConditions[
        game.winCondition
    ] =

    (
        matchupMap[
            opponent.name
        ].winConditions[
            game.winCondition
        ] || 0
    ) + 1;

}

} else {

    matchupMap[
        opponent.name
    ].losses++;

    if (
        game.lossCondition
    ) {

        matchupMap[
            opponent.name
        ].lossConditions[
            game.lossCondition
        ] =

        (
            matchupMap[
                opponent.name
            ].lossConditions[
                game.lossCondition
            ] || 0
        ) + 1;

    }

}

});

let matchupHtml = "";

Object.entries(
    matchupMap
).forEach(
(
[name, data]
) => {

    const total =
    data.wins +
    data.losses;

    const percentage =

    total > 0

    ?

    (
        data.wins /
        total *
        100
    ).toFixed(1)

    :

    0;

    const avgTurn =

    data.turns.length

    ?

    (
        data.turns.reduce(
            (a,b) =>
            a + b,
            0
        )

        /

        data.turns.length

    ).toFixed(1)

    :

    "-";
const topWins =

Object.entries(
    data.winConditions
)

.sort(
    (a,b) =>
    b[1] - a[1]
)

.slice(0,2)

.map(
    ([name,count]) =>

    `${name}(${count})`
)

.join(", ");

const topLosses =

Object.entries(
    data.lossConditions
)

.sort(
    (a,b) =>
    b[1] - a[1]
)

.slice(0,2)

.map(
    ([name,count]) =>

    `${name}(${count})`
)

.join(", ");
    matchupHtml += `

    <div
    style="
    padding:10px;
    border-bottom:
    1px solid #374151;
    ">

        <strong>

        ${name}

        </strong>

        <br>

        ${data.wins}-${data.losses}

        |

        ${percentage}%

        |

        T${avgTurn}

        <br>
W:

${topWins || "None"}

<br>

${
topLosses

?

`L: ${topLosses}<br>`

:

""
}

        Last:

        ${
            data.lastPlayed

            ?

            data.lastPlayed.toLocaleDateString()

            :

            "-"
        }

    </div>

    `;

});



document.getElementById(
    "matchupAnalytics"
).innerHTML =

matchupHtml ||

"No matchup data.";
const manaCurve = {};
let lands = 0;

version.mainDeck.forEach(card => {

    if (
        card.typeLine &&
        card.typeLine.includes("Land")
    ) {

        lands += card.qty;
        return;
    }

    const mv =
    Math.floor(
        card.manaValue || 0
    );

    manaCurve[mv] =
    (manaCurve[mv] || 0)
    + card.qty;

});

let curveHtml = `
<div
style="
display:flex;
align-items:center;
margin:4px 0;
"
>
<div style="width:30px;">
L
</div>

<div
style="
background:#16a34a;
height:16px;
width:${lands * 20}px;
border-radius:4px;
"
></div>

<div style="margin-left:8px;">
${lands}
</div>
</div>
`;

curveHtml += Object.entries(manaCurve)
.sort(
    (a,b) =>
    Number(a[0]) -
    Number(b[0])
)
.map(([cost,count]) => `
<div
style="
display:flex;
align-items:center;
margin:4px 0;
"
>
<div style="width:30px;">
${cost}
</div>

<div
style="
background:#2563eb;
height:16px;
width:${count * 20}px;
border-radius:4px;
"
></div>

<div style="margin-left:8px;">
${count}
</div>
</div>
`)
.join("");

document.getElementById(
    "manaCurve"
).innerHTML =
curveHtml || "No curve data";
const cardStats = {};

version.mainDeck.forEach(card => {

    cardStats[
        card.name
    ] = {

        mvp: 0,
        dud: 0

    };

});

deck.games.forEach(game => {

    (
        game.mvps || []
    ).forEach(card => {

        if (
            cardStats[card]
        ) {

            cardStats[
                card
            ].mvp++;

        }

    });

    (
        game.duds || []
    ).forEach(card => {

        if (
            cardStats[card]
        ) {

            cardStats[
                card
            ].dud++;

        }

    });

});

const rankedCards = [];

Object.entries(cardStats)
.forEach(([name, stat]) => {

    const mvpPercent =
    totalGames
    ?
    (
        stat.mvp /
        totalGames *
        100
    )
    : 0;

    const dudPercent =
    totalGames
    ?
    (
        stat.dud /
        totalGames *
        100
    )
    : 0;

    const score =
    mvpPercent -
    dudPercent;

    rankedCards.push({
        name,
        mvpPercent,
        dudPercent,
        score
    });

});

rankedCards.sort(
    (a, b) =>
    b.score - a.score
);

const statsLookup = {};

rankedCards.forEach(
    card => {

        statsLookup[
            card.name
        ] = card;

    }
);




const versionHtml =

deck.versions

.map(version => {

    const games =
    deck.games.filter(
        g =>
        g.version ===
        version.version
    );

    const wins =
    games.filter(
        g =>
        g.result === "Win"
    ).length;

    const losses =
    games.filter(
        g =>
        g.result === "Loss"
    ).length;

    const total =
    games.length;

    const winRate =
    total > 0
    ?
    (
        wins /
        total *
        100
    ).toFixed(1)
    :
    "-";
const versionIndex =
deck.versions.findIndex(
    v =>
    v.version ===
    version.version
);

let addedCards = [];
let removedCards = [];


let changeCount = "Base";
if (versionIndex > 0) {

    const currentCards =
    version.mainDeck.map(
        card => card.name
    );

    const previousCards =
    deck.versions[
        versionIndex - 1
    ].mainDeck.map(
        card => card.name
    );

    addedCards =
    currentCards.filter(
        card =>
        !previousCards.includes(card)
    );

    removedCards =
    previousCards.filter(
        card =>
        !currentCards.includes(card)
    );

    changeCount =
    `+${addedCards.length}/-${removedCards.length}`;
}
    return `

    <div
    style="
    padding:10px;
    border-bottom:
    1px solid #374151;
    display:flex;
    justify-content:space-between;
    align-items:center;
    ">

        <span>

        V${version.version}

        |

        ${version.mainDeck.reduce(
            (sum, card) =>
            sum + card.qty,
            0
        )}

        |

        ${wins}-${losses}

        |

${winRate}${
    total > 0
    ? "%"
    : ""
}

|

${changeCount}

        </span>

<div
style="
display:flex;
gap:6px;
"
>

<button
onclick="
const details =
this.parentElement.parentElement.nextElementSibling;
details.style.display =
window.getComputedStyle(details)
.display === 'none'
? 'block'
: 'none';
"
style="
width:auto;
padding:4px 8px;
"
>
▼
</button>

${version.version > 1
?
`
<button
onclick="deleteVersion(${version.version})"
style="
width:auto;
padding:4px 8px;
background:#dc2626;
"
>
🗑
</button>
`
:
""}

</div>

</div>

<div
class="versionDetails"
style="
display:none;
padding:10px;
background:#111827;
"
>

Version Date:

${
version.created
?
new Date(
    version.created
).toLocaleDateString()
:
"Unknown Date"
}

<br><br>


${
versionIndex === 0

?

"Original Version"

:

`

Added:

<br>

${
addedCards.length
?
addedCards.join("<br>")
:
"None"
}

<br><br>

Removed:

<br>

${
removedCards.length
?
removedCards.join("<br>")
:
"None"
}

`


}

</div>

    `;

})



.reverse()

.join("");

document.getElementById(
    "versionHistory"
).innerHTML =

versionHtml ||

"No versions.";




    const mainDeckList =
    document.getElementById(
        "mainDeckList"
    );

    const sideboardList =
    document.getElementById(
        "sideboardList"
    );

    const maybeboardList =
    document.getElementById(
        "maybeboardList"
    );

    mainDeckList.innerHTML = "";
    sideboardList.innerHTML = "";
    maybeboardList.innerHTML = "";

let sortedMainDeck =

[...version.mainDeck];

if (
    mainDeckSort ===
    "alpha"
) {

    sortedMainDeck.sort(
        (a,b) =>

        a.name.localeCompare(
            b.name
        )
    );

}

if (
    mainDeckSort ===
    "score"
) {

    sortedMainDeck.sort(
        (a,b) =>

        (
            statsLookup[
                b.name
            ]?.score || 0
        )

        -

        (
            statsLookup[
                a.name
            ]?.score || 0
        )
    );

}

if (
    mainDeckSort ===
    "mvp"
) {

    sortedMainDeck.sort(
        (a,b) =>

        (
            statsLookup[
                b.name
            ]?.mvpPercent || 0
        )

        -

        (
            statsLookup[
                a.name
            ]?.mvpPercent || 0
        )
    );

}

if (
    mainDeckSort ===
    "dud"
) {

    sortedMainDeck.sort(
        (a,b) =>

        (
            statsLookup[
                b.name
            ]?.dudPercent || 0
        )

        -

        (
            statsLookup[
                a.name
            ]?.dudPercent || 0
        )
    );

}

sortedMainDeck.forEach((card,index) => {

    mainDeckList.innerHTML += `

        <div
        style="
        display:flex;
        align-items:center;
        padding:6px;
        border-bottom:
        1px solid #374151;
        "
        >

<span
style="
flex:1;
"
>

${(
    (statsLookup[card.name]?.mvpPercent || 0)
    >
    (statsLookup[card.name]?.dudPercent || 0)
)
? "🟢 "
:
(
    (statsLookup[card.name]?.dudPercent || 0)
    >
    (statsLookup[card.name]?.mvpPercent || 0)
)
? "🔴 "
: ""
}
${card.qty}
${card.name}

${
mainDeckSort !== "alpha"

?

`

<br>

<small>

Score:
${(
    statsLookup[
        card.name
    ]?.score ?? 0
).toFixed(1)}

|

MVP:
${(
    statsLookup[
        card.name
    ]?.mvpPercent ?? 0
).toFixed(1)}%

|

Dud:
${(
    statsLookup[
        card.name
    ]?.dudPercent ?? 0
).toFixed(1)}%

</small>

`

:

""

}

</span>

<button
title="Move to Sideboard"
style="
width:32px;
height:32px;
padding:0;
margin-left:4px;
background:#d97706;
font-weight:bold;
"
onclick="moveMainToSideboard(${index})"
>
S
</button>

<button
title="Move to Maybeboard"
style="
width:32px;
height:32px;
padding:0;
margin-left:4px;
background:#2563eb;
font-weight:bold;
"
onclick="moveMainToMaybeboard(${index})"
>
M
</button>

<button
title="Remove Card"
style="
width:32px;
height:32px;
padding:0;
margin-left:4px;
background:#dc2626;
font-weight:bold;
"
onclick="removeMainCard(${index})"
>
X
</button>

    </div>

    `;

});



version.sideboard.forEach((card,index) => {

    sideboardList.innerHTML += `

    <div
    style="
    display:flex;
    align-items:center;
    padding:6px;
    border-bottom:
    1px solid #374151;
    ">

        <span
        style="
        flex:1;
        "
        >


        ${card.qty}
        ${card.name}

        </span>

<button
title="Move to Main Deck"
style="
width:32px;
height:32px;
padding:0;
margin-left:4px;
background:#16a34a;
font-weight:bold;
"
onclick="moveSideboardToMain(${index})"
>
M
</button>

<button
title="Remove Card"
style="
width:32px;
height:32px;
padding:0;
margin-left:4px;
background:#dc2626;
font-weight:bold;
"
onclick="removeSideboardCard(${index})"
>
X
</button>

    </div>

    `;

});

version.maybeboard.forEach((card,index) => {

    maybeboardList.innerHTML += `

    <div
    style="
    display:flex;
    align-items:center;
    padding:6px;
    border-bottom:
    1px solid #374151;
    ">

        <span
        style="
        flex:1;
        "
        >


        ${card.qty}
        ${card.name}

        </span>

        <button
        title="Move to Main Deck"
        style="
        width:32px;
        height:32px;
        padding:0;
        margin-left:4px;
        background:#16a34a;
        font-weight:bold;
        "
        onclick="moveMaybeboardToMain(${index})"
        >
        M
        </button>

        <button
        title="Remove Card"
        style="
        width:32px;
        height:32px;
        padding:0;
        margin-left:4px;
        background:#dc2626;
        font-weight:bold;
        "
        onclick="removeMaybeboardCard(${index})"
        >
        X
        </button>

    </div>

    `;

});
}

function removeMainCard(index) {

    const deck =

    decks.find(
        d =>
        d.id === currentDeckId
    );

    if (!deck) {
        return;
    }

    const version =

    deck.versions[
        deck.versions.length - 1
    ];

    version.mainDeck.splice(
        index,
        1
    );

    saveData();

    viewDeck(
        currentDeckId
    );

}

function moveMainToMaybeboard(index) {

    const deck =
    decks.find(
        d =>
        d.id === currentDeckId
    );

    if (!deck) {
        return;
    }

    const version =
    deck.versions[
        deck.versions.length - 1
    ];

    const card =
    version.mainDeck[index];

    if (!card) {
        return;
    }

    version.maybeboard.push(
        card
    );

    version.mainDeck.splice(
        index,
        1
    );

    saveData();

    viewDeck(
        currentDeckId
    );

}
function moveMainToSideboard(index) {



    const deck =
    decks.find(
        d =>
        d.id === currentDeckId
    );

    if (!deck) {
        return;
    }

    const version =
    deck.versions[
        deck.versions.length - 1
    ];

    const card =

    version.mainDeck[index];

    if (!card) {
        return;
    }

    version.sideboard.push(
        card
    );

    version.mainDeck.splice(
        index,
        1
    );

    saveData();

    viewDeck(
        currentDeckId
    );

}
window.removeMainCard =
removeMainCard;

window.moveMainToSideboard =
moveMainToSideboard;



function removeSideboardCard(index) {

    const deck =
    decks.find(
        d =>
        d.id === currentDeckId
    );

    if (!deck) {
        return;
    }

    const version =
    deck.versions[
        deck.versions.length - 1
    ];

    version.sideboard.splice(
        index,
        1
    );

    saveData();

    viewDeck(
        currentDeckId
    );

}

window.removeSideboardCard =
removeSideboardCard;

function removeMaybeboardCard(index) {

    const deck =

    decks.find(
        d =>
        d.id === currentDeckId
    );

    if (!deck) {
        return;
    }

    const version =

    deck.versions[
        deck.versions.length - 1
    ];

    version.maybeboard.splice(
        index,
        1
    );

    saveData();

    viewDeck(
        currentDeckId
    );

}

function moveSideboardToMain(index) {

    const deck =
    decks.find(
        d =>
        d.id === currentDeckId
    );

    if (!deck) {
        return;
    }

    const version =
    deck.versions[
        deck.versions.length - 1
    ];

    const card =
    version.sideboard[index];

    if (!card) {
        return;
    }

    version.mainDeck.push(
        card
    );

    version.sideboard.splice(
        index,
        1
    );

    saveData();

    viewDeck(
        currentDeckId
    );

}

function moveMaybeboardToMain(index) {

    const deck =
    decks.find(
        d =>
        d.id === currentDeckId
    );

    if (!deck) {
        return;
    }

    const version =
    deck.versions[
        deck.versions.length - 1
    ];

    const card =
    version.maybeboard[index];

    if (!card) {
        return;
    }

    version.mainDeck.push(
        card
    );

    version.maybeboard.splice(
        index,
        1
    );

    saveData();

    viewDeck(
        currentDeckId
    );

}

window.removeMaybeboardCard =
removeMaybeboardCard;

window.moveSideboardToMain =
moveSideboardToMain;

window.moveMaybeboardToMain =
moveMaybeboardToMain;

function editDeckDetails() {

    const deck =
    decks.find(
        d => d.id === currentDeckId
    );

    if (!deck) {
        return;
    }

    document.getElementById(
        "editDeckCard"
    ).style.display = "block";

    document.getElementById(
        "editDeckName"
    ).value =
    deck.name;

    document.getElementById(
        "editCommander"
    ).value =
    deck.commander;

    document.getElementById(
        "editBracket"
    ).value =
    deck.bracket;

    document.getElementById(
        "editColours"
    ).value =
    deck.colours;

    document.getElementById(
        "editNotes"
    ).value =
    deck.notes || "";

}

function deleteVersion(
    versionNumber
) {

    const deck =
    decks.find(
        d =>
        d.id === currentDeckId
    );

    if (!deck) {
        return;
    }

    if (
        !confirm(
            `Delete Version ${versionNumber}?`
        )
    ) {
        return;
    }

    deck.versions =
    deck.versions.filter(
        version =>
        version.version !==
        versionNumber
    );

    saveData();

    viewDeck(
        currentDeckId
    );

}


window.viewDeck =
viewDeck;

window.deleteVersion =
deleteVersion;

window.editDeckDetails =
editDeckDetails;

continueImportBtn.addEventListener(
    "click",
    function () {

        importedDeckList =
        deckImport.value.trim();

        if (!importedDeckList) {

            alert(
                "Paste a decklist first."
            );

            return;
        }

        const commanderMatch =
        importedDeckList.match(
        /\/\/Commander[\s\S]*?\n1\s+(.+?)\s+\([^)]+\)\s+\d+/i
        );

        if (
    commanderMatch &&
    commanderMatch[1]
) {

    commanderInput.value =
    commanderMatch[1].trim();

    fetch(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
            commanderInput.value
        )}`
    )
    .then(response => response.json())
    .then(card => {

       
        selectedCommanderImage =
        card.image_uris?.art_crop ||
        card.image_uris?.normal ||
        "";

        if (
            selectedCommanderImage
        ) {

            document.getElementById(
                "commanderImagePreview"
            ).innerHTML = `
                <img
                    src="${selectedCommanderImage}"
                    style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    border-radius:8px;
                    "
                >
            `;
        }

    })
    .catch(error =>
        console.error(error)
    );

}

deckDetailsCard.style.display =
"block";

console.log(
    "Auto image fetch ran"
);
    }
);
saveDeckBtn.addEventListener(
    "click",
    async function () {

        const deckName =
        deckNameInput.value.trim();

        if (!deckName) {

            alert(
                "Deck name required."
            );

            return;
        }

        const lines =
        importedDeckList
        .split("\n")
        .map(line => line.trim())
        .filter(line => line);

        let section = "main";

        const commanderCards = [];
        const mainDeck = [];
        const sideboard = [];
        const maybeboard = [];

        for (const line of lines) {

            if (line === "//Commander") {
                section = "commander";
                continue;
            }

            if (line === "//Main") {
                section = "main";
                continue;
            }

            if (line === "//Sideboard") {
                section = "sideboard";
                continue;
            }

            if (line === "//Maybeboard") {
                section = "maybeboard";
                continue;
            }

            const match =
            line.match(
                /^(\d+)\s+(.+)$/
            );

            if (!match) {
                continue;
            }

            const qty =
            parseInt(match[1]);

            let cardName =
            match[2];

            cardName =
            cardName.replace(
                /\s+\([^)]+\)\s+\d+$/,
                ""
            );

            let manaValue = 0;
            let typeLine = "";

if (
    section === "main" ||
    section === "sideboard" ||
    section === "maybeboard"
) {

    try {

        const response =
        await fetch(
            `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
        );

        const data =
        await response.json();

        if (data.object === "error") {

            alert(
                `Card not found:\n${cardName}`
            );

            return;
        }

        manaValue =
        data.cmc || 0;

        typeLine =
        data.type_line || "";

    } catch {

        alert(
            `Failed to lookup:\n${cardName}`
        );

        return;
    }
}

const card = {
    qty,
    name: cardName,
    manaValue,
    typeLine
};

if (section === "commander") {
    commanderCards.push(card);
}

if (section === "main") {
    mainDeck.push(card);
}

if (section === "sideboard") {
    sideboard.push(card);
}

if (section === "maybeboard") {
    maybeboard.push(card);
}
        }

        decks.push({
            id: Date.now(),
            name: deckName,
            commander: commanderInput.value,
            commanderImage:
            selectedCommanderImage,
            bracket: bracketInput.value,
            colours: colourInput.value,
            notes: notesInput.value,

            versions: [
                {
                    version: 1,
                    created:
                    new Date()
                    .toISOString(),

                    commander:
                    commanderCards,

                    mainDeck:
                    mainDeck,

                    sideboard:
                    sideboard,

                    maybeboard:
                    maybeboard
                }
            ],

            games: []
        });

        saveData();

        deckImport.value = "";
        deckNameInput.value = "";
        commanderInput.value = "";
        colourInput.value = "";
        notesInput.value = "";

        importedDeckList = "";

        deckDetailsCard.style.display =
        "none";

        render();
    }
);

document
.getElementById("backButton")
.addEventListener(
    "click",
    function () {
        showDashboard();
    }
);

document
.getElementById("logGameBtn")
.addEventListener(
    "click",
    function () {

        if (!currentDeckId) {
            return;
        }

        const deck =
        decks.find(
            d => d.id === currentDeckId
        );

        if (!deck) {
            return;
        }

        const version =
        deck.versions[
            deck.versions.length - 1
        ];

        const cardNames =
        version.mainDeck
        .map(card => card.name)
        .sort();
        
        const opponentDeck =
document.getElementById(
    "opponentDeck"
);

if (opponentDeck) {

    opponentDeck.innerHTML =
    '<option value="">Opponent Deck</option>';

    decks
    .filter(
        d =>
        d.id !== currentDeckId
    )
    .forEach(deck => {

        const option =
        document.createElement("option");

        option.value =
        deck.id;

        option.textContent =
        deck.name;

        opponentDeck.appendChild(
            option
        );

    });
}

        const dropdowns = [
            "mvp1",
            "mvp2",
            "mvp3",
            "mvp4",
            "mvp5",
            "dud1",
            "dud2",
            "dud3",
            "dud4",
            "dud5"
        ];

        dropdowns.forEach(id => {

            const select =
            document.getElementById(id);

            if (!select) {
                return;
            }

            select.innerHTML =
            '<option value="">None</option>';

            cardNames.forEach(card => {

                const option =
                document.createElement(
                    "option"
                );

                option.value =
                card;

                option.textContent =
                card;

                select.appendChild(
                    option
                );

            });

        });

        document.getElementById(
            "gameResult"
        ).value = "";

        document.getElementById(
            "turnCount"
        ).value = "";

        document.getElementById(
            "gameNotes"
        ).value = "";

        showGameLog();
    }
);


document
.getElementById("backFromGameBtn")
.addEventListener(
    "click",
    function () {

        if (currentDeckId) {
            viewDeck(
                currentDeckId
            );
        }
    }
);

document
.getElementById("saveGameBtn")
.addEventListener(
    "click",
    function () {

        if (!currentDeckId) {
            return;
        }

        const deck =
        decks.find(
            d =>
            d.id === currentDeckId
        );

        if (!deck) {
            return;
        }

        const result =
        document.getElementById(
            "gameResult"
        ).value;

        if (!result) {

            alert(
                "Select a result."
            );

            return;
        }

        const turnValue =
        document.getElementById(
            "turnCount"
        ).value;

        const turns =

        turnValue === ""

        ?

        null

        :

        parseInt(
            turnValue
        );

        const notes =
        document.getElementById(
            "gameNotes"
        ).value;

        const opponentDeckId =
        document.getElementById(
           "opponentDeck"
        )?.value || "";

        const winCondition =
        document.getElementById(
            "winCondition"
        )?.value || "";

const lossCondition =
document.getElementById(
    "lossCondition"
)?.value || "";

        const mvps = [
    document.getElementById("mvp1")?.value,
    document.getElementById("mvp2")?.value,
    document.getElementById("mvp3")?.value,
    document.getElementById("mvp4")?.value,
    document.getElementById("mvp5")?.value
].filter(Boolean);

const duds = [
    document.getElementById("dud1")?.value,
    document.getElementById("dud2")?.value,
    document.getElementById("dud3")?.value,
    document.getElementById("dud4")?.value,
    document.getElementById("dud5")?.value
].filter(Boolean);

deck.games.push({

    date:
    new Date()
    .toISOString(),

    version:
    deck.versions[
        deck.versions.length - 1
    ].version,


    result:
    result,

    opponentDeckId:
    opponentDeckId,

    turns:
    turns,

    winCondition:
    winCondition,

    lossCondition:
    lossCondition,

    mvps:
    mvps,

    duds:
    duds,

    notes:
    notes

});

if (opponentDeckId) {

    const opponentDeck =

    decks.find(
        d =>
        d.id ==
        opponentDeckId
    );

    if (opponentDeck) {

        opponentDeck.games.push({

            date:
            new Date()
            .toISOString(),

            result:
            result === "Win"
            ? "Loss"
            : "Win",

            opponentDeckId:
            currentDeckId,

            turns:
            turns,

            winCondition:
            "",

            lossCondition:
            "",

            mvps:
            [],

            duds:
            [],

            notes:
            "[Auto Recorded]"

        });

    }

}

        saveData();
        render();

        viewDeck(
            currentDeckId
        );
    }
);

document
.getElementById(
    "createVersionBtn"
)
.addEventListener(
    "click",
    function () {

        if (!currentDeckId) {
            return;
        }

        const deck =
        decks.find(
            d =>
            d.id === currentDeckId
        );

        if (!deck) {
            return;
        }

        const latest =
        deck.versions[
            deck.versions.length - 1
        ];

        const newVersion = {
            version:
            latest.version + 1,

            created:
            new Date()
            .toISOString(),

            commander:
            JSON.parse(
                JSON.stringify(
                    latest.commander
                )
            ),

            mainDeck:
            JSON.parse(
                JSON.stringify(
                    latest.mainDeck
                )
            ),

            sideboard:
            JSON.parse(
                JSON.stringify(
                    latest.sideboard
                )
            ),

            maybeboard:
            JSON.parse(
                JSON.stringify(
                    latest.maybeboard
                )
            )
        };

        deck.versions.push(
            newVersion
        );

        saveData();

        alert(
            `Version ${newVersion.version} created`
        );
    }
);



document
.getElementById(
    "addMainDeckCardBtn"
)
?.addEventListener(
"click",
async function () {

    if (!currentDeckId) {

        return;

    }

    const cardName =

    prompt(
        "Card Name"
    );

    if (!cardName) {

        return;

    }

    const deck =

    decks.find(
        d =>
        d.id === currentDeckId
    );

    if (!deck) {

        return;

    }

    const version =

    deck.versions[
        deck.versions.length - 1
    ];

try {

    const response =
    await fetch(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
    );

    const data =
    await response.json();

    if (data.object === "error") {

        alert(
            `Card not found:\n${cardName}`
        );

        return;
    }

    version.mainDeck.push({
        qty: 1,
        name: data.name,
        manaValue: data.cmc || 0,
        typeLine: data.type_line || ""
    });

} catch {

    alert(
        `Failed to lookup:\n${cardName}`
    );

    return;

}

    saveData();

    viewDeck(
        currentDeckId
    );

}
);

document
.getElementById(
    "addSideboardCardBtn"
)
?.addEventListener(
"click",
async function () {


    if (!currentDeckId) {
        return;
    }

    const cardName =
    prompt(
        "Card Name"
    );

    if (!cardName) {
        return;
    }

    const deck =
    decks.find(
        d =>
        d.id === currentDeckId
    );

    if (!deck) {
        return;
    }

    const version =
    deck.versions[
        deck.versions.length - 1
    ];

try {

    const response =
    await fetch(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
    );

    const data =
    await response.json();

    if (data.object === "error") {

        alert(
            `Card not found:\n${cardName}`
        );

        return;

    }

    version.sideboard.push({

        qty: 1,
        name: data.name,
        manaValue: data.cmc || 0,
        typeLine: data.type_line || ""

    });

} catch {

    alert(
        `Failed to lookup:\n${cardName}`
    );

    return;

}


    saveData();

    viewDeck(
        currentDeckId
    );

});

document
.getElementById(
    "addMaybeboardCardBtn"
)
?.addEventListener(
"click",
async function () {

    if (!currentDeckId) {
        return;
    }

    const cardName =
    prompt(
        "Card Name"
    );

    if (!cardName) {
        return;
    }

    const deck =
    decks.find(
        d =>
        d.id === currentDeckId
    );

    if (!deck) {
        return;
    }

    const version =
    deck.versions[
        deck.versions.length - 1
    ];

try {

    const response =
    await fetch(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
    );

    const data =
    await response.json();

    if (data.object === "error") {

        alert(
            `Card not found:\n${cardName}`
        );

        return;

    }

    version.maybeboard.push({

        qty: 1,
        name: data.name,
        manaValue: data.cmc || 0,
        typeLine: data.type_line || ""

    });

} catch {

    alert(
        `Failed to lookup:\n${cardName}`
    );

    return;

}


    saveData();

    viewDeck(
        currentDeckId
    );

});

document
.getElementById(
    "mainDeckSort"
)
?.addEventListener(
    "change",
    function () {

        mainDeckSort =
        this.value;

        if (
            currentDeckId
        ) {

            viewDeck(
                currentDeckId
            );

        }

    }
);

document
.getElementById(
    "editDeckBtn"
)
?.addEventListener(
    "click",
    editDeckDetails
);

document
.getElementById(
    "saveDeckChangesBtn"
)
?.addEventListener(
    "click",
    function () {

        const deck =
        decks.find(
            d => d.id === currentDeckId
        );

        if (!deck) {
            return;
        }

        deck.name =
        document.getElementById(
            "editDeckName"
        ).value;

        deck.commander =
        document.getElementById(
            "editCommander"
        ).value;

        deck.bracket =
        document.getElementById(
            "editBracket"
        ).value;

        deck.colours =
        document.getElementById(
            "editColours"
        ).value;

        deck.notes =
        document.getElementById(
            "editNotes"
        ).value;

        saveData();

        document.getElementById(
            "editDeckCard"
        ).style.display =
        "none";

        viewDeck(
            currentDeckId
        );

    }
);


render();