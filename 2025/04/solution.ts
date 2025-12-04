import * as $ from "../../fp.ts";

const solveBothPuzzles = () =>
  $.all([solvePuzzlePartOne(), solvePuzzlePartTwo()]);

const solvePuzzlePartOne = () =>
  $.nodeStdinLines()
    .then($.map((s) => [...s]))
    .then($.collectToArray)
    .then(accessibleCoords)
    .then($.count);

const solvePuzzlePartTwo = () =>
  $.nodeStdinLines()
    .then($.map((s) => [...s]))
    .then($.collectToArray)
    .then((map) => ({ rem: 0, map }))
    .then(
      $.iterate(async ({ rem, map }) => ({
        rem: rem + (await $.count(await accessibleCoords(map))),
        map: await removeRolls(map, await accessibleCoords(map)),
      }))
    )
    .then($.forEach((x) => console.log(x.rem)))
    .then($.pairs)
    .then($.filter(([prev, cur]) => cur.rem === prev.rem))
    .then($.map(([prev, cur]) => cur.rem))
    .then($.takeFirst);

type Coords = [number, number];

const accessibleCoords = (map: string[][]) => {
  let idx = pad2d(map, ".");
  return $.resolve(allCoords(map))
    .then($.filter((x) => idx(x) === "@"))
    .then($.map((p) => ({ p, ns: neighbors(p) })))
    .then($.filter(({ ns }) => ns.filter((x) => idx(x) === "@").length < 4))
    .then($.map(({ p }) => p));
};

const allCoords = function* (map: string[][]): Iterable<Coords> {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      yield [row, col];
    }
  }
};

const neighbors = ([row, col]: Coords): Coords[] => [
  [row - 1, col - 1],
  [row - 1, col],
  [row - 1, col + 1],
  [row, col - 1],
  [row, col + 1],
  [row + 1, col - 1],
  [row + 1, col],
  [row + 1, col + 1],
];

const pad2d =
  <T>(map: T[][], pad: T) =>
  ([row, col]: Coords) =>
    map[row]?.[col] ?? pad;

const removeRolls = async (map: string[][], coords: $.AnyIterable<Coords>) => {
  map = structuredClone(map);
  for await (const [row, col] of coords) map[row][col] = ".";
  return map;
};

const untilNonDecreasingBy =
  <T>(f: (t: T) => number | Promise<number>) =>
  async (it: $.AnyIterable<T>) => {
    for await (const [prev, cur] of $.pairs(it)) {
      console.log(".");
      let fprev = f(prev);
      let fcur = f(cur);
      if (fcur > fprev) throw new Error();
      if (fcur === fprev) return cur;
    }
    throw new Error();
  };

console.log(await solveBothPuzzles());
