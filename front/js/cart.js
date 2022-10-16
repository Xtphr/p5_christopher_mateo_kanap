/***********************************************************
**   Affichage des produits sélectionnés dans le panier   **
***********************************************************/

// Récupération du contenu du local storage pour l'afficher sur la page panier
let LSContent = JSON.parse(localStorage.getItem("selectedProduct")); //variable pour définir le contenu du local storage
async function displayCart(){ //fonction asynchrone pour ajouter au panier les produits
  if(LSContent){ //si le contenu du local storage est true
    let totalAmount = 0; //considérer le montant initial de zéro
    for (let selectedProduct of LSContent){ //boucle pour parcourir l'array via le local storage
      let productsInLS ={ //création de la variable qui va regrouper en objet les élements du local storage
        id : selectedProduct.id, //id du produit
        color: selectedProduct.color, //couleur du produit
        quantity: selectedProduct.quantity //quantité du produit
      }
      fetch('http://localhost:3000/api/products/' + productsInLS.id) //fonction fetch pour récupérer les données de l'API
      .then(function(response){ //si réponse est true
        return response.json(); //convertir les données en format JS
      })
      .then(function(selectedProduct) { //et affichage des éléments du DOM en intégrant le html
        console.log({selectedProduct})
        const section = document.querySelector("#cart__items"); //variable pour impliquer la <section id="cart__items">
                
        // Création html de l'article produit
        let article = document.createElement('article'); //création de la balise <article>
        article.className = 'cart__item'; //ajout de la class="cart__item"
        article.dataset.id = productsInLS.id; //ajout de l'id du produit selectionné en LS
        article.dataset.color = productsInLS.color; //ajout de la couleur du produit selectionné en LS
        section.appendChild(article); //insertion de l'article dans la section

        let divImg = document.createElement('div'); //création de la balise <div> pour l'image
        divImg.className = 'cart__item__img'; //ajout de la class="cart__item__img"
        article.appendChild(divImg); //insertion de la div dans l'article

        let img = document.createElement('img'); //création de la balise <img>
        img.src = selectedProduct.imageUrl; //ajout de la source du produit selectionné en LS
        img.alt = selectedProduct.altTxt; //ajout du texte alternatif du produit selectionné en LS
        divImg.appendChild(img); //insertion de l'image dans la div img

        let divContent = document.createElement('div'); //création de la balise <div> pour le contenu
        divContent.className = 'cart__item__content'; //ajout de la class="cart__item__content"
        article.appendChild(divContent); //insertion de la div contenu dans l'article

        let divDescription = document.createElement('div'); //création de la balise <div> pour la description
        divDescription.className = 'cart__item__content__description'; //ajout de la class="cart__item__content__description"
        divContent.appendChild(divDescription); //insertion de la div description dans la div contenu

        let title = document.createElement('h2'); //création de la balise <h2>
        title.innerText = selectedProduct.name; //dont le titre sera le nom du produit selectionné dans le LS
        divDescription.appendChild(title); //insertion du <h2> dans la div description

        let descriptionColor = document.createElement('p'); //création du <p> pour la couleur
        descriptionColor.innerText = productsInLS.color; //dont le contenu sera la couleur du produit selectionné dans le LS
        divDescription.appendChild(descriptionColor); //insertion du <p> couelur dans la <div> description

        let descriptionPrice = document.createElement('p'); //création du <p> pour le prix
        descriptionPrice.innerText = selectedProduct.price + " €"; //dont le contenu sera le prix du produit selectionné dans le LS
        divDescription.appendChild(descriptionPrice); //insertion du <p> prix dans la <div> description

        let divSettings = document.createElement('div'); //création de la balise <div> pour les paramètres
        divSettings.className = 'cart__item__content__settings'; //ajout de la class="cart__item__content__settings"
        divContent.appendChild(divSettings); //insertion de la <div> paramètres dans la <div> du contenu

        let quantitySettings = document.createElement('div'); //création de la balise <div> pour la quantité
        quantitySettings.className = 'cart__item__content__settings__quantity'; //ajout de la class="cart__item__content__settings__quantity"
        divSettings.appendChild(quantitySettings); //insertion de la <div> quantité dans la <div> paramètres

        let quantitySettingsParagraph = document.createElement('p'); //création de la balise <p> pour la quantité
        quantitySettingsParagraph.value = productsInLS.quantity; //dont la valeur sera celle de la quantité déjà présente du produit selectionné dans le LS        
        quantitySettingsParagraph.innerText = "Qté : "; //ajout du text pour cibler la quantité
        quantitySettings.appendChild(quantitySettingsParagraph); //insertion du <p> quantité dans la <div> paramètres

        let quantityInput = document.createElement('input'); //création de la balise <input>
        quantityInput.className ='itemQuantity'; //ajout de la class="itemQuantity"
        quantityInput.type = "number"; //ajout de l'attribut type=nombre
        quantityInput.name = "itemQuantity"; //ajout de l'attribut nom="itemQuantity"
        quantityInput.min = 1 ; //ajout de l'attribut min=1
        quantityInput.max = 100; //ajout de l'attribut max=100
        quantityInput.value = productsInLS.quantity; //dont la valeur sera celle de la quantité du produit selectionné dans le LS
        quantitySettings.appendChild(quantityInput); //insertion de l'<input> dans la <div> paramètres
                      
        // Modification d'un produit du local storage sur la page panier
        quantityInput.addEventListener("change", (event) => { //ajout d'un eventlistener sur le changement de l'input quantité
          event.preventDefault(); //ne pas affecter la valeur initiale si aucune modification
          let modifyId = productsInLS.id; //variable pour récupérer l'id du produit stocké dans le local storage
          let modifyColor = productsInLS.color; //variable pour récupérer la couleur du produit stocké dans le lcoal storage
          let modifyProduct = LSContent.find((initial) => initial.id == modifyId) && LSContent.find((initial) => initial.color == modifyColor); //méthode find pour comparer les id et les couleurs après éventuelle modification
          if(modifyProduct){ //si le produit modifié est exactement présent dans le LS (même id/ même couleur)
            modifyProduct.quantity = Number(quantityInput.value); //prendre en compte la nouvelle value de l'input en format nombre
            if(modifyProduct.quantity >100){ //si supérieure à 100
              alert("La quantité maximale valable pour ce produit est de 100 unités.") //alerte erreur
            } else if (modifyProduct.quantity <=0){ //si inférieur ou égal à 0
              alert("Erreur de saisie ! La quantité doit être comprise entre 1 et 100.") //alerte erreur
            } else{
            localStorage.setItem("selectedProduct", JSON.stringify(LSContent)); //et mettre à jour l'array du local storage en format json
            alert("La quantité de votre produit a bien été mise à jour."); //alerte pour confirmer au client la modification de quantité du produit
            }
          } else { //sinon (si le produit n'a pas été modifié)
            LSContent.push(selectedProduct); //ajouter le produit à la suite du tableau
            localStorage.setItem("selectedProduct", JSON.stringify(LSContent)); //dans le local storage en format json
          }
          document.location.reload(); //méthode reload pour actualiser la page et mettre à jour les données
        });

        // Suppression d'un produit du local storage depuis la page panier
        let deleteDiv = document.createElement('div'); //création de la balise <div> pour le bouton "supprimer"
        deleteDiv.className = 'cart__item__content__settings__delete'; //ajout de la class="cart__item__content__settings__delete"
        divSettings.appendChild(deleteDiv); //insertion de la <div> bouton dans la <div> paramètres

        let deleteDivParagraph = document.createElement('p'); //création de la balise <p> pour l'intitulé du bouton
        deleteDivParagraph.className = 'deleteItem'; //ajout de la class="deleteItem"
        deleteDivParagraph.innerText = "Supprimer"; //dont le contenu est le mot "supprimer"
        deleteDiv.appendChild(deleteDivParagraph); //insertion du <p> supprimer dans la <div> bouton

        deleteDivParagraph.addEventListener("click", (event) => { //ajout d'un eventlistener sur le clic du bouton supprimer
          event.preventDefault(); //ne rien faire si il n'est pas cliqué
          let deleteId = productsInLS.id; //variable pour associer l'id de l'élement à supprimer à celui du local storage
          let deleteColor = productsInLS.color; //variable pour associer la couleur de l'élément à supprimer à celle dans dans le local storage
          let deleteItem = LSContent.filter (initial => initial.id != deleteId || initial.color != deleteColor); //utilisation de la méthode filter pour chercher l'élément qu'on veut supprimer en fonction de son id et de sa couleur
          event.target.closest('.cart__item').remove(); //suppression de la balise <article>
          localStorage.setItem("selectedProduct", JSON.stringify(deleteItem)); //mise à jour du local storage avec le produit supprimé
          alert("Cet article a bien été supprimé de votre panier."); //alerte pour confirmer au client la suppression du produit
          document.location.reload(); //actualisation de la page avec méthode reload
        });
                  
        // Calcul du montant total
        let totalPrice = document.querySelector('#totalPrice'); //variable pour considérer l'id de l'input html
        totalAmount += quantityInput.value * selectedProduct.price; //calcul pour indiquer que le montant total = valeur de l'input x le prix du produit
        totalPrice.innerText = totalAmount; //affichage du prix à payer après calcul
      });
    };     
  } else { //si le contenu du local storage est vide
    alert("Votre panier est vide !"); //alerte pour informer le client que le panier est vide
  } 
};

