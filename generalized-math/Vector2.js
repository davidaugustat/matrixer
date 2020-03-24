class Vector2 extends MathElement{
    /** @type {number} */
    size;

    /**
     * @param {number} field
     * @param {[GeneralNumber]} value
     * @param {number} size
     * */
    constructor(field=Field.R, value, size=0){
        super(field, value);
        if(value !== null){
            this.value = value;
        } else{
            this.value = new Array(size).fill(parseValueToFittingNumberObject(field, 0));
            this.size = size;
        }
    }

    /**
     * @param {[GeneralNumber]} value
     * */
    set value(value){
        this._value = value;
        this.size = value.length;
    }

    /**
     * @returns {[GeneralNumber]}
     * */
    get value(){
        return this._value;
    }

    /**
     * @returns {GeneralNumber}
     * */
    getRow(rowPos){
        return this.value[rowPos];
    }

    /**
     * @param {number} rowPos
     * @param {GeneralNumber} value
     * */
    set(rowPos, value){
        this.value[rowPos] = value;
    }

    /**
     * @returns {number}
     * */
    getSize(){
        return this.size;
    }

    /**
     * @returns {Matrix2}
     * */
    toMatrix(){
        const matrix = new Matrix2(this.field, null,1, this.size);
        matrix.setData(this.value);
        return matrix.transpose();
    }

    /**
     * @param {GeneralNumber} value
     * */
    addRow(value){
        this.value.push(value);
        this.size = this.value.length;
    }

    print(){
        let output = "";
        this.value.forEach((rowElement) => {
            output += rowElement.toString() + "\n";
        });
        console.log(output);
    }

    toString() {
        let output = "";
        this.value.forEach((rowElement) => {
            output += rowElement.toString() + "\n";
        });
        return output;
    }

    toLatex() {
        throw "Not implemented yet";
    }

    /**
     * @param {number} field
     * @param {[number]} data
     * */
    static fromRawData(field, data){
        const resultData = data.map(number => parseValueToFittingNumberObject(field, number));
        return new Vector2(field, resultData);
    }
}