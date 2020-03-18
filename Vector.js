class Vector{
    data;
    size;

    constructor(size){
        this.data = new Array(size).fill(0);
        this.size = size;
    }

    setData(data){
        this.data = data;
        this.size = data.length;
    }

    getData(){
        return this.data;
    }

    getRow(rowPos){
        return this.data[rowPos];
    }

    set(rowPos, value){
        this.data[rowPos] = value;
    }

    getSize(){
        return this.size;
    }

    toMatrix(){
        var matrix = new Matrix(1, this.size);
        matrix.setData(this.data);
        matrix.transpone();
        return matrix;
    }

    add(value){
        this.data.push(value);
    }

    print(){
        var output = "";
        this.data.forEach((value) => {
            output += value + "\n";
        });
        console.log(output);
    }
}