// Lancement de la fonction pour afficher le contenu du panier
displayCart();

// Fonction pour calculer le montant total du panier
function calculTotals(){
  if(LSContent){ //si le contenu du local storage est true
    let totalQuantity = LSContent; //il déterminera la quantité totale des produits
    let totalProducts = document.querySelector('#totalQuantity'); //variable pour cibler l'affichage html de la quantité totale
    let totalItems = 0; //nombre d'article initial de zéro
    for (let selectedProduct of totalQuantity){ //pour chaque produit du contenu du local storage
      totalItems += Number(selectedProduct.quantity); //ajout en nombre de la quantité présente pour tous les éléments du local storage
    }
  totalProducts.textContent = totalItems; //et affichage sur la page
  } 
};

// Lancement de la fonction pour calculer les quantités
calculTotals();

/***********************************************************
**       Validation de la commande via le formulaire      **
***********************************************************/

// Variables pour définir les regex
const regexEmail = new RegExp ("^[a-z0-9._-]+[@]{1}[a-z0-9._-]+[.]{1}[a-z]{2,10}$", "g"); //regex email : chiffres, lettres, min.1 @, suivi de min.1 point, suivi de min.2 lettres
const regexAddress = new RegExp ("^[0-9a-z A-Z,.'-çñâàäéèêëïîìôöòüùû ]{5,100}$", "g"); //regex adresse : chiffres, lettres, accents, ponctuation limitée, min.5 max.100c
const regexText = new RegExp ("^[A-Za-zÀ-ÖØ-öø-ÿ-' ]{2,}$"); //regex texte (prenom, nom, ville) : lettres, accents, tirets, apostrophes, espaces, min.2c

