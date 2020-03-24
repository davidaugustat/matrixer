class GeneralNumber extends MathElement{


    /**
     * @returns {GeneralNumber}
     * */
    getMultiplicativeInverse(){
        throw "This is not implemented!";
    }

    /**
     * @returns {GeneralNumber}
     * */
    getAdditiveInverse(){
        throw "This is not implemented!";
    }

    toLatex() {
        return this.toString();
    }

}