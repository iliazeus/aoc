import * as $ from "../../fp.ts";

const solveBothPuzzles = () =>
  $.all([solvePuzzleWithTupleSize(2), solvePuzzleWithTupleSize(12)]);

const solvePuzzleWithTupleSize = (size: number) =>
  $.nodeStdinLines()
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

console.log(await solveBothPuzzles());