// Variables pour cibler les éléments html des inputs
let firstName = document.querySelector("#firstName"); //input prénom
let lastName = document.querySelector("#lastName"); //input nom
let address = document.querySelector("#address"); //input adresse
let city = document.querySelector("#city"); //input ville
let email = document.querySelector("#email"); //input email

// Variables pour cibler les éléments html des sous-inputs
const firstNameStatus = document.querySelector("#firstNameErrorMsg"); //sous-message prénom
const lastNameStatus = document.querySelector("#lastNameErrorMsg"); //sous-message nom
const addressStatus = document.querySelector("#addressErrorMsg"); //sous-message adresse
const cityStatus = document.querySelector("#cityErrorMsg"); //sous-message ville
const emailStatus = document.querySelector("#emailErrorMsg"); //sous-message email

// Validation de l'input prénom
firstName.addEventListener("change", function(){ //écoute de l'événement change sur l'input prénom
  let inputValue = this.value; //variable pour définir que la valeur de l'input est la valeur change du champ
  firstNameValidation(inputValue); //lancement de la fonction de validation
});
let firstNameValidation = function(inputFirstName){ //fonction pour vérifier l'input prénom
  let firstNameTest = regexText.test(inputFirstName); //méthode test pour vérifier le match de la regex
  if(firstNameTest){ //si true
    firstNameStatus.innerText = "Saisie valide."; //affichage d'un small saisie valide
    firstNameStatus.setAttribute("style", "color:green"); //en vert
    return true; //et retourner true
  } else { //sinon
    firstNameStatus.innerText = "Veuillez saisir un prénom correct. (Minimum 2 caractères, chiffres et symboles spéciaux interdits)"; //small saisie invalide
    firstNameStatus.setAttribute("style", "color:red"); //en rouge
    return false; //et retourner false
  }
};

