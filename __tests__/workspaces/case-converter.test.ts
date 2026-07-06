import { describe, it, expect } from "vitest";
import { convert } from "@/components/workspaces/CaseConverter";

describe("convert (case converter)", () => {
  it("upper / lower sur la chaîne entière", () => {
    expect(convert("Hello World", "upper")).toBe("HELLO WORLD");
    expect(convert("Hello World", "lower")).toBe("hello world");
  });

  it("title case", () => {
    expect(convert("hello world from utilisio", "title")).toBe("Hello World From Utilisio");
  });

  it("camelCase et PascalCase", () => {
    expect(convert("hello world example", "camel")).toBe("helloWorldExample");
    expect(convert("hello world example", "pascal")).toBe("HelloWorldExample");
  });

  it("snake_case et kebab-case", () => {
    expect(convert("Hello World Example", "snake")).toBe("hello_world_example");
    expect(convert("Hello World Example", "kebab")).toBe("hello-world-example");
  });

  it("découpe le camelCase existant", () => {
    expect(convert("helloWorld", "snake")).toBe("hello_world");
    expect(convert("myVariableName", "kebab")).toBe("my-variable-name");
  });

  it("gère les séparateurs mixtes (tirets, underscores)", () => {
    expect(convert("foo-bar_baz", "camel")).toBe("fooBarBaz");
    expect(convert("foo-bar_baz", "pascal")).toBe("FooBarBaz");
  });

  it("chaîne vide → chaîne vide", () => {
    expect(convert("", "camel")).toBe("");
  });
});
