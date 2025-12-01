import { pipeline } from "node:stream/promises";

import * as readline from "node:readline/promises";
import { stdin } from "node:process";

const { abs, trunc } = Math;

function splitIntoLines(inputStream) {
  return readline.createInterface({ input: inputStream });
}

async function* parseRotations(inputLines) {
  for await (const line of inputLines) {
    yield Number(line.replace("L", "-").replace("R", "+"));
  }
}

async function* reduceIntoArrowPositions(rotations) {
  let position = 50;
  yield position;
  for await (const delta of rotations) {
    position = (position + delta) % 100;
    if (position < 0) position += 100;
    yield position;
  }
}

async function countZeroes(numbers) {
  let count = 0;
  for await (const x of numbers) {
    if (x === 0) count += 1;
  }
  return count;
}

function solvePuzzlePartOne(inputStream) {
  return pipeline(
    inputStream,
    splitIntoLines,
    parseRotations,
    reduceIntoArrowPositions,
    countZeroes
  );
}

async function countZeroPasses(rotations) {
  let position = 50;
  let zeroPasses = 0;

  for await (let rotation of rotations) {
    if (rotation > 0) {
      zeroPasses += trunc((position + rotation) / 100);
    } else {
      zeroPasses += trunc((((100 - position) % 100) + abs(rotation)) / 100);
    }
    position = (position + rotation) % 100;
    if (position < 0) position += 100;
  }

  return zeroPasses;
}

function solvePuzzlePartTwo(input) {
  return pipeline(input, splitIntoLines, parseRotations, countZeroPasses);
}

function solveBothPuzzles(input) {
  return Promise.all([solvePuzzlePartOne(input), solvePuzzlePartTwo(input)]);
}

console.log(await solveBothPuzzles(stdin));
