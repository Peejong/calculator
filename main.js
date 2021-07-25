const expression_p = document.querySelector(".output-expression");
const result_p = document.querySelector(".output-result");
const clear_button = document.querySelector(".btn-clear");
const MATH_OPERATORS = ["+", "-", "x", "÷"];

const alterToClearEntityButton = () => {
  if (result_p.innerText) clear_button.innerText = "CE";
};

const alterToClearGlobalButton = () => {
  if (result_p.innerText === "") clear_button.innerText = "C";
};

const setToClearGlobalButton = () => {
  clear_button.innerText = "C";
};

const clearGlobal = () => {
  expression_p.innerText = "";
  result_p.innerText = "";
  alterToClearGlobalButton();
};

const clearEntity = () => {
  let resultLastCharRemoved = result_p.innerText.slice(0, -1);
  result_p.innerText = resultLastCharRemoved;
  alterToClearGlobalButton();
};

const displayCharSelected = (char) => {
  return (result_p.innerText += char);
};

const getCurrentUseOperator = (expression) => {
  return expression
    .split("")
    .filter((operator) => MATH_OPERATORS.includes(operator))
    .join("");
};

const getCurrentNumbers = (expression, operator) => {
  const convertStringToNumber = (string) => {
    let numbers;
    const convertToNumberWithDecimal = () => {
      if (string.includes(".")) numbers = parseFloat(string);
    };

    const convertToWholeNumber = () => {
      if (!string.includes(".")) numbers = parseInt(string);
    };

    convertToNumberWithDecimal();
    convertToWholeNumber();
    return numbers;
  };

  return expression
    .split(operator)
    .map((number) => convertStringToNumber(number));
};

const calculateNumbers = (numbers, operator) => {
  const unableToCalculate = () => {
    return "Syntax Error";
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

  const divideNumber = () => {
    return numbers.reduce((result, number) => {
      if (result === 0 && number === 0) return "Error";
      if (result === 0) return 0;
      if (number === 0) return "Infinity";

      return result / number;
    });
  };

  if (numbers.includes(NaN)) return unableToCalculate();
  if (operator === "+") return addNumbers();
  if (operator === "-") return subtractNumbers();
  if (operator === "x") return multiplyNumbers();
  if (operator === "÷") return divideNumber();
};

const displayResult = (expression, operator, answer) => {
  const addSpaceInExpression = () => {
    expression_p.innerText = expression.split(operator).join(` ${operator} `);
  };

  const displayAnswer = () => {
    result_p.innerText = answer;
  };

  addSpaceInExpression();
  displayAnswer();
};

const initiateButtonActions = () => {
  const number_buttons = document.querySelectorAll(".btn-num");
  const point_button = document.querySelector(".btn-point");
  const operator_buttons = document.querySelectorAll(".btn-operators");
  const equal_button = document.querySelector(".btn-equal");

  clear_button.addEventListener("click", initiateClearButtonAction);
  point_button.addEventListener("click", displayPointButtonClicked);
  number_buttons.forEach((number) => {
    number.addEventListener("click", initiateNumberButtonAction);
  });
  operator_buttons.forEach((operator) =>
    operator.addEventListener("click", initiateOperatorButtonAction)
  );
  equal_button.addEventListener("click", initiateEqualButtonAction);

  function initiateClearButtonAction() {
    if (clear_button.innerText === "C") clearGlobal();
    if (clear_button.innerText === "CE") clearEntity();
  }

  function displayPointButtonClicked() {
    displayCharSelected(point_button.innerText);
    alterToClearEntityButton();
  }

  function initiateNumberButtonAction() {
    displayCharSelected(this.innerText);
    alterToClearEntityButton();
  }

  function initiateOperatorButtonAction() {
    displayCharSelected(this.innerText);
    alterToClearEntityButton();
  }

  function initiateEqualButtonAction() {
    const expression = result_p.innerText;
    const operator = getCurrentUseOperator(expression);
    const numbers = getCurrentNumbers(expression, operator);
    const answer = calculateNumbers(numbers, operator);

    displayResult(expression, operator, answer);
    setToClearGlobalButton();
  }
};

const initiateKeyboardActions = () => {
  window.addEventListener("keydown", initiateKeydownActions);
  window.addEventListener("keypress", initiateKeypressActions);

  function initiateKeydownActions(e) {
    const initiateBackspaceAction = (keyCode) => {
      if (keyCode === 8) clear_button === "C" ? clearGlobal() : clearEntity();
    };

    const initiateDeleteAction = (keyCode) => {
      if (keyCode === 46) clearGlobal();
    };

    const initiateEnterAction = (keyCode) => {
      if (keyCode == 13) console.log("Poggers");
    };

    const initiateEqualAction = (e) => {
      if (e.keyCode === 187 && !e.shiftKey) console.log("Poggers");
    };

    initiateBackspaceAction(e.keyCode);
    initiateDeleteAction(e.keyCode);
    initiateEnterAction(e.keyCode);
    initiateEqualAction(e);
  }

  function initiateKeypressActions(e) {
    const displayPoint = (point) => {
      if (point === "." && result_p.innerText.includes("."))
        return displayCharSelected(point);
    };

    const displayNumber = (number) => {
      if (+number) return displayCharSelected(number);
    };

    const initiateOperatorActions = (operator) => {
      const displayAddOperator = () => {
        if (operator === "+") return displayCharSelected(operator);
      };

      const displaySubtractOperator = () => {
        if (operator === "-") return displayCharSelected(operator);
      };

      const displayMultiplyOperator = () => {
        const MULTIPLICATION_KEYS = ["*", "x", "X"];
        for (let i = 0; i < MULTIPLICATION_KEYS.length; i++) {
          if (operator === MULTIPLICATION_KEYS[i])
            return (result_p.innerText += "x");
        }
      };

      const displayDivideOperator = () => {
        if (operator === "/") return (result_p.innerText += "÷");
      };

      displayAddOperator();
      displaySubtractOperator();
      displayMultiplyOperator();
      displayDivideOperator();
    };

    displayPoint(e.key);
    displayNumber(e.key);
    initiateOperatorActions(e.key);
    alterToClearEntityButton();
  }
};

initiateButtonActions();
initiateKeyboardActions();
