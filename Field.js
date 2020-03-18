class Field{
  static F2 = 2;
  static F3 = 3;
  static F4 = 4;
  static F5 = 5;
  static F7 = 7;
  static F8 = 8;
  static F9 = 9;
  static F11 = 11;
  static F13 = 13;
  static F17 = 17;
  static F19 = 19;
  static R = 100; // real numbers

  field;
  constructor(field){
    this.field = field;
  }

  isPrimeField(){
    return [Field.F2, Field.F3, Field.F5, Field.F7, Field.F11, Field.F13, Field.F17, Field.F19].includes(this.field);
  }

  multiply(factor1, factor2){
    if(this.isPrimeField()){
      return (factor1 * factor2) % this.field;
    } else if(this.field == Field.R){
      return factor1 * factor2;
    }
  }

  add(summand1, summand2){
    if(this.isPrimeField()){
      return (summand1 + summand2) % this.field;
    } else if(this.field == Field.R){
      return summand1 * summand2;
    }
  }

  getInverse(num){
    if(this.isPrimeField()){
    return this.getPrimeFieldInverse(num);
    } else if(this.field == Field.R){
      return 1 / num;
    }
  }

  parse(value){
    if(this.isPrimeField()){
      return ((value % this.field) + this.field) % this.field;
    } else if(this.field == Field.R){
      return value;
    }
    throw("Extended fields are not parsable. :/");
  }





  getPrimeFieldInverse(num){
    // This method uses the Extended Euclidean Algorithm:

    var multiples = [1];
    // calculate greatest common divider while storing all used multiples:
    var u1 = 0;
    var u2 = this.field;
    var u3 = num;

    while(u3 > 0){
      u1 = u2;
      u2 = u3;
      u3 = u1 % u2;
      multiples.push((u1-u3)/u2);
    }

    multiples = multiples.reverse();

    // use the stored multiples to find the prime field inverse
    var wPrePrevious = 0;
    var wPrevious = 0;
    var wCurrent = 1;
    for(var i = 0; i < multiples.length - 2; i++){
      wPrePrevious = wPrevious;
      wPrevious = wCurrent;
      wCurrent = wPrePrevious - multiples[i+1] * wPrevious;
    }
    return this.parse(wCurrent);
  }
 }
