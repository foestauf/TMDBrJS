function applyCaseMiddleware<T>(input: T, caseFunction: (input: string) => string): T {
  if (Array.isArray(input)) {
    return input.map((i: unknown) => applyCaseMiddleware(i, caseFunction)) as T;
  } else if (typeof input === 'object' && input !== null) {
    const newObj: any = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        newObj[caseFunction(key)] = applyCaseMiddleware(input[key], caseFunction);
      }
    }
    return newObj;
  } else {
    return input;
  }
}

export { applyCaseMiddleware };
