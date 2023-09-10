var tableNumber = null;
AFRAME.registerComponent("markerhandler", {
  init: async function () {
    if(tableNumber === null){
      this.askTableNumber();
    }
    //Toma la colección de platillos desde la base de datos Firebase.
    var dishes = await this.getDishes();

    //Evento markerFound.
    this.el.addEventListener("markerFound", () => {
      if(tableNumber !== null){
        var markerId=this.el.id;
        this.handleMarkerFound(dishes, markerId);
      }     

    });

    //Evento markerLost.
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });

  },
  askTableNumber:function(){
  var iconUrl="https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
  swal({
    title:"bienvenido a el antojo",
    icon:iconUrl,
    content:{
      element:"input",
      attributes:{
        placeholder:"escribe el numero de tu mesa",
        type:"number",
        min:1
      }
    },
    closeOnClickOutside:false,

  }).then(inputValue => {
    tableNumber=inputValue;
  })
  },
  handleMarkerFound: function (dishes, markerId) {
    var toDaysDate = new Date();
        var toDaysDay = toDaysDate.getDay();
        var days=[
            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"
        ];
    // Cambiar el tamaño del modelo a su escala incial.
    var dish = dishes.filter(dish => dish.id === markerId)[0];

    if(dish.unavailable_days.includes(days[toDaysDay])){
      swal({
        icon:"warning",
        title:dish.dish_name.toUpperCase(),
        text:"Este platillo no esta disponible hoy",
        timer:2500,
        buttons:false
      })
    }else{
      var model = document.querySelector(`#model-${dish.id}`);
       model.setAttribute("position", dish.model_geometry.position);
       model.setAttribute("rotation", dish.model_geometry.rotation);
       model.setAttribute("scale", dish.model_geometry.scale);
      model.setAttribute("visible",true);
      var ingredientsContainer = document.querySelector(`#main-plane-${dish.id}`);
      ingredientsContainer.setAttribute("visible",true);

      var pricePlane = document.querySelector(`#price-plane-${dish.id}`);
      pricePlane.setAttribute("visible",true);

    // Cambiar la visibilidad del botón div.
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "flex";

    var ratingButton = document.getElementById("rating-button");
    var orderButtton = document.getElementById("order-button");

    // Usar eventos de clic.
    ratingButton.addEventListener("click", function () {
      swal({
        icon: "warning",
        title: "Calificar platillo",
        text: "Procesando calificación"
      });
    });
  
    orderButtton.addEventListener("click", () => {
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "¡Gracias por tu orden!",
        text: "¡Recibirás tu orden pronto!"
      });
    });
  }

  },

  handleMarkerLost: function () {
    // Cambiar la visibilidad del botón div.
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },
  //Tomar la colección de platillos desde la base de datos Firebase.
  getDishes: async function () {
    return await firebase
      .firestore()
      .collection("dishes")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  }
});