/***********************************************************
** Affichage d'un produit spécifique dans la page Produit **
***********************************************************/
// Extraction de l'ID avec les paramètres de l'URL
function getProductId(){ //fonction pour récupérer l'id du produit
  return new URL(location.href).searchParams.get("id"); //avec la méthode de récupération des paramètres d'url
}

// Récupération d'un produit en fonction de son ID
function getProduct(productId){ //fonction pour récupérer le produit avec en paramètre l'id du produit
  return fetch(`http://localhost:3000/api/products/${productId}`) //méthode fetch pour requêter l'API en ciblant l'id du produit
    .then(function(response){ //retour positif de la promesse
      return response.json(); //à retourner en format json
    })
    .then(function(products){ //alors lancer une fonction avec en paramètre le produit
      return products; //et retourner le produit
    })
    .catch(function(error){ //retour négatif de la promesse
      alert(error); //lancer une alerte erreur
    })
}

// Affichage d'un produit spécifique via la récupération de ses données json
function displayProduct(productData) { //fonction pour afficher le produit cliqué avec ses données en paramètres
  const {imageUrl, altTxt, name, price, description, colors}= productData; //constante pour définir un objet JS en fonction des données du produit
    getImage(imageUrl, altTxt); //récupération de l'image et l'alt du produit
    getTitle(name); //récupération du titre de la page qui sera le nom du produit
    getPrice(price); //récupération du prix du produit
    getDescription(description); //récupération de la description du produit
    getColors(colors); //récupération des variations de couleur du produit
}

// Récupération de l'image du produit par classe et insertion html
function getImage(imageUrl, altTxt) { //fonction pour afficher l'image
  let productImage = document.querySelector(".item__img"); //variable pour considérer la classe correspondante dans le html
    productImage.innerHTML = `<img src=${imageUrl}  alt=${altTxt} />`; //afficher l'image via ses données récupérées
}
  
// Récupération du nom du produit par ID et insertion html + title de la page
function getTitle(name) { //fonction pour afficher le titre de la page et le nom du produit
  let title = document.querySelector("title"); //variable pour considérer la balise correspondante dans le html
    title.innerHTML = name; //dans laquelle le nom du produit sera intégré
  let productName = document.querySelector("#title"); //variable pour considérer la balise correspondante dans le html
    productName.innerHTML = `<h1 id="title">${name}</h1>`; //dans laquelle le nom du produit sera intégré
}
  
// Récupération du prix du produit par ID et insertion html
function getPrice(price) { //fonction pour afficher le prix
  let productPrice = document.querySelector("#price"); //variable pour considérer la balise correspondante dans le html
    productPrice.innerHTML = `<span id="price">${price}</span>`; //dans laquelle le prix du produit sera intégré
}
  
// Récupération de la description du produit par ID et insertion html
function getDescription(description) { //fonction pour afficher la description
  let productDescription = document.querySelector("#description"); //variable pour considérer la balise correspondante dans le html
    productDescription.innerHTML = `<p id="description">${description}</p>`; //dans laquelle la description sera intégrée
}
  
// Récupération des variations de couleur du produit par ID et insertion html
function getColors(colors) { //fonction pour afficher les couleurs
  let productColor = document.querySelector("#colors"); //variable pour considérer la balise correspondante dans le html
    colors.forEach((color) => { //fonction exectuée pour chaque élement de l'array dans l'ordre d'index croissant
      productColor.insertAdjacentHTML( //intégration des couleurs dans le html
        "beforeend", //dans une position relative à l'intérieur de l'élément, avant le dernier enfant
        `<option value="${color}">${color}</option>` //selon les données du produit
      );
    });
}

// Auto-appel de la fonction : affichage de la page produit via un id de produit
(async function(){ //fonction asynchrone
  const productId = getProductId(); //constante pour définir que l'id du produit est celui fetché
  const product = await getProduct(productId); //constante pour définir que le produit est le résultat de la fonction await pour récupérer le produit selon son id
    displayProduct(product); //lancement de la fonction pour afficher le produit avec le produit récupéré
})()


/***********************************************************
**  Ajout du produit selectionné dans le local storage    **
***********************************************************/

// Récupération de la dernière couleur sélectionnée
function whatColor() { //fonction pour récupérer la couleur choisie
  const selectedColor = document.querySelector("#colors"); //en ciblant le <select> "color" dans le html
    selectedColor.addEventListener("change", (event) => { //et en écoutant l'évènement "change" sur la balise <select>
      selectedColor = event.target.value; //sachant que la couleur sélectionnée = la valeur de l'option du <select>
        if(selectedColor){ //si la couleur est bien sélectionnée
          return selectedColor; //on récupère sa valeur
        } else{ //sinon
          alert("Veuillez sélectionner une couleur."); //alerte pour prévenir de l'erreur
        }
    });
}

// Récupération de la dernière quantité sélectionnée
function whatQuantity() { //fonction pour récupérer la quantité choisie
  const selectedQuantity = document.querySelector("#quantity"); //en ciblant l'<input> "quantité" dans le html
    selectedQuantity.addEventListener("change", (event) => { //et en écoutant l'évènement "change" sur la balise <input>
      selectedQuantity = parseInt(event.target.value); //sachant que la quantité sélectionnée = la valeur de l'input (retournée en nombre entier)
      if((selectedQuantity != 0) || (selectedQuantity >100)){ //si la quantité n'est ni 0 ni supérieure à 100
       return selectedQuantity; //on récupère sa valeur
      } else{ //sinon
        alert("Veuillez choisir la quantité souhaitée (entre 1 et 100)") //alerte pour prévenir de l'erreur
      }
    });
}

