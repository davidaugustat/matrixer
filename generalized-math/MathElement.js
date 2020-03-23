class MathElement {

    /** @type {number} */
    _field;

    /** @type {number | [[number]] | [number]}*/
    _value;

    constructor(field, value) {
        this._field = field;
        this._value = value;
    }


    get field() {
        return this._field;
    }

    get value() {
        return this._value;
    }


    set field(value) {
        this._field = value;
    }

    set value(value) {
        this._value = value;
    }

    /**
     * @param {MathElement} factor
     * @returns {MathElement}
     * */
    multiplyWith(factor){
        return this.doAccordingToElementType(factor, () => this.multiplyWithNumber(factor),
            () => this.multiplyWithMatrix(factor), () => this.multiplyWithVector(factor));
    }

    /**
     * @param {MathElement} summand
     * @returns {MathElement}
     * */
    add(summand){
        return this.doAccordingToElementType(summand, () => this.addNumber(summand),
            () => this.addMatrix(summand), () => this.addVector(summand));
    }

    /**
     * @param {MathElement} subtrahend
     * @returns {MathElement}
     * */
    subtract(subtrahend){
        return this.doAccordingToElementType(subtrahend, () => this.subtractNumber(subtrahend),
            () => this.subtractMatrix(subtrahend), () => this.subtractVector(subtrahend));
    }

    /**
     * @param {MathElement} divisor
     * @returns {MathElement}
     * */
    divideBy(divisor){
        return this.doAccordingToElementType(divisor, () => this.divideByNumber(divisor),
            () => {throw "Division by matrix not supported!";}, () => {throw "Division by vector not supported!";});
    }


    /**
     * @returns {string}
     * */
    toString(){
        throw "This is not implemented!";
    }

    /**
     * Returns LaTeX representation of the MathElement object
     *
     * @returns {string}
     * */
    toLatex(){
        throw "This is not implemented!";
    }

    // internal functions that need to be overridden in subtypes:
    /**
     * @param {MathElement} factor
     * @returns {MathElement}
     * */
    multiplyWithNumber(factor){
        throw "This is not implemented!";
    }

    /**
     * @param {MathElement} factor
     * @returns {MathElement}
     * */
    multiplyWithMatrix(factor){
        throw "This is not implemented!";
    }

    /**
     * @param {MathElement} factor
     * @returns {MathElement}
     * */
    multiplyWithVector(factor){
        throw "This is not implemented!";
    }

    /**
     * @param {MathElement} summand
     * @returns {MathElement}
     * */
    addNumber(summand){
        throw "This is not implemented!";
    }

    /**
     * @param {MathElement} summand
     * @returns {MathElement}
     * */
    addMatrix(summand){
        throw "This is not implemented!";
    }

    /**
     * @param {MathElement} summand
     * @returns {MathElement}
     * */
    addVector(summand){
        throw "This is not implemented!";
    } 
    
    /**
     * @param {MathElement} subtrahend
     * @returns {MathElement}
     * */
    subtractNumber(subtrahend){
        throw "This is not implemented!";
    }

    /**
     * @param {MathElement} subtrahend
     * @returns {MathElement}
     * */
    subtractMatrix(subtrahend){
        throw "This is not implemented!";
    }

    /**
     * @param {MathElement} subtrahend
     * @returns {MathElement}
     * */
    subtractVector(subtrahend){
        throw "This is not implemented!";
    }

    /**
     * @param {MathElement} divisor
     * @returns {MathElement}
     * */
    divideByNumber(divisor){
        throw "This is not implemented!";
    }

    /**
     * @param {MathElement} element
     * @param {function(MathElement): MathElement} numberBehavior
     * @param {function(MathElement): MathElement} matrixBehavior
     * @param {function(MathElement): MathElement} vectorBehavior
     * @returns {MathElement}
     * */
    doAccordingToElementType(element, numberBehavior, matrixBehavior, vectorBehavior){
        if(element instanceof GeneralNumber){
            return numberBehavior(element);
        } else if(element instanceof Matrix2){
            return matrixBehavior(element);
        } else if(element instanceof Vector2){
            return numberBehavior(element);
        }
    }

}