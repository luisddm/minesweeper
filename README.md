# Minesweeper (buscaminas)

Esta es una implementación del clásico Buscaminas. A continuación una explicación del algoritmo tanto para situar las minas y los números que indican el número de minas alrededor como para descubrirlas en función de los eventos del jugador.

**ATENCIÓN: esta versión del juego y de la documentación es preliminar y está en fase intensiva de desarrollo. Ver al final de este documento la lista de [cosas por hacer](#to-do-list).**

## Información general

Esta implementación se ha hecho utilizando algunas características interesantes de JQuery. La principal de ellas es aprovechar el método [`.data()`](http://api.jquery.com/data/) para almacenar datos arbitrarios en cualquier elemento del DOM. Usaremos esto para almacenar el cada casilla el estado actual de la misma.

## Generación del tablero

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
    si la celda de su derecha existe y es una mina
      incrementar k
    si la celda de su izquierda existe y es una mina
      incrementar k
    si la celda superior existe y es una mina
      incrementar k
    si la celda inferior izquierda existe y es una mina
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

## TO-DO LIST

- Descripción del algoritmo para descubrir las celdas
- Mejora de características de usabilidad (reiniciar juego, etc.)
- Mejora de la hoja de estilos
- English version
