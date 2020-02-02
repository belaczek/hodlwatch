import reducer, {
  modalTypeSelector,
  modalPropsSelector
} from "../modules/modals";

const initialState = {
  modalType: null
};

test("reducer should return initial state", () => {
  const state = reducer(undefined, {});
  expect(state).toEqual(initialState);
});

describe("modals actions", () => {
  const SHOW_MODAL = "SHOW_MODAL";
  const HIDE_MODAL = "HIDE_MODAL";

  test("should set modal to be shown", () => {
    const modalPayload = {
      modalType: "TEST_MODAL",
      props: {
        a: "b",
        c: "d"
      }
    };
    const state = reducer(initialState, {
      type: SHOW_MODAL,
      payload: modalPayload
    });

    expect(state).toHaveProperty("modalType", modalPayload.modalType);
    expect(state).toHaveProperty("props", modalPayload.props);
  });

  test("should reset and hide modal", () => {
    const modalPayload = {
      modalType: "TEST_MODAL",
      props: {
        a: "b",
        c: "d"
      }
    };
    let state = reducer(initialState, {
      type: SHOW_MODAL,
      payload: modalPayload
    });

    state = reducer(state, {
      type: HIDE_MODAL
    });

    expect(state).toEqual(initialState);
  });
});

describe("modals selectors", () => {
  const testState = {
    modals: {
      modalType: "TEST_MODAL",
      props: {
        a: "b"
      }
    }
  };

  test("should select modalType", () => {
    const res = modalTypeSelector(testState);
    expect(res).toEqual(testState.modals.modalType);
  });

  test("should select modal props", () => {
    const res = modalPropsSelector(testState);
    expect(res).toEqual(testState.modals.props);
  });
});
