# Proyecto 1 - Goku Smart

Universidad del Valle

Facultad de Ingeniería | Escuela de Ingeniería de Sistemas y Computación | Inteligencia Artificial

# Algoritmos de búsqueda

El agente inteligente encuentra las esferas meta usando los siguientes algoritmos de búsqueda:

| Búsquedas no informadas |

Preferente por amplitud.
Preferente por profundidad evitando ciclos.
De costo uniforme.

| Búsquedas informadas |

Avara.
A*.

# Especificaciones

Si Goku pasa por una casilla donde hay un freezer sin tener semilla del ermitaño el costo es 4. De este
valor, 3 unidades corresponden al daño que le ocasiona freezer y 1 unidad se debe al desplazamiento. 

Si Goku tiene semilla y llega a una casilla con freezer el costo es 1, es decir, en este último caso el
enemigo no le haría ningún daño y solamente se tiene en cuenta el costo del desplazamiento.

Si Goku pasa por una casilla donde hay un cell sin tener semilla del ermitaño el costo total es 7 (6 unidades
por el daño causado por cell y 1 unidad por el desplazamiento), y si tiene semilla el costo es 1 que
corresponde al desplazamiento.

Si Goku pasa por una casilla donde hay enemigo (cell o freezer) y no tiene semilla, dicho enemigo seguirá existiendo en esa casilla.



