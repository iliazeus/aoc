import * as $ from "../../fp.ts";

const solveBothPuzzles = () =>
  $.all([solvePuzzlePartOne(), solvePuzzlePartTwo()]);

const solvePuzzlePartOne = () =>
  $.nodeStdinLines()
    .then(parseInput)
    .then(({ ranges, ids }) =>
      $.resolve(ids).then($.filter(containedInSomeRange(ranges)))
    )
    .then($.count);

const solvePuzzlePartTwo = () =>
  $.nodeStdinLines()
    .then(parseInput)
    .then(({ ranges }) => ranges.sort((a, b) => a[0] - b[0]))
    .then(mergeRanges)
    .then($.map(([from, to]) => to - from + 1))
    .then($.sum);

type Range = [number, number];

const parseInput = async (lines: $.AnyIterable<string>) => {
  lines = $.iter(lines);
  return {
    ranges: await $.resolve(lines)
      .then($.takeUntil((line) => line === ""))
      .then($.map((line) => line.split("-").map((s) => Number(s)) as Range))
      .then($.collectToArray),
    ids: $.resolve(lines).then($.map(Number)),
  };
};

const containedInSomeRange = (ranges: Range[]) => (x: number) =>
  ranges.some(([from, to]) => from <= x && x <= to);

const takeIncreasing = async function* (
  it: $.AnyIterable<number>
): AsyncIterable<number> {
  let prev: number | null = null;
  for await (let cur of it) {
    if (prev == null || cur > prev) yield cur;
    prev = cur;
  }
};

const mergeRanges = async function* (ranges: $.AnyIterable<Range>) {
  let lastRange: Range | null = null;
  for await (let curRange of ranges) {
    if (lastRange && lastRange[1] >= curRange[0]) {
      lastRange[1] = Math.max(lastRange[1], curRange[1]);
    } else {
      if (lastRange) yield lastRange;
      lastRange = curRange;
    }
  }
  if (lastRange) yield lastRange;
};

console.log(await solveBothPuzzles());
