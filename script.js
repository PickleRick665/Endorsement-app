import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://shopping-cart-e4268-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListinDB = ref(database,"endorsements")

const endorsementListParentElement = document.getElementById("endorsement-list-parent-element")
const publishButtonEl = document.getElementById("publish-button-id")
const textAreaEl = document.getElementById("text-area-el")
const fromEl = document.getElementById("from-el")
const toEl = document.getElementById("to-el")

onValue(endorsementListinDB, function(snapshot){
    if(snapshot.exists() === false) {
        endorsementListParentElement.innerHTML = "No endorsements here... yet"
        console.log("no endorsements")
    }

    else{
        let endorsementArray = Object.entries(snapshot.val()) // 2 arrays [[1, somebody...],[2, I aint....]]
        
        clearEndorsementList()

        for(let i=endorsementArray.length-1; i>=0; i--){
            let currentEndorsement = endorsementArray[i] //[1, somebody...]
            let currentEndorsementID = currentEndorsement[0]// [1]
            let currentEndorsementObject = currentEndorsement[1]// [somebody...]
            
            appendToEndorsementList(currentEndorsementObject,currentEndorsementID)
            console.log(currentEndorsementID)

            
        }
    }
})

function appendToEndorsementList(currentEndorsement,currentEndorsementID) {
    //--> create list
    const newEndorsementElement = document.createElement("li")
    newEndorsementElement.setAttribute("class","endorsementElement")
    endorsementListParentElement.appendChild(newEndorsementElement)
    //<-- create list 

    //-->create and append element that contains "TO"
    const endorsementTo = document.createElement("div")
    endorsementTo.setAttribute("class","toInsideEndorsement")
    endorsementTo.innerHTML = `To ${currentEndorsement.to}`
    newEndorsementElement.appendChild(endorsementTo)
    //<--create and append element that contains "TO"
    
    
    //-->create and append div that contains the message
    const endorsementMessage = document.createElement("div")
    endorsementMessage.innerHTML = `${currentEndorsement.message}`
    newEndorsementElement.appendChild(endorsementMessage)
    //<--create and append div that contains the message
    
    //-->create delete button inside list
    const deleteButtonInsideList = document.createElement("button")
    deleteButtonInsideList.innerText = "delete"

    //newEndorsementElement.appendChild(deleteButtonInsideList)
    //<--create delete button inside list


    //-->create and append element that contains "FROM"
    const endorsementFrom = document.createElement("div")
    endorsementFrom.setAttribute("class","fromInsideEndorsement")
    endorsementFrom.innerHTML = `From ${currentEndorsement.from}`
    newEndorsementElement.appendChild(endorsementFrom)
    //<--create and append element that contains "FROM"
    
    


    deleteButtonInsideList.addEventListener("dblclick", function(){
        remove(ref(database,`endorsements/${currentEndorsementID}`))
        console.log("clicked!")
    })
}

function clearEndorsementList() {
    endorsementListParentElement.innerHTML = " "
}

publishButtonEl.addEventListener("click", function(){

    let endorsement_with_likes_from_and_to = {
        from: "",
        message: "",
        to: "",
        likes: 0
    }

    endorsement_with_likes_from_and_to.message = textAreaEl.value
    endorsement_with_likes_from_and_to.from = fromEl.value
    endorsement_with_likes_from_and_to.to = toEl.value

    console.log(endorsement_with_likes_from_and_to)

    if(textAreaEl.value !== ""){
         push(endorsementListinDB, endorsement_with_likes_from_and_to)
         clearTextArea(textAreaEl)
         clearTextArea(fromEl)
         clearTextArea(toEl)
    }

    else{
        console.log("can't publish nothing")
    }
    
})

function clearTextArea(inputElement) {
    inputElement.value = ""
}