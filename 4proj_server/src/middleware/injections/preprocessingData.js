const getTransactions = async () => {
  let data = [];
  await require("axios")
    .get("http://localhost:3333/products/transactions")
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {
      console.error(err);
    });
  return data;
};

const getItems = async () => {
  let data = [];
  await require("axios")
    .get("http://localhost:3333/products/items")
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {
      console.error(err);
    });
  return data;
};

const getTotalCount = (scoring) => {
  let totalCount = 0;
  for (let i = 0; i < scoring.length; i++) {
    const element = scoring[i];
    totalCount += element.count;
  }
  return totalCount;
};

const counting = async (allTransactions, allItems) => {
  let scoring = [];
  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    scoring.push({
      _id: item._id,
      lineNumber: item.lineNumber,
      itemLabel: item.labels,
      labels: item.labels,
      level1: item.level1,
      level2: item.level2,
      count: 0,
    });
    for (let j = 0; j < allTransactions.length; j++) {
      const transaction = allTransactions[j];
      for (let k = 0; k < transaction.items.length; k++) {
        const transacItem = transaction.items[k];
        if (item.labels === transacItem.labels) {
          scoring[i].count++;
        }
      }
    }
  }
  let totalCount = await getTotalCount(scoring);
  return { scoring, totalCount };
};

const getFrequency = (scoring, totalCount) => {
  for (let i = 0; i < scoring.length; i++) {
    const element = scoring[i];
    element.freq = (element.count / totalCount) * 100;
  }
  return scoring;
};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const countFreqSort = async (allTransactions, allItems) => {
  const { scoring, totalCount } = await counting(allTransactions, allItems);
  const newScoring = await getFrequency(scoring, totalCount);
  newScoring.sort(function (a, b) {
    return b.freq - a.freq;
  });
  return { newScoring, totalCount };
};

const getRandomTransactions = (nbr, allTransactions) => {
  let randomTransactions = [];
  while (randomTransactions.length < nbr) {
    let index = randomIntFromInterval(0, allTransactions.length - 1);
    randomTransactions.push(allTransactions[index]);
  }
  return randomTransactions;
};

const getlvl1 = (allItems) => {
  let level1 = [];
  for (let i = 0; i < allItems.length; i++) {
    const element = allItems[i];
    if (!level1.includes(element.level1)) {
      level1.push(element.level1);
    }
  }
  return level1;
};

const getlvl2 = (allItems) => {
  let level2 = [];
  for (let i = 0; i < allItems.length; i++) {
    const element = allItems[i];
    if (!level2.includes(element.level2)) {
      level2.push(element.level2);
    }
  }
  return level2;
};

const getLevels = (allItems) => {
  const level1 = getlvl1(allItems);
  const level2 = getlvl2(allItems);
  return { level1, level2 };
};

const preProcessData = (newScoring) => {
  for (let i = 0; i < newScoring.length; i++) {
    let element = newScoring[i];
    element.coefPrice = (i + 1) / 2;
    element.datePeremption = (i + 1) * 2;
  }
  return newScoring;
};

const updateItems = async (processedData) => {
  for (let i = 0; i < processedData.length; i++) {
    const element = processedData[i];
    await require("axios")
      .put(`http://localhost:3333/products/items/${element._id}`, element)
      .then((response) => {
        console.log(`${element.labels} : done!`);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const main = async () => {
  const allTransactions = await getTransactions();
  const allItems = await getItems();
  const { newScoring, totalCount } = await countFreqSort(allTransactions, allItems);
  //   const randomTransactions = getRandomTransactions(5, allTransactions);
  //   console.log(randomTransactions);
  // const { level1, level2 } = getLevels(allItems);
  //   console.log(level1.length, level2.length);
  // console.log(allItems.length);
  const processedData = await preProcessData(newScoring);
  // const updating = await updateItems(processedData);
};

main();
