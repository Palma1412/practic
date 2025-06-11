const registerLink = document.getElementById('register')
const nameRegister = document.getElementById('name')
const surnameRegister = document.getElementById('surname')
const patronymicRegister = document.getElementById('patronymic')
const yearRegister = document.getElementById('year')
const loginRegister = document.getElementById('login')






registerLink.addEventListener('click',  async () => {
    const data = [
    {
        name: nameRegister.value, 
        surname: surnameRegister.value, 
        patronymic: patronymicRegister.value,  
        year: Number(yearRegister.value), 
        login: loginRegister.value,
    }
    ]

    console.log(data)

    window.location.href = 'signup.html';

    // try {
    //     const response = fetch('', {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(data)
    //     });

    //     if(!response.ok) {
    //         throw new Error(`HTTP error! Status: ${response.status}`)
    //     }

    //     const result = await response.json()
    //     console.log("Success: ", result)

    // }catch(error) {
    //     console.log(error)
    // }   
})