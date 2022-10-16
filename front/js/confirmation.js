/***********************************************************
**      Confirmation de la commande via le formulaire     **
***********************************************************/

// Récupération des informations avec la méthode searchParams
let orderId = new URL(window.location.href).searchParams; //recherche de l'ID de la commande dans l'url
let id = orderId.get('orderId'); //récupération de l'id de commande

// Récupération des éléments du DOM
function getOrderNumber(){ //fonction pour afficher le numéro de commande
    let orderNumber = document.getElementById("orderId"); //variable pour considérer la balise html
    orderNumber.innerText = id; //et y insérer l'id
    localStorage.clear(); //puis vider le local storage
};
getOrderNumber(); //lancement de la fonction de confirmation