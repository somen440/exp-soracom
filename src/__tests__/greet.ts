import { greet } from "../greet";

test("greet test", () => {
  expect(greet("test")).toBe("Hello, test !!");
});
