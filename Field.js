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
      return this.getLeastCommonMultiple(num, this.field + 1) / num;
    } else if(this.field == Field.R){
      return 1 / num;
    }
  }

  parse(value){
    if(this.isPrimeField()){
      return value % this.field;
    } else if(this.field == Field.R){
      return value;
    }
    throw("Extended fields are not parsable. :/");
  }

  isPrimeField(){
    return [Field.F2, Field.F3, Field.F5, Field.F7, Field.F11, Field.F13, Field.F17, Field.F19].includes(this.field);
  }

  getLeastCommonMultiple(num1, num2){
    var greatestCommonDivider = this.getGreatestCommonDivider(this.parse(num1), this.parse(num2));
    return (num1 * num2) / greatestCommonDivider;
  }

  getGreatestCommonDivider(num1, num2){
    var u1 = 0;
    var u2 = 0;
    var u3 = 0;

    if(num1 <= 0 || num2 <= 0){
      return -1;
    } else if(num1 == num2){
      return num1;
    } else if(num1 < num2){
      u2 = num1;
      u3 = num2;
    } else {
      u2 = num2;
      u3 = num1;
    }

    while(u3 != 0){
      u1 = u2;
      u2 = u3;
      u3 = u1 % u2;
    }
    return u2;
  }
}
