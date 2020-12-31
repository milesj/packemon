const envs = {
  DEV: true,
  PROD: false,
  TEST: false, // Avoid for self
};

Object.entries(envs).forEach(([name, bool]) => {
  // @ts-expect-error
  global[`__${name}__`] = bool;
});
