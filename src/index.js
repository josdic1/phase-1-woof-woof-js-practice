
const init = () => {

    const dogBar = document.getElementById('dog-bar')
    const dogInfo = document.getElementById('dog-info')
    const goodDogFilter = document.getElementById('good-dog-filter')
    
    let filterToggle = false
    let dogList = []
    let selectedDog = {
    id: '',
    name: '',
    image: '', 
    isGoodDog: false
    }
    
    async function fetchDogs() {
       try {
          const r = await fetch(`http://localhost:3000/pups`)
       if(!r.ok) {
          throw new Error ('failed to fethc pups')
       }
          const data = await r.json()
          renderDogBar(data)
          dogList = data
       }catch(error) {console.error (error)}
    }
    fetchDogs()
    
    const renderDogBar = (dogs) => {
       const dogItems = dogs.map(dog => (
          `<span id='${dog.id}' class='dogItem'>${dog.name}</span>`
       ))
       dogBar.innerHTML = dogItems.join('')
    }
    
    async function updateDog(dog) {
    
       try {
          const r = await fetch(`http://localhost:3000/pups/${dog.id}`, {
             method: 'PATCH',
             headers: {
                'Content-Type': 'application/json'
             },
             body: JSON.stringify(dog)
          })
          if(!r.ok) {
             throw new Error ('huge error')
          }
          const data = await r.json()
          const updatedList = dogList.map(dog => 
             dog.id === data.id ? data : dog
          )
          fetchDogs()
       }catch(error) {console.error (error)}
    }
    
    dogBar.addEventListener('click', function (e) {
       const { id } = e.target
       selectedDog = dogList.find(dog => dog.id === id)
       const selectedDogInfo = `
       <img src="${selectedDog.image}" />
    <h2>${selectedDog.name}</h2>
    <button id='dogBtn' name ='${selectedDog.id}' >${selectedDog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
       `
       dogInfo.innerHTML = selectedDogInfo
    })
    
    dogInfo.addEventListener('click', function () {
       const dogObj = document.getElementById('dogBtn')
       const dogItem = dogObj.name
       const selDog = dogList.find(dog => dog.id === dogItem)
       const updatedDog = {
          ...selDog,
          isGoodDog: !selDog.isGoodDog
       }
       updateDog(updatedDog)
       dogObj.textContent = updatedDog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'
    }) 
    
    
    goodDogFilter.addEventListener('click', function () {
       filterToggle = !filterToggle
       let filteredList = []
       let text = goodDogFilter.textContent.split(": ")[0] + ":"
       if(filterToggle) {
          filteredList = dogList.filter(dog => dog.isGoodDog)
          goodDogFilter.textContent = text + " ON"
       } else {
          filteredList = dogList.filter(dog => dog)
          goodDogFilter.textContent = text + " OFF"
       }
       renderDogBar(filteredList)
    })
    
    }
    
    window.addEventListener("DOMContentLoaded", init)
    
    
    