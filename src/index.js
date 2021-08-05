function expressionCalculator(expr) {
  let mrks = expr.split(" ");
  mrks = mrks.join("");
  mrks = mrks.match(/[^\d()]+|[\d.]+|[()]/g);

  let stack = 0;
  mrks.forEach((e) => {
    if (e === "(") ++stack;
    else if (e === ")") {
      --stack;
      if (stack < 0) {
        throw new Error("ExpressionError: Brackets must be paired");
      }
    }
  });
  if (stack !== 0) throw new Error("ExpressionError: Brackets must be paired");

  function calculate(box) {
    for (let i = 0; i < box.length; i++) {
      if (box[i] === "*" || box[i] === "/") {
        let x;
        if (box[i] === "*") {
          x = box[i - 1] * box[i + 1];
          box.splice(i - 1, 3, x);
          i = i - 1;
        } else if (box[i] === "/") {
          if (box[i + 1] == 0) {
            throw new Error("TypeError: Division by zero.");
          } else {
            x = box[i - 1] / box[i + 1];
            box.splice(i - 1, 3, x);
            i = i - 1;
          }
        }
      }
    }

    for (let i = 0; i < box.length; i++) {
      if (box[i] === "+" || box[i] === "-") {
        let x;
        if (box[i] === "+") {
          x = Number(box[i - 1]) + Number(box[i + 1]);
          box.splice(i - 1, 3, x);
          i = i - 1;
        } else if (box[i] === "-") {
          x = Number(box[i - 1]) - Number(box[i + 1]);
          box.splice(i - 1, 3, x);
          i = i - 1;
        }
      }
    }
  }

  function calculateFromTo(start, finish) {
    const box = [];
    for (let i = start + 1; i < finish; i++) {
      box.push(mrks[i]);
    }

    calculate(box)
    mrks.splice(start, finish - start + 1, box[0])
  }

  let scopeToggle = true;

  while (scopeToggle) {
    scopeToggle = false;
    let start;
    let finish;
    for (let i = 0; i < mrks.length; i++) {
      if (mrks[i] === "(") {
        start = i;
      }
      if (mrks[i] === ")") {
        scopeToggle = true;
        finish = i;
        calculateFromTo(start, finish);
        break;
      }
    }
  }

  calculate(mrks)

  return mrks[0];
}

module.exports = {
  expressionCalculator,
};
