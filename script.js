const continentsArr = ['ASIA', 'AFRICA', 'AMERICA',  'EUROPE', 'OCEANIA']

const displayContainer = document.querySelector('.country__list')
const spin = document.querySelector('.spinner p')



function displayContinents() {
    const continents = document.getElementById('continents__lists')
    continents.textContent = ''

    continentsArr.forEach(cont => {
        const continentsList = document.createElement('li')
        continentsList.textContent = cont

        continentsList.addEventListener('click', function() {
            displayCountries(cont.toLocaleLowerCase())
        })
        continents.appendChild(continentsList)

    })
}
displayContinents()


async function displayCountries(continent) { 
    try {

        countryContainer.innerHTML = ''
        displayContainer.innerHTML = ''

        spin.style.display = 'block'

        const res = await fetch(`https://restcountries.com/v3.1/region/${continent}`)
        const countriesDisplay = await res.json()

        renderCountry(countriesDisplay)
        spin.style.display = 'none'

        if(!countriesDisplay) return
        console.log(countriesDisplay);     
        
  
    } catch (error) {
        console.log(error)
    
        spin.style.display = 'none'
    }
}


function renderCountry(countriesDisplay) {
    countriesDisplay.forEach(country => {
       
    const renderCountryList = document.querySelector('.country__list')

    const newDiv = document.createElement('div')

    const countryImage = document.createElement('img')
    countryImage.setAttribute('src', `${country.flags.png}`);
    newDiv.appendChild(countryImage)

    
    const countryName = document.createElement('p')
    countryName.textContent = country.name.common
    newDiv.appendChild(countryName)

    renderCountryList.appendChild(newDiv)

    newDiv.addEventListener('click', function(){
        renderCountryInfo(country.name.common)
    
    }) 
   })
}



const inputSearchButton = document.getElementById('btnSearch')
inputSearchButton.addEventListener('click', async function(event) {
    event.preventDefault()
    const searchBox = document.querySelector('.search__field')
    displayContainer.innerHTML = ''
    countryContainer.textContent= ''
    try {
        spin.style.display = 'block'
        const res = await fetch(`https://restcountries.com/v3.1/name/${searchBox.value}`)
        const data = await res.json()

        if(!data) return

        console.log(data)
        
        countryInfo(data[0])
        renderMap(data)


         spin.style.display = 'none'
         searchBox.value = ''
   
         
    } catch (error) {
        console.log(error);
        spin.style.display = 'none'
    }

})


async function renderCountryInfo(countries) {
    displayContainer.innerHTML = ''
    spin.style.display = 'block'
   
    try {

        const res = await fetch(`https://restcountries.com/v3.1/name/${countries}`)
        const data = await res.json()

        if(!data) return

        console.log(data)
        
        countryInfo(data[0])
        renderMap(data)

        spin.style.display = 'none'
    
       
         
    } catch (error) {
        console.log(error);
        spin.style.display = 'none'
    }
}


const countryContainer = document.querySelector('.countries')

function countryInfo(data) {
    
    const html = `
    
     <article class="country">
     <img class="country__img" src="${data.flags.png}" />
     <div class="country__data">
       <h3 class="country__name">${data.name.common}</h3>
       <h4 class="country__region">${data.region}</h4>
       <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
       <p class="country__row"><span>🗣️</span>${Object.keys(data.languages)[0]}</p>
       <p class="country__row"><span>💰</span>${Object.values(data.currencies).map(currency => currency.name)}</p>
     </div>
     </article>
     <div id="map"></div>
  
     `;
     countryContainer.insertAdjacentHTML('beforeend', html);
    //  countriesContainer.style.opacity = 1
  }


  function renderMap(data) {
    const latitude = data[0].capitalInfo.latlng[0]
    const longitude = data[0].capitalInfo.latlng[1]

    console.log(latitude,longitude);

    const coords = [latitude, longitude]

    const map = L.map('map').setView(coords, 13);

     L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  }