const envs = {
  DEV: true,
  PROD: false,
  TEST: false, // Avoid for self
};

Object.entries(envs).forEach(([name, bool]) => {
  global[`__${name}__`] = bool;
});
