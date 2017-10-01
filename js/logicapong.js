

//VARIABLES GLOBALES:
var bucle; //Guarda las funciones que se van a repetir muchas veces.
var velocidad = 6;
var canvas = document.getElementById("canvas"); //Acceso al canvas.
var areaW = canvas.width; //Ancho de la zona de juego.
var areaH = canvas.height; //Alto de la zona de juego.
var ctx = canvas.getContext("2d"); //Contexto gráfico donde vamos a dibujar.
var puntosj1 = 0; //Guarda los puntos del jugador 1.
var puntosj2 = 0; //Guarda los puntos del jugador 2.
var tamanoPaleta = 100; //Tamaño de la paleta.
var superficie = areaH-tamanoPaleta; //Alto de la zona de juego menos el tamaño de la paleta.



//CLASES:

//Clase para detectar las colisiones. (MOTOR DE JUEGO).
class Base {

	//Método que ese encarga del motor de juego para detectar las coalicciones.
	choque(obj){
		//Si se encuentra en los alrededores del objeto no hay choque. 
		if(this.fondo < obj.y || this.y > obj.fondo || this.derecha < obj.x || this.x > obj.derecha){
			return false;
		} else {
			//Si hay choque.
			return true;
		}
	}
}

//Mostramos en pantalla los puntos conseguidos..
class Puntos {

	//Constructor de la clase "Puntos" que recibe como parámetro la posición x.
	constructor(x){
		this.x = x;
		this.y = 50;
		this.punto = 0;
	}

	//Método que dibuja los puntos.
	dibujar(){
		//Elegimos el tipo del font en el canvas.
		ctx.font = "50px Arial";
		ctx.fillText(this.punto.toString(), this.x, this.y);
	}
}

//La clase "Bola" hereda de la clase "Base".
class Bola extends Base {

	//Constructor de la clase "Bola".
	constructor(){
		super(); //En Javascript que se hereda hay que llamar a "super()".
		this.t = 25; //Tamaño de la bola.
		/*Para calcular una posición aleatoria para la bola, calculamos
		un número aleatorio utilizando la función "Math.randow()" y multiplicando
		por del tablero menos el tamaño de la pelota. Lo hacemos para X e Y.*/
		this.x = Math.floor(Math.random() * (areaW - this.t));
		this.y = Math.floor(Math.random() * (areaH - this.t));
		/*Cambio de dirección de la bola, si es positivo en el eje X
		va hacia la derecha, negativo hacia la izquierda y lo mismo con el eje Y.*/
		this.xdir = velocidad; 
		this.ydir = velocidad;
		//Instanciamos el marcador de puntuación de cada jugador.
		this.p1 = new Puntos(250);
		this.p2 = new Puntos(675);
	}

	//Método choque en vertical, cuando se choca con la parte de arriba o abajo.
	choqueV(){
		/*Si la pelota toca la parte de arriba, se le cambia el signo
		a negativo para que baje hacia abajo.*/
		if(this.y <= 0 || this.y >= (areaH -this.t)){
			//La variable pasa a tener el mismo valor pero en negativo.
			this.ydir = -this.ydir;
		}
	}

	//Método choque en horizontal, cuando se choca con la parte de arriba o abajo.
	choqueH(){
		//Si la variable "X" es menor o igual que cero
		if(this.x <= 0){
			this.xdir = -this.xdir; 
			puntosj2++; //Suma un punto para el jugador 2.
			this.p2.punto = puntosj2; //Número de puntos que tiene el jugador 2.
		}

		/*Si la variable X es mayor o igual que el la longitud del Area Horizontal
		menos el tamaño de la bola*/ 
		if(this.x >= (areaW - this.t)){
			this.xdir = -this.xdir;
			puntosj1++; //Incrementa el número de puntos del jugador 1.
			this.p1.punto = puntosj1; //Número de puntos que tiene el jugador 1.
		}
	}

	//Método para el movimiento de la bola.
	mover(){
		//Sumamos consantemente la posición X e Y.
		this.x+=this.xdir;
		this.y+=this.ydir;
		//
		this.fondo = this.y+this.t;
		this.derecha = this.x+this.t;
		//Ejecutamos los métodos para controlar el choque Vertical y Horizontal.
		this.choqueV(); 
		this.choqueH();
	}

