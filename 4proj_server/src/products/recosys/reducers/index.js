exports.reduceData = (data) => {
  let articlesName = [];
  for (let i = 0; i < data.items.length; i++) {
    const element = data.items[i];
    articlesName.push(element.item.labels);
  }
  return articlesName;
};
