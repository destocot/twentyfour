// CANNOT HANDLE 8 * (1 + 1 + 1)

const extraneousParens = (array) => {
  let extraneous = true;
  while (extraneous) {
    extraneous = false;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === '(' && array[i + 2] === ')') {
        array[i] = undefined;
        array[i + 2] = undefined;
        extraneous = true;
      }
    }
    array = array.filter(item => item !== undefined);
  }
  return array;
}

export const parseMath = (string) => {

  string = string.trim().replaceAll(/\s+/g, "");

  let stringArr = string.split('');
  stringArr = extraneousParens(stringArr);


  for (let i = 0; i < stringArr.length; i++) {
    if (!isNaN(Number(stringArr[i]))) {
      stringArr[i] = Number(stringArr[i]);
    }
  }
  // console.log(stringArr);
  return stringArr;
};

export const checkValid = (parsed, numbers) => {
  const a = numbers.sort().join("");
  const b = parsed.slice().sort().slice(-4).join("");
  return a === b;
};

export const evaluateMath = (array) => {
  // console.log('ORIGINAL', array);
  let result = null;
  let a, b, operation;

  // console.log('1', array);
  array = dealWithParenthesis(array);
  // console.log('2', array);

  while (array.length > 1) {
    let revolvingIndex = 1;
    if (array.indexOf("*") !== -1) {
      revolvingIndex = array.indexOf("*");
      a = array[revolvingIndex - 1];
      operation = array[revolvingIndex];
      b = array[revolvingIndex + 1];
    } else if (array.indexOf("/") !== -1) {
      revolvingIndex = array.indexOf("/");
      a = array[revolvingIndex - 1];
      operation = array[revolvingIndex];
      b = array[revolvingIndex + 1];
    } else {
      a = array[0];
      operation = array[1];
      b = array[2];
    }

    result = calculate(a, b, operation);

    array[revolvingIndex - 1] = result;
    array = array
      .slice(0, revolvingIndex)
      .concat(array.slice(revolvingIndex + 2));
  }
  return array[0];
};

const dealWithParenthesis = (array) => {
  while (array.indexOf("(") !== -1) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === "(") {
        const paren2 = checkInner(array, i);
        if (typeof paren2 === "number") {
          // console.log('preparen', array);
          array = reduceArray(array, i);
          // console.log('postparen', array);
          array = extraneousParens(array);
          // console.log('extranparen', array);
        }
      }
    }
  }
  return array;
};

const checkInner = (array, paren1Index) => {
  for (let i = paren1Index + 1; i < array.length; i++) {
    if (array[i] === "(") {
      return false;
    }
    if (array[i] === ")") {
      return i;
    }
  }
};

const reduceArray = (array, parenStart) => {
  if (array[parenStart] === '(' && array[parenStart + 4] === ')') {
    const res = calculate(
      array[parenStart + 1],
      array[parenStart + 3],
      array[parenStart + 2]
    );
    return array.slice(0, parenStart).concat(res).concat(array.slice(parenStart + 5));
  } else {
    let endParenIdx = parenStart + 4;
    for (let i = parenStart; i < array.length; i++) {
      if (array[i] === ")") {
        endParenIdx = i;
        break;
      }
    }
    const toEval = evaluateMath(array.slice(parenStart + 1, endParenIdx));
    return array.slice(0, parenStart).concat(toEval).concat(array.slice(endParenIdx + 1));
  }
};

const calculate = (num1, num2, operation) => {
  if (operation === "+") {
    return num1 + num2;
  }
  if (operation === "-") {
    return num1 - num2;
  }
  if (operation === "*") {
    return num1 * num2;
  }
  if (operation === "/") {
    return num1 / num2;
  }
};
