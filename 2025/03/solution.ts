import * as $ from "../../fp.ts";

export const checkSolution = async () => {
  let input = () => $.nodeFileLines(import.meta.dirname + "/input.txt");
  $.assertEqual(await solvePuzzlePartOne(input), 17100);
  $.assertEqual(await solvePuzzlePartTwo(input), 170418192256861);
};

const solveBothPuzzles = () =>
  $.all([solvePuzzleWithTupleSize(2), solvePuzzleWithTupleSize(12)]);

const solvePuzzlePartOne = (input: $.Lazy<$.Lines>) =>
  solvePuzzleWithTupleSize(2)(input);
const solvePuzzlePartTwo = (input: $.Lazy<$.Lines>) =>
  solvePuzzleWithTupleSize(12)(input);

const solvePuzzleWithTupleSize = (size: number) => (input: $.Lazy<$.Lines>) =>
  $.resolve(input())
    .then($.map((line) => maxJolts(size)(line)))
    .then($.sum);

const maxJolts = $.memo((size: number) =>
  $.memo((line: string) => {
    let max = -1;

    for (let d = 1; d <= 9; d++) {
      let i = line.indexOf(String(d));
      if (i < 0) continue;

      let cand = String(d);

      if (size > 1) {
        let sub = maxJolts(size - 1)(line.slice(i + 1));
        if (sub < 0) continue;
        cand += sub;
      }

      if (+cand > max) max = +cand;
    }

    return max;
  })
);
