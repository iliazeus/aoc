import * as $ from "../../fp.ts";

const solveBothPuzzles = () =>
  $.all([solvePuzzlePartOne(), solvePuzzlePartTwo()]);

const solvePuzzlePartOne = () =>
  $.nodeStdinLines()
    .then($.map(parseRotation))
    .then($.acc(50, (a, x) => a + x))
    .then($.filter((x) => x % 100 === 0))
    .then($.count);

const solvePuzzlePartTwo = () =>
  $.nodeStdinLines().then($.map(parseRotation)).then(countZeroPasses);

const parseRotation = (line: string) =>
  Number(line.replace("L", "-").replace("R", "+"));

const countZeroPasses = async (rotations: $.AnyIterable<number>) => {
  let position = 50;
  let zeroPasses = 0;

  for await (let rotation of rotations) {
    if (rotation > 0) {
      zeroPasses += $.trunc((position + rotation) / 100);
    } else {
      zeroPasses += $.trunc((((100 - position) % 100) + $.abs(rotation)) / 100);
    }
    position = (position + rotation) % 100;
    if (position < 0) position += 100;
  }

  return zeroPasses;
};

console.log(await solveBothPuzzles());
