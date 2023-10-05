document.addEventListener('DOMContentLoaded', () => {
    fetchPups();
    document.getElementById('dog-bar').addEventListener('click', displayPupInfo);
    document.getElementById('good-dog-filter').addEventListener('click', toggleFilter);
});

let filter = false;

function fetchPups() {
    fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(pups => {
            renderPups(pups);
        });
}

function renderPups(pups) {
    const dogBar = document.getElementById('dog-bar');
    dogBar.innerHTML = '';  // Clear previous pups
    pups.forEach(pup => {
        if (!filter || pup.isGoodDog) {
            const pupSpan = document.createElement('span');
            pupSpan.textContent = pup.name;
            pupSpan.dataset.id = pup.id;
            dogBar.appendChild(pupSpan);
        }
    });
}

function displayPupInfo(event) {
    if (event.target.tagName === 'SPAN') {
        const pupId = event.target.dataset.id;
        fetch(`http://localhost:3000/pups/${pupId}`)
            .then(response => response.json())
            .then(pup => {
                const dogInfoDiv = document.getElementById('dog-info');
                dogInfoDiv.innerHTML = `
                    <img src="${pup.image}">
                    <h2>${pup.name}</h2>
                    <button data-id="${pup.id}">${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
                `;
                dogInfoDiv.querySelector('button').addEventListener('click', toggleGoodBad);
            });
    }
}

function toggleGoodBad(event) {
    const pupId = event.target.dataset.id;
    const newStatus = event.target.textContent === "Good Dog!" ? false : true;
    fetch(`http://localhost:3000/pups/${pupId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ isGoodDog: newStatus })
    })
    .then(response => response.json())
    .then(updatedPup => {
        event.target.textContent = updatedPup.isGoodDog ? "Good Dog!" : "Bad Dog!";
        if (filter) fetchPups();  // re-fetch pups to reflect changes in filter
    });
}

function toggleFilter(event) {
    filter = !filter;  // Toggle filter status
    event.target.textContent = filter ? "Filter good dogs: ON" : "Filter good dogs: OFF";
    fetchPups();
}
