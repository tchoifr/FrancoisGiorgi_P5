const queryString = window.location.search;
console.log()
const urlParams = new URLSearchParams(queryString);
let idArticle = urlParams.get('id');
let page = urlParams.get('page')
let product = [];
const panier = [];

// appel Url

fetch('http://localhost:3000/api/cameras')
  .then(function(res) {   
    if (res.ok) {
      return res.json();
    }
  })
  //document dans Url
  .then(function(value) { 
    console.log('tableau product :', value);
   /* if(page){
      afficherDescription(value);
    }
    else{
      afficherArticle(value);
      product = value
      
    }   */
   //recuperation de L'API
product=value
 //voir les pages
    switch (page) {

      case 'description':
       afficherDescription(value);
        break;
      case 'panier':
        afficherPanier()
        break;
      default:
       afficherArticle(value);
       
    }
    
    return value
  
  })
  // si ya une erreur
  .catch(function(err) {
    console.log(err);
     // alert('la requette http introuvable')
  });

//affiche les article envoyer par l'API

  function afficherArticle(article){
    let contenueHtml= '';
    for(let i=0;i<article.length; i++){
      contenueHtml += `
      <tr id="tableauArticle">
          <td><img src=${article[i].imageUrl} class ="img-fluid imgTaille img-responsive img-thumbnail w-50"></td>
          <td class="w-25">${article[i].name}</td>
          <td class="w-25">${article[i].price}€</td>
          <td class="w-20"> <a href='produit.html?id=${article[i]._id}&page=description'> <button class="btn btn-outline-primary">Details</button></a></td>
          <td class="w-25 text-center"> <button  class="background" onclick="ajouterPanier(${i},'${article[i]._id}')"><i class="fas fa-cart-arrow-down"></i></button> </td>
         </tr>`
    }
 
document.getElementById('productList').innerHTML = contenueHtml
  }




  //local storage panier en cash
function ajouterPanier(position,id){
// je verifie que le localStorage existe
if (JSON.parse (localStorage.getItem("panierLocalStorage"))){
  this.panier = JSON.parse (localStorage.getItem("panierLocalStorage"));
}
// sinon j'initialise
else {
  this.panier = []
}




for(let i=0;i<this.panier.length; i++){
  // si ya deja un article avec le meme ID alor quantité + 1
    if(id===this.panier[i]._id){
      console.log('tableau panier IF: ', this.panier[i])
      this.panier[i]['quantités']+=1;
      localStorage.setItem("panierLocalStorage",JSON.stringify(this.panier));
      alert('Article ajouter au panier');
      //selection element dont l'ID et (quantitesTableau)
      document.getElementById('quantitesTableau').innerHTML= this.panier[position]['quantités']

      return;
    }

}
// si il y a pas d'article avec le meme Id alor cree la ligne article
let positionPush = this.panier.push (product[position]);
this.panier[positionPush-1]['quantités']=1;
  localStorage.setItem("panierLocalStorage",JSON.stringify(this.panier));
  alert('Article ajouter au panier');
 
 //prix total
 if (page === 'panier'){
 let prixTotal=Number(document.getElementById('validePanier').textContent) ;
 prixTotal += this.panier[position].price
  //selection element dont l'ID et (validePanier)
  
  
 document.getElementById('validePanier').innerHTML = prixTotal;
 console.log(document.getElementById('validePanier').textContent);

}

}


 //Supprimer panier
function supprimerPanier(position){
 

//si la quantités et = a 1 alors suprime la ligne
if(this.panier[position]['quantités']===1){
  this.panier.splice(position,1)
  document.getElementById('tableauArticle'+ position).remove()
}
// reduction de la quantité de 1 a chaque click

this.panier[position]['quantités']-=1;
  console.log(this.panier)
  localStorage.setItem("panierLocalStorage",JSON.stringify(this.panier))
  document.getElementById('quantitesTableau').innerHTML= this.panier[position]['quantités']

alert('Article supprimer');
//supprimer affichage de mon tableauArticle avec la position
}


