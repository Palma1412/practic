const loginName = document.getElementById('loginName')
const buttonLogin = document.getElementById('buttonLogin')

buttonLogin.addEventListener('click',  () => {
    try{
        const response = fetch('', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login: loginName.value})
        })

        if(!response.ok) {
            throw new Error("Ошибка входа")
        }
        
         window.location.href = "index.html";
    }catch(error) {
        console.log(error)
    }
})

