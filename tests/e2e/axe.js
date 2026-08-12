import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export async function expectNoAxeViolations(page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(
    results.violations,
    results.violations
      .map(
        (violation) =>
          `${violation.id} (${violation.impact}): ${violation.help}\n${violation.nodes
            .map((node) => `  - ${node.target.join(" ")}`)
            .join("\n")}`,
      )
      .join("\n\n"),
  ).toEqual([]);
}
