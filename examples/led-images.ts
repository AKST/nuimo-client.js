export const ledNumberOne = [
  "000111000",
  "001111000",
  "000111000",
  "000111000",
  "000111000",
  "000111000",
  "000111000",
  "011111110",
  "011111110"
];

export const ledNumberTwo = [
  "000111000",
  "001111100",
  "011001110",
  "000000110",
  "000000110",
  "000011100",
  "001110000",
  "011111110",
  "011111110"
];

export const ledNumberThree = [
  "001111100",
  "011101110",
  "000000111",
  "000000111",
  "011111110",
  "000000111",
  "011000111",
  "011101110",
  "001111100"
];

// Can also define the array like so...
export const ledSquare = [
  1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1
];

var images: { [name: string]: string | string[] | number[]; } = {
  one: ledNumberOne,
  two: ledNumberTwo,
  three: ledNumberThree,
  square: ledSquare
};

export default images;
