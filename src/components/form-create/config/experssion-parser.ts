/**
 * @param  {} expression
 * input: a=1 && b>2 || c!=3
 * output: [{variable:a, operator: '=',value: 1}]
 */

export const parseExpression = (expression) => {
  if (!expression) return [];
  const parseExprRegx = /([a-zA-Z_]\w*)\s*([=!<>]+)\s*([^&|]+)/g;
  const matches = expression?.matchAll(parseExprRegx);
  const result: any[] = [];
  const list: any[] = Array.from(matches);

  list?.forEach?.((match) => {
    const variable = match[1];
    const operator = match[2];
    const value = match[3].trim();

    result.push({
      variable,
      operator,
      value
    });
  });
  return result;
};

// parse a experssion
export const parseExpressionBySub = (expression) => {
  const subExpressions: any[] = [];
  let currentSubExpression = '';

  for (let i = 0; i < expression.length; i += 1) {
    const char = expression[i];

    if (char === '(') {
      let count = 1;
      i += 1;

      while (i < expression.length && count > 0) {
        if (expression[i] === '(') {
          count += 1;
        } else if (expression[i] === ')') {
          count -= 1;
        }

        if (count > 0) {
          currentSubExpression += expression[i];
        }

        i += 1;
      }

      subExpressions.push(currentSubExpression.trim());
      currentSubExpression = '';
    } else if (char === '&' && expression[i + 1] === '&') {
      subExpressions.push(currentSubExpression.trim());
      currentSubExpression = '';
      i += 1;
    } else if (char === '|' && expression[i + 1] === '|') {
      subExpressions.push(currentSubExpression.trim());
      currentSubExpression = '';
      i += 1;
    } else {
      currentSubExpression += char;
    }
  }

  if (currentSubExpression !== '') {
    subExpressions.push(currentSubExpression.trim());
  }

  return subExpressions;
};

export const isAndCondition = (expression) => {
  // 使用正则表达式匹配条件表达式的模式
  // const pattern = /\s*\(.*?\)\s*&&\s*\(.*?\)\s*/;
  const pattern = /^.*&&.*$/;

  // 返回是否匹配成功
  return pattern.test(expression);
};

export const isOrCondition = (expression) => {
  // 使用正则表达式匹配条件表达式的模式
  // const pattern = /\s*\(.*?\)\s*\|\|\s*\(.*?\)\s*/;
  const pattern = /^.*\|\|.*$/;

  // 返回是否匹配成功
  return pattern.test(expression);
};

export default {};
