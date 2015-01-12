# Minesweeper (Buscaminas)

Esta es una implementación del clásico Buscaminas. A continuación una explicación del algoritmo tanto para situar las minas y los números que indican el número de minas alrededor como para descubrirlas en función de los eventos del jugador.

La versión actual se puede ver en funcionamiento en [Codepen](http://codepen.io/luisddm/pen/KwaLPv).

**ATENCIÓN: esta versión del juego y de la documentación es preliminar y está en fase intensiva de desarrollo. Ver al final de este documento la lista de [cosas por hacer](#to-do-list).**

## Información general

Esta implementación se ha hecho utilizando algunas características interesantes de JQuery. La principal de ellas es aprovechar el método [`.data()`](http://api.jquery.com/data/) para almacenar datos arbitrarios en cualquier elemento del DOM. Usaremos esto para almacenar el cada casilla el estado actual de la misma.

## Generación del tablero

A continuación se describe el proceso para generar el tablero de juego y dejarlo preparado para empezar a jugar.

### Colocación de las minas

Necesitamos generar dos números aleatorios tantas veces como el número de minas que tengamos que colocar. Estos dos números indicarán la posición de la mina respecto a los ejes x e y. Si en la posición en cuestión no hay ninguna mina, la colocamos ahí e incrementamos el contador. Si ya hay una mina, ignoramos esta posición y dejamos el contador igual. Este proceso terminará cuando el contador alcance el número de minas a colocar.

Es importante reseñar que todos los índices de las casillas y el tablero (y lo mismo para contadores de cualquier tipo) empiezan en 0 y acaban en *longitud-1*.

```
n = 0
mientras n < núm de minas
	x = núm aleatorio entre 0 y xTablero-1
	y = núm aleatorio entre 0 y yTablero-1

	celda = localización del elemento del DOM que representa la celda en el tablero usando x e y

	si no hay una mina ya colocada en esta celda
		colocar aquí una mina
		incrementar n
```

### Colocación de los números

De lo que se trata aquí es de colocar en cada casilla que no tenga una mina un número que indique la cantidad de minas que hay a su alrededor. En principio se considerarán las ocho casillas circundantes, es decir, superior, inferior, derecha, izquierda y las cuatro esquinas.

Debemos iterar cada una de las casillas del tablero, buscando una por una cuántas minas hay en sus ocho posiciones adyacentes. Este será el número que contendrá la casilla. Si no hay minas adyacentes, la casilla queda en blanco. Hay que tener cuidado, ya que una casilla situada en una esquina o un borde del tablero no tendrá ocho casillas adyacentes, sino tres o cinco, respectivamente.

```
para cada celda
	k = 0
	si no hay una mina
		si la celda de la derecha existe y es una mina
			incrementar k
		si la celda de la izquierda existe y es una mina
			incrementar k
		si la celda superior existe y es una mina
			incrementar k
		si la celda inferior existe y es una mina
			incrementar k
		si la celda de la esquina superior derecha existe y es una mina
			incrementar k
		si la celda de la esquina superior izquierda existe y es una mina
			incrementar k
		si la celda de la esquina inferior derecha existe y es una mina
			incrementar k
		si la celda de la esquina inferior izquierda existe y es una mina
			incrementar k
	si k > 0 asignar este número a la celda
	si k sigue siendo 0 dejar la casilla en blanco
```

### Implementación

La forma de asignar un cierto dato a un elemento del DOM sin que el usuario lo pueda ver es mediante el método `.data()`, como ya hemos dicho antes. De este modo cada casilla tendrá dos posibles claves para el atributo *data*.

clave | posibles valores | descripción
:---: | :---: | ---
revealed | *true* o *false* | Denota si el contenido de la celda ha sido mostrado al jugador o no.
mines | número entero (0...8) | Número de minas que hay alrededor de una casilla. El 0 denota que se trata de una mina. Si está vacío o no existe significa que no hay minas alrededor.

## Descubrimiento de las celdas

Una vez que el tablero está listo y con todos los elementos colocados, se procede a descubrir las casillas correspondientes por cada click del usuario.

### Click en una celda

La única interacción real del jugador con el tablero es el click en una celda, luego debemos asignar un evento de tipo *onclick* a cada una de ellas. Una vez producido este evento, pueden ocurrir tres cosas distintas, en función de lo que contiene:

- Si se trata de una mina, el juego termina y el jugador pierde. Todas las minas del tablero aparecen en sus respectivas posiciones y éste queda bloqueado hasta el siguiente juego.
- Si se trata de un número, se muestra el número sin más.
- Si se trata de un espacio vacío es porque no hay ninguna mina en las celdas circundantes. Entonces se descubre el contenido de esta celda y también el de todas las adyacentes. Sin embargo, este caso es el más complicado, ya que si alguna de estas celdas es otro espacio vacío, también habrá que mostrar a su vez todas sus celdas circundantes, y así hasta que no quede ninguna celda vacía alrededor de las que se van mostrando.

```
click en celda
   si es una mina
      mostrar todas las minas
      bloquear tablero
   si es un número
      mostrar este número
   si es un espacio vacío
      mostrar esta celda y todas las adyacentes, si están ocultas
      si alguna celda adyacente está vacía
         mostrar esta celda y todas las adyacentes, si están ocultas
         ...
            (hasta que no queden celdas vacías adyacentes sin mostrar)
```

#### Celda vacía

En el caso de que hagamos click en una celda vacía, y a su vez haya celdas vacías a su alrededor, y así sucesivamente, debemos usar un algoritmo iterativo que es más complejo que un simple bucle. La técnica que usaremos aquí es la siguiente:

- Usamos una función que recibe como entrada una celda, y devuelve un array con las coordenadas de las celdas vacías a su alrededor.

```
algoritmo celdas vacías ayacentes [...]
```

- Partimos de un array bidimiensional vacío f[]. Tras la primera iteración, almacenará las coordenadas de las celdas vacías a su alrededor en f[0][0...n].
- Para cada una de estas celdas buscamos a su vez sus celdas adyacentes, siempre que no hayan sido descubiertas ya, y las almacenamos en f[1][0...n].
- Repetimos esto n veces hasta que el array resultante esté vacío.

## TO-DO LIST

- Descripción del algoritmo para descubrir las celdas.
- Mejora de características de usabilidad (reiniciar juego, etc.).
- Mejora de la hoja de estilos.
- Implementación de el evento click derecho para marcar las celdas donde el jugador cree que hay una mina.
- Reconocer la situación en la que el jugador ha ganado. Hasta ahora no existe el evento como tal.
- English version.