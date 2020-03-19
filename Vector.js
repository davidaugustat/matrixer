class Vector{
    data;
    size;
    field;

    constructor(size, field=Field.R){
        this.data = new Array(size).fill(0);
        this.size = size;
        this.field = new Field(field);
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
        const matrix = new Matrix(1, this.size, this.field.getName());
        matrix.setData(this.data);
        matrix.transpone();
        return matrix;
    }

    add(value){
        this.data.push(value);
    }

    print(){
        let output = "";
        this.data.forEach((value) => {
            output += this.field.getString(value) + "\n";
        });
        console.log(output);
    }
}
