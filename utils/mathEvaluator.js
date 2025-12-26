// Utility to evaluate mathematical expressions safely
// Supports decimal numbers, 0x... hex literals, 0b... binary literals
// and basic arithmetic operators + - * / % ( ) and ^ (exponent)

function replaceLiterals(expr) {
  // Replace hex literals 0x... with their decimal equivalents
  expr = expr.replace(/0x[0-9a-fA-F]+/g, (match) =>
    String(parseInt(match, 16))
  );
  // Replace binary literals 0b... with decimal
  expr = expr.replace(/0b[01]+/g, (match) =>
    String(parseInt(match.slice(2), 2))
  );
  return expr;
}

function evaluate(input) {
  if (typeof input !== "string") throw new TypeError("Input must be string");
  let expr = input.trim();
  if (expr.length === 0) throw new Error("Empty expression");

  // Allow ^ as exponent operator, convert to ** for JS eval
  expr = expr.replace(/\^/g, "**");

  // Replace 0x and 0b literals
  expr = replaceLiterals(expr);

  // Validate remaining characters: only digits, operators, dots, parentheses and spaces
  if (!/^[0-9+\-*/%().\s*]+$/.test(expr)) {
    throw new Error("Invalid characters in expression");
  }

  // Evaluate in a safe isolated Function
  let result;
  try {
    result = Function(`"use strict"; return (${expr});`)();
  } catch (err) {
    throw new Error("Failed to evaluate expression");
  }

  if (typeof result !== "number" || Number.isNaN(result) || !isFinite(result)) {
    throw new Error("Expression did not evaluate to a finite number");
  }

  return result;
}

module.exports = {
  evaluate,
};
