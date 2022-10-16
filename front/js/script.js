/*********************************************************
** Affichage de tous les produits sur la page d'accueil **
*********************************************************/

// Récupération des produits via API (en format .json)
function getProducts(){ //fonction pour récupérer les produits
  
  return fetch("http://localhost:3000/api/products") //utilisation de la méthode fetch pour requêter l'API
    .then(function(response){ //retour positif de la promesse
      return response.json(); //à retourner en json
    })
    .then(function(products){ //alors lancer une fonction avec en paramètre le produit
      return products; //à retourner
    })
    .catch(function(error){ //retour négatif de la promesse
      alert(error); //lancer une alerte erreur
    })
}

// Affichage de tous les produits de l'API sous forme d'<article> HTML
function displayProduct(jsonProduct){ //fonction pour afficher les produits
  document.getElementById("items").innerHTML += //sélection du noeud items pour y insérer les produits via le html et leur id
  `<a href="./product.html?id=${jsonProduct._id}">
    <article>
      <img src="${jsonProduct.imageUrl}" alt="${jsonProduct.altTxt}">
      <h3 class="productName">${jsonProduct.name}</h3>
      <p class="productDescription">${jsonProduct.description}</p>
    </article>
  </a>`;
}

// Boucle for...of qui parcourt la liste de tous les produits
async function main(){ //fonction principal asynchrone
  const products = await getProducts(); //qui attend la récupération des produits pour s'exécuter
  for(product of products){ //et qui pour chaque produit de la liste des produits
    displayProduct(product); //l'affichera
  }
}

main(); //lancement de la fonction principale