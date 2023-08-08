const square = function (number) {
    return number * number;
  };
  var x = square(4);


  const factorial = function fac(n) {
    return n < 2 ? 1 : n * fac(n - 1);
  };
  
  console.log(factorial(3));