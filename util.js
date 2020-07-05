const UUIDGeneratorBrowser = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

const yesterday = () => {
  let t = new Date();
  t.setDate(t.getDate() - 1);
  return t.toISOString().split("T")[0];
};

const util = { UUIDGeneratorBrowser, yesterday }
