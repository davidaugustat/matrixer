class Vector{

    /** @type {[number]} */
    data;

    /** @type {number} */
    size;

    /** @type {Field} */
    field;

    /**
     * @param {number} size
     * @param {number} field
     * */
    constructor(size, field=Field.R){
        this.data = new Array(size).fill(0);
        this.size = size;
        this.field = new Field(field);
    }

    /**
     * @param {[number]} data
     * */
    setData(data){
        this.data = data;
        this.size = data.length;
    }

    /**
     * @returns {[number]}
     * */
    getData(){
        return this.data;
    }

    /**
     * @returns {number}
     * */
    getRow(rowPos){
        return this.data[rowPos];
    }

    /**
     * @param {number} rowPos
     * @param {number} value
     * */
    set(rowPos, value){
        this.data[rowPos] = value;
    }

    /**
     * @returns {number}
     * */
    getSize(){
        return this.size;
    }

    /**
     * @returns {Matrix}
     * */
    toMatrix(){
        const matrix = new Matrix(1, this.size, this.field.getName());
        matrix.setData(this.data);
        matrix.transpose();
        return matrix;
    }

    /**
     * @param {number} value
     * */
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
