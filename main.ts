import { argv } from "node:process";

let solutions: Iterable<string> = [
  "./2025/01/solution.ts",
  "./2025/02/solution.ts",
  "./2025/03/solution.ts",
  "./2025/04/solution.ts",
  "./2025/05/solution.ts",
];

if (argv.length > 2) {
  solutions = new Set(
    argv
      .slice(2)
      .map((a) => solutions[+a - 1])
      .filter((x) => x)
  );
}

for (const solutionPath of solutions) {
  console.time(solutionPath);
  await import(solutionPath).then((s) => s.checkSolution());
  console.timeEnd(solutionPath);
}