// Validation de l'input Nom
lastName.addEventListener("change", function(){ //écoute de l'événement change sur l'input nom
  let inputValue = this.value; //variable pour définir que la valeur de l'input est la valeur change du champ
  lastNameValidation(inputValue); //lancement de la fonction de validation
})
let lastNameValidation = function(inputLastName){ //fonction pour vérifier l'input nom
  let lastNameTest = regexText.test(inputLastName); //méthode test pour vérifier le match de la regex
  if(lastNameTest){ //si true
    lastNameStatus.innerText = "Saisie valide."; //affichage d'un small saisie valide
    lastNameStatus.setAttribute("style", "color:green"); //en vert
    return true; //et retourner true
  } else { //sinon
    lastNameStatus.innerText = "Veuillez saisir un prénom correct. (Minimum 2 caractères, chiffres et symboles spéciaux interdits)"; //small saisie invalide
    lastNameStatus.setAttribute("style", "color:red"); //en rouge
    return false; //et retourner false
  }
};

// Validation de l'input adresse
address.addEventListener("change", function(){ //écoute du change sur l'input adresse > lancement de la fonction addressValidation
  let inputValue = this.value; //variable pour définir que la valeur de l'input est la valeur change du champ
  addressValidation(inputValue); //lancement de la fonction de validation
})
let addressValidation = function(inputAddress){ //création de la fonction addressValidation
  let addressTest = regexAddress.test(inputAddress); //méthode test pour vérifier le match de la regex
  if (addressTest){ //si true
    addressStatus.innerText = "Saisie valide."; //small saisie valide
    addressStatus.setAttribute("style", "color:green"); //en vert
    return true; //et retourner true
  } else{ //sinon
    addressStatus.innerText = "Veuillez renseigner une adresse correcte. (Minimum 5 caractères, symboles spéciaux interdits)" //small saisie invalide
    addressStatus.setAttribute("style", "color:red"); //en rouge
    return false; //et retourner false
  }
};

// Validation de l'input ville
city.addEventListener("change", function(){ //écoute du change sur l'input ville > lancement de la fonction cityValidation
  let inputValue = this.value; //variable pour définir que la valeur de l'input est la valeur change du champ
  cityValidation(inputValue); //lancement de la fonction de validation
})
let cityValidation = function(inputCity){ //création de la fonction cityValidation
  let cityTest = regexText.test(inputCity); //méthode test pour vérifier le match de la regex
  if(cityTest){ //si true
    cityStatus.innerText = "Saisie valide."; //small saisie valide
    cityStatus.setAttribute("style", "color:green"); //en vert
    return true; //et retourner true
  } else { //sinon
    cityStatus.innerText = "Veuillez saisir une ville correcte. (Minimum 2 caractères, chiffres et symboles spéciaux interdits)"; //small saisie invalide
    cityStatus.setAttribute("style", "color:red"); //en rouge
    return false; //et retourner false
  }
};

