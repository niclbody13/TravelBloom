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

        searchButton.addEventListener('click', () => {
            const keyword = inputField.value.toLowerCase();
            if (keyword === 'beaches' || keyword === 'temples') {
                console.log(`Relevant Data for "${keyword}":`, data[keyword]);
            } else if (keyword === 'cities') {
                const cities = data.countries.flatMap(country => country.cities);
                console.log('Relevant Data for "cities":', cities);
            } else {
                console.log('Invalid keyword. Please enter "beaches", "cities", or "temples".');
            }
        });
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

fetchData();