	//Método que dibuja la bola en el contexto gráfico, el canvas.
	dibujar(){
		//Recibe como parametros de posición x e y, ancho y alto.
		ctx.fillRect(this.x, this.y, this.t, this.t);
		this.p1.dibujar();
		this.p2.dibujar();
	}
}


class Paleta extends Base {

	//Construtctor de la clase "Paleta", la cual hereda de la clase "Base".
	constructor(x){
		super();
		this.x = x; //Posición x para identificar el jugador.
		this.w = 25; //Tamaño del ancho
		this.h = tamanoPaleta; // Tamaño de la paleta.
		this.y = Math.floor(Math.random() * superficie); //Máximo que puede bajar la paleta.
		this.dir = 0;
	}

	//Se introduce como parámetro el alto,ancho para dibujar las paletas.
	dibujar(){
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}

	//Método mover.
	mover(){
		this.y+=this.dir;
		this.derecha = this.w+this.x;
		this.fondo = this.h+this.y;

		//Detección de coliciones.
		if(this.y <= 0){
			this.y = 0;
			this.dir = 0;
		}
		if(this.y >= superficie){
			this.y = superficie;
			this.dir = 0;
		}
	}
}


//OBJETOS
var bola = new Bola(); //Instanciamos el objeto "bola" de la clase "Bola".
//Instanciamos las paletas de los jugadores 1 y 2 e indicamos en pixeles la distancia con la pared.
var jugador1 = new Paleta(55); 
var jugador2 = new Paleta(925);


//FUNCIONES DE CONTROL

/*Función que mueve las paletas, recibe como parámetro al objeto event que nos
proporciona información sobre los eventos.*/
function moverPaletas(event){
	//Detectamos las teclas pulsadas y asignamos una orden.
	var tecla = event.keyCode;
	if(tecla == 38){
		jugador2.dir = -velocidad;
	}
	if(tecla == 40){
		jugador2.dir = velocidad;
	}
	if(tecla == 87){
		jugador1.dir = -velocidad;
	}
	if(tecla == 83){
		jugador1.dir = velocidad;
	}
}

/*Función que para las paletas, recibe como parámetro al objeto event que nos
proporciona información sobre los eventos.*/
function pararPaletas(event){
	var tecla = event.keyCode;
	if(tecla == 38 || tecla == 40){
		jugador2.dir = 0;
	}
	if(tecla == 87 || tecla == 83){
		jugador1.dir = 0;
	}
}

//Función que si choca la  bola en el jugador 1 o jugador 2.
function choque(){
	if(bola.choque(jugador1) || bola.choque(jugador2)){
		//Invertimos la dirección de la bola en el eje X.
		bola.xdir = -bola.xdir;
	}
}



//FUNCIONES GLOBALES:

//Función para dibujar graficos en la pantalla.
function dibujar(){
	/*Accedemos al contexto gráfico utilizando la variable "ctx" y con el método
	"clearRec" borramos si existe algo dibujado. Lo situamos en la posición 0.0 
	de la zona de juego y le pasamos las variables "areaW" y "areaH" para 
	indicar el tamaño de la zona de juego que se debe borrar.*/
	ctx.clearRect(0,0,areaW, areaH);
	//Utilizando la variable globar bola.
	bola.dibujar();//Dibujamos el objeto "bola" utilizando el método "dibujar".
	//Dibujamos la paleta para cada jugador.
	jugador1.dibujar(); 
	jugador2.dibujar();
}

//Función de animación,
function frame(){
	//Hacemos que la bola se mueva.
	bola.mover();
	//Hacemos que las paletas jugador 1 y jugador 2 se muevan cuando se presione una tecla.
	jugador1.mover();
	jugador2.mover();
	//Dibujamos en pantalla
	dibujar();
	//Esta función....
	choque();
	/*Guardamos en la función global "bucle" que queremos realizar una animación, 
	y se solicita el repintado de la ventana para el próximo ciclo de animación. */
	bucle = requestAnimationFrame(frame);
}

//Función que inicia el juego.
function iniciar(){
	//Ocultamos el "modal" accediendo a través del id
	var modal = document.getElementById("modal");
	modal.style.display = "none";
	//Se ejecuta la función frame.
	frame();
}