// Activation du bouton d'ajout au panier
const btnClicked = document.querySelector("#addToCart"); //pour cibler le bouton "ajouter au panier"
  btnClicked.addEventListener("click", () => { //et écouter l'évènement sur son clic
    const selectedColor = document.querySelector("#colors").value; //considérant la valeur de la couleur sélectionnée 
    const selectedQuantity = document.querySelector("#quantity").value; //considérant la valeur de la quantité sélectionnée
    const productId = getProductId() //considérant l'ID du produit sélectionné
    const selectedProduct = { //création d'un objet avec les données du produit sélectionné
      id : productId, //son ID
      color : selectedColor, //sa couleur
      quantity : selectedQuantity //sa quantité
    };
    verifyInput(selectedProduct); //lancement de la fonction de vérification des inputs
  });

// Vérification des valeurs selectionnées
function verifyInput(selectedProduct) { //fonction pour vérifier la valeur des options sélectionnées selon l'objet du produit sélectionné
  if((selectedProduct.color == "") && (selectedProduct.quantity < 1 || selectedProduct.quantity > 100)){ //si problème de couleur et de quantité
    bothMissing() //appliquer la fonction relative aux problèmes de couleur + de quantité
  } else if (selectedProduct.color == "") { //ou si uniquement problème de couleur
    colorMissing(); //appliquer la fonction relative au problème de couleur
  } else if (selectedProduct.quantity < 1 || selectedProduct.quantity > 100) { //ou si uniquement problème de quantité
    quantityMissing(); //appliquer la fonction relative au problème de quantité
  } else { //sinon
    addToLS(selectedProduct) //lancer la fonction pour ajouter le produit selectionné dans le local storage
  }
}

// Ajout du produit au local storage et addition de la quantité si le produit est déjà présent
function addToLS(selectedProduct) { //fonction pour ajouter le produit selectionné au local storage
  let cart = JSON.parse(localStorage.getItem("selectedProduct")); //considérant le panier avec le contenu du local storage traduit en js avec JSON.parse
    if (cart == null) { //si le panier est vide
      cart = []; //mettre le contenu du panier dans un tableau
      cart.push(selectedProduct); //et y intégrer les données du produit selectionné
      localStorage.setItem("selectedProduct", JSON.stringify(cart)); //puis ranger le tout dans le local storage en version json
      newProductAdded(); //lancer la fonction pour prévenir le client que le produit a été ajouté
    } else { //sinon (si le panier n'est pas vide)
    const choseProduct = cart.find((productsInCart) => (selectedProduct.id == productsInCart.id) && (selectedProduct.color == productsInCart.color)); //méthode find pour savoir si le produit choisi existe déjà dans le ls (si même ID et même couleur)
    if (choseProduct) { //si le produit existe déjà
      const addSameProductQuantity = Number(selectedProduct.quantity) + Number(choseProduct.quantity); //variable pour additioner la quantité du produit choisi avec la quantité du produit selectionné (celui déjà présent dans le panier)
    if (addSameProductQuantity < 100){ //si le total des quantités additionnées est bien inférieur à 100 unités
      choseProduct.quantity = addSameProductQuantity; // remplacer la quantité par la nouvelle quantité
      localStorage.setItem("selectedProduct", JSON.stringify(cart)); //et ajouter le produit au local storage
      productQuantityUpdated(); //lancer la fonction pour prévenir le client que la quantité a été mise à jour
    } else { //sinon (si le même produit dépasse la quantité de 100 unités)
      maxQuantityExceeded(); //lancer la fonction pour prévenir que la quantité maximale est dépassée
    }
    } else { //sinon (si le produit n'existe pas encore dans le panier)
      cart.push(selectedProduct); //ajouter directement le produit au panier comme si le panier était vide
      localStorage.setItem("selectedProduct", JSON.stringify(cart)); //et au local storage au format json
      newProductAdded(); //lancer la fonction pour prévenir le client que le produit a été ajouté
    }
  }
} 

// Ajout des alertes pour indiquer à l'utilisateur les erreurs de selections
function bothMissing(){ //fonction pour alerter du problème de couleur + problème de quantité
  alert("Veuillez sélectionner une couleur et une quantité valable pour pouvoir continuer.");
}

function colorMissing(){ //fonction pour alerter du problème de couleur
  alert("Veuillez sélectionner une couleur pour pouvoir ajouter ce produit au panier.");
}

function quantityMissing(){ //fonction pour alerter du problème de quantité
  alert("Veuillez sélectionner une quantité valable (comprise entre 1 et 100).")
}

function maxQuantityExceeded(){
  alert("Vous avez dépassé la quantité maximale disponible pour ce produit")
}

function newProductAdded(){ //alerte pour dire que le produit a bien été ajouté au panier
  alert("Votre produit a bien été ajouté au panier")
}

function productQuantityUpdated(){ //alerte pour dire que la quantité du produit a bien été mise à jour
  alert("La quantité de votre produit a bien été mise à jour dans le panier")
}