async function fetchData() {
    console.log('Fetching JSON data...');
    try {
        const response = await fetch('./travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('Failed to fetch JSON data');
        }
        const data = await response.json();

        const inputField = document.querySelector('.inputContainer input');
        const searchButton = document.querySelector('.inputContainer button:first-of-type');
        const clearButton = document.querySelector('.inputContainer button:last-of-type');

        function getOrCreateResultsContainer() {
            let container = document.querySelector('.results-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'results-container';
                container.style = `position: fixed; top: 8rem; right: 2rem; max-height: 70vh; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; z-index: 20;`;
                document.body.appendChild(container);
            }
            return container;
        }

        function removeCard() {
            const container = document.querySelector('.results-container');
            if (container) container.remove();
        }

        function createCard(item) {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.style = `background: rgba(0,0,0,0.7); color: white; border-radius: 10px; padding: 1rem; max-width: 350px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); margin-bottom: 0;`;
            card.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" style="width:100%; border-radius: 10px; max-height: 180px; object-fit: cover;">
                <h2 style="margin: 0.5rem 0 0.25rem 0;">${item.name}</h2>
                <p style="margin-bottom: 0.75rem;">${item.description}</p>
                <button style="padding: 0.5rem 1rem; background: teal; color: white; border: none; border-radius: 5px; cursor: pointer;">Visit</button>
            `;
            return card;
        }

        searchButton.addEventListener('click', () => {
            const keyword = inputField.value.trim().toLowerCase();
            // Map variations to canonical keywords
            const keywordMap = {
                'beach': 'beaches',
                'beaches': 'beaches',
                'temple': 'temples',
                'temples': 'temples',
                'country': 'countries',
                'countries': 'countries',
                'city': 'cities',
                'cities': 'cities'
            };
            const canonical = keywordMap[keyword];
            let items = [];
            if (canonical === 'beaches' || canonical === 'temples') {
                items = data[canonical];
            } else if (canonical === 'countries') {
                items = data.countries.flatMap(country => country.cities || []);
            } else if (canonical === 'cities') {
                items = data.countries.flatMap(country => country.cities || []);
            }
            removeCard();
            if (items && items.length > 0) {
                const container = getOrCreateResultsContainer();
                items.forEach((item) => {
                    const card = createCard(item);
                    container.appendChild(card);
                });
            } else {
                removeCard();
                console.log('Invalid keyword. Please enter "beaches", "cities", or "temples".');
            }
        });

        clearButton.addEventListener('click', () => {
            inputField.value = '';
            removeCard();
        });
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

fetchData();
