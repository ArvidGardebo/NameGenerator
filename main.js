import "./style.css";
import data from "./data/swedish_female_names.json";

const buildMap = () => {
  const biGramHashMap = new Map();
  data.forEach((name) => {
    const completeName = `#${name.toLocaleLowerCase()}.`;

    for (let i = 0; i < completeName.length - 1; i++) {
      const bigram = completeName[i] + completeName[i + 1];

      if (!biGramHashMap.has(bigram)) {
        biGramHashMap.set(bigram, 1);
      } else {
        let key = biGramHashMap.get(bigram);
        biGramHashMap.set(bigram, (key += 1));
      }
    }
  });
  return biGramHashMap;
};
// value: bigram, key: count
const biGramHashMap = buildMap();
const sortedbiGramArray = Array.from(biGramHashMap.entries()).sort(
  (a, b) => b[1] - a[1]
);

const rndOfTop5 = (startChar) => {
  const top5 = sortedbiGramArray.filter((el) => {
    return (
      !el[0].endsWith(".") &&
      !el[0].endsWith("-") &&
      !el[0].endsWith(" ") &&
      el[0].startsWith(startChar)
    );
  });

  return top5.splice(0, 5)[Math.floor(Math.random() * 5)];
};

const createUniqueName = () => {
  const name = [rndOfTop5("#")[0]];

  for (let i = 0; i < 5; i++) {
    const newChar = rndOfTop5(name[i].substring(1, 2))[0];
    name.push(newChar);
  }
  return name.map((el) => el.slice(1, 2)).join("");
};

console.log(createUniqueName());
