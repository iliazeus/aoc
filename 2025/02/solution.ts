import * as $ from "../../fp.ts";

export const checkSolution = async () => {
  let input = () => $.nodeFileLines(import.meta.dirname + "/input.txt");
  $.assertEqual(await solvePuzzlePartOne(input), 56660955519);
  $.assertEqual(await solvePuzzlePartTwo(input), 79183223243);
};

const solvePuzzlePartOne = (input: $.Lazy<$.Lines>) =>
  $.resolve(input())
    .then(parseInput)
    .then($.flatMap(iterateThroughRange))
    .then($.filter(isInvalidPartOne))
    .then($.sum);

const solvePuzzlePartTwo = (input: $.Lazy<$.Lines>) =>
  $.resolve(input())
    .then(parseInput)
    .then($.flatMap(iterateThroughRange))
    .then($.filter(isInvalidPartTwo))
    .then($.sum);

type Range = { from: number; to: number };

const parseInput = (lines: $.AnyIterable<string>) =>
  $.resolve(lines)
    .then($.flatMap((s) => s.split(",")))
    .then($.map((s) => s.match(/(\d+)-(\d+)/)))
    .then($.assertEachNotNull)
    .then($.map(([, _1, _2]) => ({ from: +_1, to: +_2 })));

const iterateThroughRange = function* ({ from, to }: Range) {
  for (let i = from; i <= to; i++) yield i;
};

const isInvalidPartOne = (id: number) => {
  let s = String(id);
  if (s.length % 2 == 1) return false;
  return s.slice(0, s.length / 2) == s.slice(s.length / 2);
};

const isInvalidPartTwo = (id: number) => {
  let s = String(id);
  outer: for (let n = 1; n * 2 <= s.length; n++) {
    if (s.length % n !== 0) continue;
    for (let i = 0; i < s.length / n - 1; i++) {
      if (s.slice(i * n, (i + 1) * n) != s.slice((i + 1) * n, (i + 2) * n)) {
        continue outer;
      }
    }
    return true;
  }
  return false;
};
