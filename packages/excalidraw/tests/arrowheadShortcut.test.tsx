import { CODES, KEYS } from "@excalidraw/common";

import { Excalidraw } from "../index";
import { API } from "../tests/helpers/api";
import { Keyboard } from "../tests/helpers/ui";
import { fireEvent, render, screen } from "../tests/test-utils";

const { h } = window;

describe("arrowhead picker shortcuts", () => {
  beforeEach(async () => {
    await render(<Excalidraw handleKeyboardGlobally={true} />);
  });

  const selectArrow = () => {
    const arrow = API.createElement({
      type: "arrow",
      startArrowhead: null,
      endArrowhead: "arrow",
    });

    API.setElements([arrow]);
    API.setSelectedElements([arrow]);

    return arrow;
  };

  it("opens the end arrowhead picker with shift+a and removes it with q", () => {
    selectArrow();

    Keyboard.withModifierKeys({ shift: true }, () => {
      Keyboard.keyPress(KEYS.A);
    });

    expect(h.state.openPopup).toBe("endArrowhead");

    const picker = screen.getByRole("dialog", { name: "arrowhead_end" });
    fireEvent.keyDown(picker, { key: KEYS.Q });

    expect(API.getSelectedElement()).toEqual(
      expect.objectContaining({ type: "arrow", endArrowhead: null }),
    );
  });

  it("opens the start arrowhead picker with option/alt+shift+a", () => {
    selectArrow();

    fireEvent.keyDown(document, {
      key: "Å",
      code: CODES.A,
      altKey: true,
      shiftKey: true,
    });

    expect(h.state.openPopup).toBe("startArrowhead");
    expect(
      screen.getByRole("dialog", { name: "arrowhead_start" }),
    ).toBeInTheDocument();
  });

  it("does not open an arrowhead picker without an arrow selection", () => {
    const rectangle = API.createElement({ type: "rectangle" });
    API.setElements([rectangle]);
    API.setSelectedElements([rectangle]);

    Keyboard.withModifierKeys({ shift: true }, () => {
      Keyboard.keyPress(KEYS.A);
    });

    expect(h.state.openPopup).toBe(null);
  });
});
