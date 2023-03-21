import "./style.css";
import data_female from "./data/swedish_female_names.json";
import data_male from "./data/Sweden_male_names.json";

// Creates hashmap with value: bigram and key: count
const buildMap = () => {
  const biGramHashMap = new Map();
  data_female.forEach((name) => {
    const completeName = `#${name.toLocaleLowerCase()}.`;

    for (let i = 0; i < completeName.length - 1; i++) {
      const bigram = completeName[i] + completeName[i + 1];

      biGramHashMap.set(bigram, (biGramHashMap.get(bigram) || 0) + 1);
    }
  });
  return biGramHashMap;
};

// Quicksorts the bigram array
const quickSort = (arr) => {
  const a = [...arr];
  if (a.length < 2) return a;
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = a[pivotIndex];
  const [lo, hi] = a.reduce(
    (acc, val, i) => {
      if (val[1] > pivot[1] || (val[1] === pivot[1] && i != pivotIndex)) {
        acc[0].push(val);
      } else if (val[1] < pivot[1]) {
        acc[1].push(val);
      }
      return acc;
    },
    [[], []]
  );
  return [...quickSort(lo), pivot, ...quickSort(hi)];
};

const biGramHashMap = buildMap();
const sortedbigramArray = quickSort(Array.from(biGramHashMap.entries()));

const pickRandomWeighted = (arr) => {
  const total = arr.reduce((acc, [, weight]) => acc + weight, 0);
  let random = Math.random() * total;
  const [result] = arr.find(([, weight]) => (random -= weight) < 0) || [];
  return !result.endsWith(".") ? result : pickRandomWeighted(sortedbigramArray);
};

const pickRandomBigram = (startChar, lastLetter) => {
  const filteredBigrams = sortedbigramArray.filter((el) => {
    if (lastLetter) {
      return el[0].endsWith(".");
    } else if (
      !el[0].endsWith(".") &&
      !el[0].endsWith("-") &&
      !el[0].endsWith(" ")
    ) {
      return el[0].startsWith(startChar);
    }
  });
  return pickRandomWeighted(filteredBigrams);
};

const createUniqueName = () => {
  const firstLetter = "#" + pickRandomWeighted(sortedbigramArray)[1];
  const nameBigrams = [firstLetter];

  // pushes second letter if it is not same as first
  while (true) {
    let secondLetter = pickRandomBigram(firstLetter[1]);
    if (secondLetter[1] !== firstLetter[1]) {
      nameBigrams.push(secondLetter);
      break;
    }
  }
  for (let i = 0; i < 3; i++) {
    nameBigrams.push(pickRandomBigram(nameBigrams[i].substring(1, 2)));
  }
  // last letter
  nameBigrams.push(pickRandomBigram("", true)[0].split("").reverse().join(""));

  const name = nameBigrams.map((el) => el.slice(1, 2)).join("");
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const name = createUniqueName();
const nameArr = name.split("");
console.log(name);
