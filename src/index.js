document.addEventListener('DOMContentLoaded', () => {

})

const dogTable = document.querySelector("table")
//console.log(dogTable)

fetch("http://localhost:3000/dogs")
.then(resp => resp.json())
.then(dogObjs => {
    console.log(dogObjs)
    dogObjs.forEach(dogObj => {addDogTableRow(dogObj)})
})

function addDogTableRow(Dog){
    let dogRow = document.createElement("tr")
    dogRow.innerHTML = `
    <td>${Dog.name}</td> <td>${Dog.breed}</td> <td>${Dog.sex}</td> <td><button id="edit-btn" data-id="${Dog.id}">Edit</button></td>
    `
    dogRow.dataset.id = Dog.id
    dogTable.append(dogRow)
}

const dogForm = document.querySelector("#dog-form")
dogTable.addEventListener("click", function(event){
    if (event.target.matches("#edit-btn")){
        let id = event.target.dataset.id
        fetch(`http://localhost:3000/dogs/${id}`)
        .then(resp => resp.json())
        .then(dogObj => {
            console.log(dogObj)
            fillDogForm(dogObj)
        })
    }

    

})

const fillDogForm = (dog) => {
    dogForm.innerHTML = `
          <input type="text" name="name" placeholder="" value="${dog.name}" />
          <input type="text" name="breed" placeholder="" value="${dog.breed}" />
          <input type="text" name="sex" placeholder="" value="${dog.sex}" />
          <input id="edit-sbmt" data-id="${dog.id}" type="submit" value="Submit" />
    `
}


dogForm.addEventListener("submit",function(event){
    event.preventDefault()
    if (event.target.name.value != ""){
        //console.log(event)

        updatedDog = {
            name: event.target.name.value,
            breed: event.target.breed.value,
            sex: event.target.sex.value
        }
        //console.log("newDog:",updatedDog)
        const submitButton = document.querySelector("#edit-sbmt")
        let id = submitButton.dataset.id
        console.log(id)
        fetch(`http://localhost:3000/dogs/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(updatedDog)  
        })
        .then(resp => resp.json())
        .then(newDog => {
            console.log(newDog)
            const dogRows = document.querySelectorAll("tr")
            dogRows.forEach((row) => {
                if(row.dataset.id == id){
                    row.innerHTML = `
                    <td>${newDog.name}</td> <td>${newDog.breed}</td> <td>${newDog.sex}</td> <td><button id="edit-btn" data-id="${id}">Edit</button></td>
                    `
                }
            })

        })
    }
})