// Validation de l'input email
email.addEventListener("change", function(){ //écoute du change sur l'input email > lancement de la fonction emailValidation
  let inputValue = this.value; //variable pour définir que la valeur de l'input est la valeur change du champ
  emailValidation(inputValue); //lancement de la fonction de validation
})
let emailValidation = function(inputEmail){ //création de la fonction emailValidation
  let emailTest = regexEmail.test(inputEmail); //méthode test pour vérifier le match de la regex
  if (emailTest){ //si true
    emailStatus.innerText = "Saisie valide."; //small saisie valide
    emailStatus.setAttribute("style", "color:green"); //en vert
    return true; //et retourner true
  } else { //sinon
    emailStatus.innerText = "Veuillez renseigner une adresse-email correcte."; //small saisie invalide
    emailStatus.setAttribute("style", "color:red"); //en rouge
    return false; //et retourner false
  }
};

/***********************************************************
**     Envoi des données renseignées via le formulaire    **
***********************************************************/

let orderButton = document.querySelector("#order"); //variable pour cibler l'élément html du bouton "commander"

orderButton.addEventListener('click', (event) =>{ //écoute de l'évènement click sur le bouton "commander"
  event.preventDefault(); //ne rien faire par défaut
  let firstName = document.querySelector("#firstName").value; //variable pour définir le prénom saisi
  let lastName = document.querySelector("#lastName").value; //variable pour définir le nom saisi
  let address = document.querySelector("#address").value; //variable pour définir l'adresse saisie
  let city = document.querySelector("#city").value; //variable pour définir la ville saisie
  let email = document.querySelector("#email").value; //variable pour définir l'email saisi

  if(!LSContent){ //si il n'y a rien dans le local storage
    alert("Désolé, votre panier est vide !") //alerte panier vide
  } else if (firstName ==="" || lastName ==="" || address ==="" ||city ==="" ||email ===""){ //sinon si champ vide
    alert("Merci de renseigner tous les champs du formulaire avant de valider votre commande."); //alerte erreur
  } else if ((firstNameValidation(firstName) == false) || (lastNameValidation(lastName) == false) || (addressValidation(address) == false) || (cityValidation(city) == false) || (emailValidation(email) == false)){ //sinon si champ invalide
    alert ("Merci de corriger les erreurs de saisie dans le formulaire avant de valider votre commande."); //alerte erreur
  } else { //sinon si panier complet
    let cart = []; //création du tableau panier
    for (let product of LSContent){ //et pour chaque produit contenu dans le ls
      cart.push(product.id) //l'insérer dans le tableau
    };
    let myOrder ={ //puis création d'un objet pour l'envoi de la demande
      contact : { //avec le contact du client
        firstName : firstName,
        lastName : lastName,
        address : address,
        city : city,
        email : email
      },
      products : cart //et le contenu de sa commande
    };
    fetch('http://localhost:3000/api/products/order', { //fetch pour requêter l'API
      method: 'POST', //en méthode post
      headers: { //avec un contenu json
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(myOrder) //contenu de la commande en json
    })
    .then((response) => response.json()) //puis recevoir la réponse en json
    .then((data)=>{ //et avec ces données
      document.location.href = "confirmation.html?orderId=" + data.orderId; //redirection vers page confirmation avec l'id en url
    })       
    .catch ((e) => alert("Un problème est survenu. Merci de contacter notre support technique.")); //alerte erreur pour catcher le rejected de la promesse
  };   
});