
// fonction qui envoie la requête à l'API avec la date qui change dans l'URL, définie la veille :

async function fetchWaterLevel2() {
    const reponse = await fetch("https://hubeau.eaufrance.fr/api/v1/hydrometrie/observations_tr?code_entite=M800001010&fields=resultat_obs&grandeur_hydro=H&size=1")
    const data = await reponse.json()
    const waterLvl = data.data[0].resultat_obs
    return waterLvl
}

async function fetchDate() {
    const reponse = await fetch("https://hubeau.eaufrance.fr/api/v1/hydrometrie/observations_tr?code_entite=M800001010&fields=date_obs&grandeur_hydro=H&size=1")
    const data = await reponse.json()
    const date = data.data[0].date_obs
    return date
}

// fonction qui affiche la donnée de l'API reçue dans l'HTML sur la règle, modifie la hauteur de la vague, lance l'animation et
// l'arrête :

async function main() {

    const waterlVl = await fetchWaterLevel2()
    const datelvl = await fetchDate()
    console.log(waterlVl) 
    console.log(datelvl)

    let stringdatelvl = `"${datelvl}"`
    let datepropre = dateFormated(stringdatelvl)
    let hourpropre = hourFormated(stringdatelvl)


    let reversedLvl = 8000 - waterlVl //car notre axe Y est inversé
    
    //modif dynamique des valeurs dans le CSS selon hauteur d'eau récupérée :
    document.querySelector(".Wave").style.top = ((reversedLvl *400) /8000) + "px" //hauteur de la wave
    document.querySelector(".seblecrab").style.top =  (((reversedLvl *400) /8000)+50) + "px" //colle le fond à la wave
    document.querySelector(".result").style.top = (((reversedLvl *400) /8000)-15) + "px" //hauteur des résultats


    // Partie animation :

    const waveElement = document.querySelector (".Wave")
    waveElement.classList.add("fill-animation")

    const sebElement = document.querySelector (".seblecrab")
    waveElement.classList.add("fill-animation")

    setTimeout(() => {
        waveElement.classList.remove("fill-animation");
        sebElement.classList.remove("fill-animation");
        waveElement.classList.add("end-animation");
        sebElement.classList.add("end-animation");
        }
        , 5000);           
        waveElement.addEventListener("transitionend", () => {
        document.getElementById("waterLevel").innerHTML = waterlVl + " mm, le " + datepropre + " à " + hourpropre;
        waveElement.classList.remove("end-animation");
        sebElement.classList.remove("end-animation");
        })
        
} 

// fonctions pour formater correctement la date et l'heure récupérées de l'API :

function dateFormated (date){
    let shortDate = date[9]+date[10]+date[8]+date[6]+date[7]+date[5]+date[1]+date[2]+date[3]+date[4]
    console.log(shortDate)
    return shortDate
}

function hourFormated (date){
    let shortHour = date[12]+date[13]+date[14]+date[15]+date[16]
    console.log(shortHour)
    return shortHour
}