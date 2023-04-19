class Cell {
    constructor(x,y,value){
        this.value = value;
        this.x = x;
        this.y = y;
    }

    getPosX(){
        return this.x;
    }

    getPosY(){
        return this.y;
    }

    getValue(){
        return this.value;
    }

    getImage(){
        return this.image;
    }
}