//afficher panier
function afficherPanier(){ 
this.panier=JSON.parse (localStorage.getItem("panierLocalStorage"))
console.log('tableurpanier :',this.panier)
let listOfProducts = '';
let prixTotalPanier = 0;
  for(let i=0;i<this.panier.length; i++){//parcour du tableau panier
    // ajout des prix
  prixTotalPanier += this.panier[i].price ;
    
   
    listOfProducts += `
      <tr id="tableauArticle${i}">
          <td><img src=${this.panier[i].imageUrl} class ="img-fluid imgTaille img-responsive img-thumbnail w-25"></td>
          <td id="quantitesTableau" class="w-10"> ${this.panier[i].quantités}Qts</td>
          <td class="w-15">${this.panier[i].name}</td>
          <td class="w-15">${this.panier[i].price}€</td>
          <td class="w-15"> <a href='produit.html?id=${this.panier[i]._id}&page=description'> <button class="btn btn-outline-primary">Details</button></a></td>
          <td class="w-15 text-center"> <button  class="background" onclick="ajouterPanier(${i},'${this.panier[i]._id}')"><i class="fas fa-plus"></i></button> </td>
          <td class="w-15 text-center"> <button  class="background" onclick="supprimerPanier(${i})"><i class="fas fa-minus"></i></button> </td>       
         </tr>   
         `  
      
  } 
   listOfProducts+=`
        <div id="butonValiderCommande" class="row">
        <button  class="btn btn-outline-primary col-md-4">Validé Commande</button>
        <div id="validePanier" class="col-6">
 ${prixTotalPanier}
        </div>
        </div>
        `
  //cree un element


 

 //affiche productlist Html
  document.getElementById('productListPanier').innerHTML = listOfProducts
}
  //Declaration de la variable pour pouvoir y mettre les prix qui sont dans le panier
 /* let prixTotalPanier = [];

  //allez chercher les prix dans le panier
  for (let i = 0; i <prixTotalPanier.length; i++) {
     prixTotalPanier = panierLocalStorage[i].price

    //mettre les prix du panier dans la variable 
    panierLocalStorage.push(prixProduitsDansLePanier)

    console.log(prixTotalPanier)
  }
//additionner les prix de la variable prixTotalPanier
const reducer = (accumulator , currentValue) => accumulator + currentValue
const prixTotal = prixTotalPanier.reduce(reducer,0);



`

//injection html dans la page panier
prixProduitsDansLePanier.innerHTML("beforeend",affichePrixHtml)
*/

//fonction afficherDescription 
  function afficherDescription(article){
     let listOfProducts = '';
    for(let i=0; i<article.length; i++){
      console.log('boucle for ',idArticle)
      console.log(article[0])
      
      if(article[i]._id===idArticle){
        //html description
        listOfProducts += `
        
      <div id="tableauArticle${i}" class="row">
        <div class="col-6 "><img src=${article[i].imageUrl} class ="img-fluid imgTaille img-responsive img-thumbnail "></div>
       <div class="col-6">
        <div class="row">${article[i].name}</div>
        <div class="row">${article[i].price}€</div>
        <div class="row">${article[i].description}</div>
        <div class="row"><button  class="background" onclick="ajouterPanier(${i},'${article[i]._id}')"><i class="fas fa-cart-arrow-down"></i></button> </div>
       <div class="form-floating ">
        <select class="butonLentilles form-select  " id="floatingSelect" aria-label="Floating label select example">`;

       for(let s=0; s<article[i].lenses.length; s++ ){
      
        listOfProducts +=`  
       <option value="${article[i].lenses[s]}">${article[i].lenses[s]}</option>
     
     `
       }
       listOfProducts+=`
       </select>
       <label for="floatingSelect">lentilles</label>
       </div>
     </div>`
      console.log(article[i].lenses)
     
      document.getElementById('productListDescription').innerHTML = listOfProducts
        }
      }
    }
   


    

  

/* 
function Products (pic,name,price){
    this.pic = pic,
    this.name = name,
    this.price = price
  }

const product1 = new Products('back-end/images/vcam_1.jpg', 'appareilPhoto',500 )
const product2 = new Products('back-end/images/vcam_2.jpg','appareilPhoto',600 )
const product3 = new Products('back-end/images/vcam_3.jpg','appareilPhoto',700 )
const product4 = new Products('back-end/images/vcam_4.jpg','appareilPhoto',800 )
const product5 = new Products('back-end/images/vcam_5.jpg','appareilPhoto',900 )

product.push(product1,product2,product3,product4,product5)
*/
