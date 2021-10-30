function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getRandomWord(words) {
  const n = getRandomInt(words.length)

  return words[n]
}

function getRandomWordLess(words, size) {
  const arr = words.filter(val => val.length < size)

  return arr[getRandomInt(arr.length)]
}

function getRandomWordEqual(words, length) {
  const arr = words.filter(val => val.length === length)

  return arr[getRandomInt(arr.length)]
}

function getRandomWordGreater(words, size) {
  const arr = words.filter(val => val.length > size)

  return arr[getRandomInt(arr.length)]
}

function getRandomWordBetween(words, min, max) {
  const arr = words.filter(val => val.length >= min && val.length <= max)

  return arr[getRandomInt(arr.length)]
}

function getGridWithMaxWords(grids) {
  return grids.reduce((grid, item) => item.words.length > grid.words.length ? item : grid, grids[0])
}

function getGridWithWordsEqual(grids, length) {
  return grids.filter((grid) => grid.words.length === length)[0]
}

export function useUtils() {
  return {
    getRandomWord,
    getRandomWordLess,
    getRandomWordEqual,
    getRandomWordGreater,
    getRandomWordBetween,
    getGridWithMaxWords,
    getGridWithWordsEqual,
  }
}
