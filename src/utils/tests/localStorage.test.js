import { encrypt, decrypt } from "../crypto";
import {
  isStringValidExport,
  saveState,
  loadState,
  importStoreData,
  exportStoreData,
  clearStorage,
} from "../localStorage";
import { getInitializedCoreState } from "store/modules/core";

test("should validate import string", () => {
  const testState = {
    core: {},
    apiKeys: {},
  };

  const encrypted = encrypt(testState);

  expect(isStringValidExport(encrypted)).toBe(true);
});

test("should validate import string as invalid", () => {
  const testState = {
    bla: {},
    core: {},
  };

  const encrypted = encrypt(testState);

  expect(isStringValidExport(encrypted)).toBe(false);
});

test("should persist state in localstorage", () => {
  saveState({ ahoj: "a" });

  expect(global.localStorage).toHaveProperty("state");
});

test("should clear state in localstorage", () => {
  saveState({ ahoj: "a" });

  clearStorage();

  expect(global.localStorage).not.toHaveProperty("state");
});

test("should load state from localstorage", () => {
  const testState = {
    core: {
      ahoj: "cau",
    },
    values: [1, 2, 43],
  };

  saveState(testState);

  const loaded = loadState();

  expect(loaded).toEqual(testState);
});

test("should import encrypted string state", () => {
  const testState = {
    core: {},
    apiKeys: {},
  };

  const resultState = {
    core: getInitializedCoreState(),
    apiKeys: {},
  };

  const encrypted = encrypt(testState);
  importStoreData(encrypted);

  expect(loadState()).toEqual(resultState);
});

test("should omit irrelevat properties from imported string state", () => {
  const testState = {
    core: {},
    apiKeys: {},
    bla: 2,
  };

  const encrypted = encrypt(testState);
  importStoreData(encrypted);

  expect(loadState()).not.toHaveProperty("bla");
});

test("should export encrypted store values from localStorage", () => {
  const testState = {
    core: {},
    apiKeys: { exchange: { bla: 1 } },
  };

  saveState(testState);
  const exported = exportStoreData();

  expect(decrypt(exported)).toEqual({ apiKeys: { exchange: { bla: 1 } } });
});

test("should omit irrelevant values from exported state", () => {
  const testState = {
    core: {},
    apiKeys: {},
    bla: 4,
    ble: {},
  };

  saveState(testState);
  const exported = exportStoreData();

  expect(decrypt(exported)).not.toHaveProperty("bla");
  expect(decrypt(exported)).not.toHaveProperty("ble");
  expect(decrypt(exported)).not.toHaveProperty("core");
});
