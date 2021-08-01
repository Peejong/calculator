const output_small_p = document.querySelector(".output-small");
const output_big_p = document.querySelector(".output-big");
const clear_button = document.querySelector(".btn-clear");
const MATH_OPERATORS = ["+", "-", "x", "÷"];
let isResultError = false;
let isResultHasAnswer = false;

const setClearButtonToDefault = () => {
  clear_button.innerText = "AC";
};

const alterClearButtonLabel = () => {
  const alterToACLabel = () => {
    if (output_big_p.innerText === "") clear_button.innerText = "AC";
  };

  const alterToCELabel = () => {
    if (output_big_p.innerText) clear_button.innerText = "CE";
  };

  alterToACLabel();
  alterToCELabel();
};

const clearAllCharacters = () => {
  output_small_p.innerText = "";
  output_big_p.innerText = "";
};

const clearLastCharacter = () => {
  let clearLastCharacterCleared = output_big_p.innerText.slice(0, -1);
  output_big_p.innerText = clearLastCharacterCleared;
};

const clearOutputCharacters = () => {
  if (clear_button.innerText === "CE") clearLastCharacter();
  if (clear_button.innerText === "AC") clearAllCharacters();
  alterClearButtonLabel();
};

const displayCharacter = (char) => {
  const resetErrorOutput = () => {
    if (!isResultError) return;
    output_small_p.innerText = "";
    output_big_p.innerText = "";
    isResultError = false;
  };

  const resetAnswerOutput = (char) => {
    if (!isResultHasAnswer) return;
    if (isNaN(char)) {
      output_small_p.innerText = `Ans: ${output_big_p.innerText}`;
      isResultHasAnswer = false;
    }

    if (!isNaN(char)) {
      clearAllCharacters();
      isResultHasAnswer = false;
    }
  };

  resetAnswerOutput(char);
  resetErrorOutput();
  output_big_p.innerText += char;
  alterClearButtonLabel();
};

const getOperator = (expression) => {
  return expression
    .split("")
    .filter((operator) => MATH_OPERATORS.includes(operator))
    .join("");
};

const getNumbers = (expression, operator) => {
  const convertStringToNumber = (string) => {
    if (string.includes(".")) return parseFloat(string);
    return parseInt(string);
  };

  return expression
    .split(operator)
    .map((numbers) => convertStringToNumber(numbers));
};

const calculateEquation = (operator, numbers) => {
  const calculateWithMissingNumber = () => {
    return "Syntax Error";
  };
  const calculateWithMissingOperator = () => {
    return numbers.join("");
  };

  const addNumbers = () => {
    return numbers.reduce((result, number) => result + number);
  };

  const subtractNumbers = () => {
    return numbers.reduce((result, number) => result - number);
  };

  const multiplyNumbers = () => {
    return numbers.reduce((result, number) => result * number);
  };

  const divideNumbers = () => {
    return numbers.reduce((result, number) => {
      if (result === 0 && number === 0) return "Syntax Error";
      if (result === 0) return 0;
      if (number === 0) return "Infinity";

      return result / number;
    });
  };

  if (numbers.includes(NaN)) return calculateWithMissingNumber();
  if (operator === "") return calculateWithMissingOperator();
  if (operator === "+") return addNumbers();
  if (operator === "-") return subtractNumbers();
  if (operator === "x") return multiplyNumbers();
  if (operator === "÷") return divideNumbers();
};

const displayResult = ({ expression, operator, result }) => {
  const checksResult = () => {
    if (result === "Syntax Error") isResultError = true;
    if (result !== "Syntax Error") isResultHasAnswer = true;
  };

  const displayExrpression = () => {
    if (result === "Syntax Error") return;

    const displayWithOperator = () => {
      if (operator)
        output_small_p.innerText = expression
          .split(operator)
          .join(` ${operator} `);
    };

    const displayWithoutOperator = () => {
      if (operator === "") output_small_p.innerText = result;
    };

    displayWithOperator();
    displayWithoutOperator();
  };

  const displayAnswer = () => {
    output_big_p.innerText = result;
  };

  checksResult();
  displayExrpression();
  displayAnswer();
};

window.addEventListener("keydown", initiateKeydownActions);

function initiateKeydownActions(e) {
  const initiateBackspaceAction = () => {
    if (e.keyCode === 8) clearOutputCharacters();
  };

  const initiateDeleteAction = () => {
    if (e.keyCode === 46) clearGlobal();
  };

  const initiateEnterAction = () => {
    if (e.keyCode === 13) {
      setClearButtonToDefault();
      const expression = output_big_p.innerText;
      const operator = getOperator(expression);
      const numbers = getNumbers(expression, operator);
      const result = calculateEquation(operator, numbers);
      displayResult({
        expression,
        operator,
        result,
      });
    }
  };

  const initiateEqualAction = () => {
    if (e.keyCode === 187 && !e.shiftKey) {
      setClearButtonToDefault();
      const expression = output_big_p.innerText;
      const operator = getOperator(expression);
      const numbers = getNumbers(expression, operator);
      const result = calculateEquation(operator, numbers);
      displayResult({
        expression,
        operator,
        result,
      });
    }
  };

  const initiatePointAction = () => {
    if (e.key === ".") displayCharacter(e.key);
  };

  const initiateNumberAction = () => {
    if (!isNaN(e.key)) displayCharacter(e.key);
  };

  const initiatePlusAction = () => {
    if (e.key === "+") displayCharacter(e.key);
  };

  const initiateMinusAction = () => {
    if (e.key === "-") displayCharacter(e.key);
  };

  const initiateTimesAction = () => {
    if (e.key === "X" || e.key === "x" || e.key === "*") displayCharacter("x");
  };

  const initiateSlashAction = () => {
    if (e.key === "/") displayCharacter("÷");
  };

  initiatePointAction();
  initiateNumberAction();
  initiatePlusAction();
  initiateMinusAction();
  initiateTimesAction();
  initiateSlashAction();
  initiateBackspaceAction();
  initiateDeleteAction();
  initiateEnterAction();
  initiateEqualAction();
}

const point_button = document.querySelector(".btn-point");
const number_buttons = document.querySelectorAll(".btn-num");
const operator_buttons = document.querySelectorAll(".btn-operators");
const equal_button = document.querySelector(".btn-equal");

clear_button.addEventListener("click", clearOutputCharacters);
point_button.addEventListener("click", initiatePointButtonClicked);
number_buttons.forEach((number) => {
  number.addEventListener("click", initiateNumberButtonClicked);
});
operator_buttons.forEach((operator) =>
  operator.addEventListener("click", initiateOperatorButtonClicked)
);
equal_button.addEventListener("click", initiateEqualButtonAction);

function initiatePointButtonClicked() {
  displayCharacter(point_button.innerText);
}

function initiateNumberButtonClicked() {
  displayCharacter(this.innerText);
}

function initiateOperatorButtonClicked() {
  displayCharacter(this.innerText);
}

function initiateEqualButtonAction() {
  setClearButtonToDefault();
  const expression = output_big_p.innerText;
  const operator = getOperator(expression);
  const numbers = getNumbers(expression, operator);
  const result = calculateEquation(operator, numbers);
  displayResult({
    expression,
    operator,
    result,
  });
}
