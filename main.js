const output_small_p = document.querySelector(".output-small");
const output_big_p = document.querySelector(".output-big");
const clear_button = document.querySelector(".btn-clear");
let currentOperatorUsed = "";
let isOutputDisplaysError = false;
let isOutputDisplaysAnswer = false;

const setClearButtonToDefault = () => (clear_button.textContent = "AC");

const alterClearButtonLabel = () => {
  const alterToAC = () => {
    if (output_big_p.textContent === "") clear_button.textContent = "AC";
  };

  const alterToCE = () => {
    if (output_big_p.textContent) clear_button.textContent = "CE";
  };

  alterToAC();
  alterToCE();
};

const clearAllEntities = () => {
  output_small_p.textContent = "";
  output_big_p.textContent = "";
};

const clearLastEntity = () => {
  let lastEntityCleared = output_big_p.textContent.slice(0, -1);

  output_big_p.textContent = lastEntityCleared;
};

const clearOutputEntities = () => {
  if (clear_button.textContent === "AC") clearAllEntities();
  if (clear_button.textContent === "CE") clearLastEntity();
  alterClearButtonLabel();
};

const displayInputEntities = (char) => {
  const displayPreviousAnswer = () => {
    if (!isOutputDisplaysAnswer || +char) return;
    isOutputDisplaysAnswer = false;
    output_small_p.textContent = `Ans: ${output_big_p.textContent}`;
  };

  const resetDisplayOutput = () => {
    if (!isOutputDisplaysError && !isOutputDisplaysAnswer) return;
    isOutputDisplaysAnswer = false;
    isOutputDisplaysError = false;
    clearAllEntities();
  };

  const combineInputEntities = () => (output_big_p.textContent += char);

  displayPreviousAnswer();
  resetDisplayOutput();
  combineInputEntities();
  alterClearButtonLabel();
};

const getCurrentOperatorUsed = (operator) => {
  if (currentOperatorUsed) evaluateInputExpression();
  currentOperatorUsed = operator;
};

const evaluateInputExpression = () => {
  const getNumbers = (expression, operator) => {
    const convertStringToNumber = (string) => {
      if (string.includes(".")) return parseFloat(string);
      return parseInt(string);
    };

    return expression
      .split(operator)
      .map((numbers) => convertStringToNumber(numbers));
  };

  const calculateExpression = (operator, numbers) => {
    const calculateWithMissingNumber = () => "Syntax Error";

    const calculateWithoutOperator = () => numbers.join("");

    const calculateAddition = () =>
      numbers.reduce((numberOne, numberTwo) => numberOne + numberTwo);

    const calculateSubtraction = () =>
      numbers.reduce((numberOne, numberTwo) => numberOne - numberTwo);

    const calculateMultiplication = () =>
      numbers.reduce((numberOne, numberTwo) => numberOne * numberTwo);

    const calculateDivision = () =>
      numbers.reduce((numberOne, numberTwo) => {
        if (numberOne === 0 && numberTwo === 0) return "Syntax Error";
        if (numberOne === 0) return 0;
        if (numberTwo === 0) return "Infinity";

        return numberOne / numberTwo;
      });

    if (numbers.includes(NaN)) return calculateWithMissingNumber();
    if (operator === "") return calculateWithoutOperator();
    if (operator === "+") return calculateAddition();
    if (operator === "-") return calculateSubtraction();
    if (operator === "x") return calculateMultiplication();
    if (operator === "÷") return calculateDivision();
  };

  const checkResult = (result) => {
    if (result === "Syntax Error") isOutputDisplaysError = true;
    if (result !== "Syntax Error") isOutputDisplaysAnswer = true;
  };

  const displayExpression = ({ expression, operator, result }) => {
    if (isOutputDisplaysError) return;

    const displayWithOperator = () => {
      if (operator)
        output_small_p.textContent = expression
          .split(operator)
          .join(` ${operator} `);
    };

    const displayWithoutOperator = () => {
      if (!operator) output_small_p.textContent = result;
    };

    displayWithOperator();
    displayWithoutOperator();
  };

  const displayResult = (result) => (output_big_p.textContent = result);
  const resetOperatorUsed = () => (currentOperatorUsed = "");

  setClearButtonToDefault();
  const expression = output_big_p.textContent;
  const operator = currentOperatorUsed;
  const numbers = getNumbers(expression, operator);
  const result = calculateExpression(operator, numbers);
  checkResult(result);
  displayExpression({
    expression,
    operator,
    result,
  });
  displayResult(result);
  resetOperatorUsed();
};

const point_button = document.querySelector(".btn-point");
const number_buttons = document.querySelectorAll(".btn-num");
const operator_buttons = document.querySelectorAll(".btn-operators");
const equal_button = document.querySelector(".btn-equal");

clear_button.addEventListener("click", clearOutputEntities);
point_button.addEventListener("click", (e) =>
  displayInputEntities(point_button.textContent)
);
number_buttons.forEach((number) => {
  number.addEventListener("click", (e) =>
    displayInputEntities(number.textContent)
  );
});
operator_buttons.forEach((operator) => {
  operator.addEventListener("click", (e) => {
    getCurrentOperatorUsed(operator.textContent);
    displayInputEntities(operator.textContent);
  });
});
equal_button.addEventListener("click", evaluateInputExpression);

window.addEventListener("keydown", initiateKeydownActions);

function initiateKeydownActions(e) {
  e.preventDefault();
  if (e.key === "Backspace") clearOutputEntities();
  if (e.key === "Delete") clearAllEntities();
  if (!isNaN(e.key) || e.key === ".") displayInputEntities(e.key);
  if (e.key === "+" || e.key === "-") {
    getCurrentOperatorUsed(e.key);
    displayInputEntities(e.key);
  }
  if (e.key === "X" || e.key === "x" || e.key === "*") {
    getCurrentOperatorUsed("x");
    displayInputEntities("x");
  }
  if (e.key === "/") {
    getCurrentOperatorUsed("÷");
    displayInputEntities("÷");
  }
  if (e.key === "=" || e.key === "Enter") {
    evaluateInputExpression();
  }
}
