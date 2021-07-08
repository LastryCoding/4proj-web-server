import axios from "axios";
let feedback = {};

//Create
export const createOne = async (url, data) => {
  await axios
    .post(url, data)
    .then((response) => {
      feedback = {
        status: response.status,
        message: response.data,
      };
    })
    .catch((err) => {
      if (err.response) {
        feedback = {
          status: err.code,
          message: err.response.data,
        };
      }
    });
  return feedback;
};

//Read
export const read = async (url) => {
  await axios
    .get(url)
    .then((response) => {
      feedback = {
        status: response.status,
        message: response.data,
      };
    })
    .catch((err) => {
      if (err.response) {
        feedback = {
          status: err.code,
          message: err.response.data,
        };
      }
    });
  return feedback;
};

//Update
export const updateOne = async (url, data) => {
  await axios
    .put(url, data)
    .then((response) => {
      feedback = {
        status: response.status,
        message: response.data,
      };
    })
    .catch((err) => {
      if (err.response) {
        feedback = {
          status: err.code,
          message: err.response.data,
        };
      }
    });
  return feedback;
};

//Delete
export const deleteOne = async (url) => {
  await axios
    .delete(url)
    .then((response) => {
      feedback = {
        status: response.status,
        message: response.data,
      };
    })
    .catch((err) => {
      if (err.response) {
        feedback = {
          status: err.code,
          message: err.response.data,
        };
      }
    });
  return feedback;
};

// AUTHENTICATION //

//Register
export const register = async (data) => {
  await axios
    .post("/auth", data)
    .then((response) => {
      feedback = {
        status: response.status,
        message: response.data,
      };
    })
    .catch((err) => {
      if (err.response) {
        feedback = {
          status: err.code,
          message: err.response.data,
        };
      }
    });
  return feedback;
};

//Log in
export const login = async (data) => {
  await axios
    .post("/auth/login", data)
    .then((response) => {
      feedback = {
        status: response.status,
        message: response.data,
      };
    })
    .catch((err) => {
      if (err.response) {
        feedback = {
          status: err.code,
          message: err.response.data,
        };
      }
    });
  return feedback;
};

//Private Route
export const prvRoute = async () => {
  await axios
    .get("/auth/prv")
    .then((response) => {
      feedback = {
        status: response.status,
        message: response.data,
      };
    })
    .catch((err) => {
      if (err.response) {
        feedback = {
          status: err.code,
          message: err.response.data,
        };
      }
    });
  return feedback;
};

export const isAuth = async () => {
  const result = await prvRoute();
  if (result.status === 200) {
    return true;
  }
  return false;
};

export const setInLocalStorage = async (entity, data) => {
  localStorage.setItem(entity, data);
};

export const getInLocalStorage = async (entity) => {
  const item = localStorage.getItem(entity);
  return item;
};

export const delInLocalStorage = async (entity) => {
  localStorage.removeItem(entity);
};

export const clearLocalStorage = async () => {
  await localStorage.clear();
  return true;
};

export const getUser = async () => {
  const user = await read("/auth/" + (await getInLocalStorage("userId")));
  if (user.status === 200) {
    return user.message;
  } else {
    return "undefined";
  }
};

export const getUrlAPI = async (user) => {
  let urlAPI = {
    myItemsAPI: "/products/itemsClient",
    myTransactionsAPI: "/products/transactionsClient",
    myItemsBuyAPI: "/products/itemsMarket",
    init: "",
    cart: `/products/cart/userId/${user._id}`,
    cartUpdate: `/products/cart/`,
    notif: `/products/notif/userId/${user._id}`,
    notifUpdate: `/products/notif`,
    recosys: `/products/recosys/${user._id}`,
    shelves: "/products/shelves",
  };
  switch (user.role) {
    case "MARKET":
      urlAPI = {
        myItemsAPI: "/products/itemsMarket",
        myTransactionsAPI: "/products/transactionsMarket",
        myItemsBuyAPI: "/products/itemsFournisseur",
        init: "/products/itemsMarket/init",
        cart: `/products/cart/userId/${user._id}`,
        cartUpdate: `/products/cart/`,
        notif: `/products/notif/userId/${user._id}`,
        notifUpdate: `/products/notif/`,
        recosys: `/products/recosys/${user._id}`,
        shelves: "/products/shelves",
      };
      return urlAPI;
    case "FOURNISSEUR":
      urlAPI = {
        myItemsAPI: "/products/itemsFournisseur",
        myTransactionsAPI: "/products/transactionsFournisseur",
        myItemsBuyAPI: "",
        init: "/products/itemsFournisseur/init",
        cart: "",
        notif: `/products/notif/userId/${user._id}`,
        notifUpdate: `/products/notif/`,
        recosys: `/products/recosys/${user._id}`,
        shelves: "",
      };
      return urlAPI;
    default:
      return urlAPI;
  }
};

export const categoriesProduct = async (data) => {
  let uniqueCategories = [];
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if (!uniqueCategories.includes(element.item.level1)) {
      uniqueCategories.push(element.item.level1);
    }
  }
  return uniqueCategories;
};

export const getOnlyCategories = (categorie, data) => {
  let newCategorieList = [];
  if (categorie === "Tous") {
    return data;
  } else {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if (element.item.level1 === categorie) {
        newCategorieList.push(element);
      }
    }
    return newCategorieList;
  }
};

export const reMoveItemFromCart = (data, id) => {
  let newData = {
    _id: data._id,
    userId: data.userId,
    items: [],
  };
  for (let i = 0; i < data.items.length; i++) {
    const element = data.items[i];
    if (element._id !== id) {
      newData.items.push(element);
    }
  }
  return newData;
};

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getOnlyRecommendedProductsFromData = (data, recomPrdct) => {
  let OnlyRecommendedProductsFromData = [];
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if (element.item.labels == recomPrdct[0][0] || element.item.labels == recomPrdct[1][0] || element.item.labels == recomPrdct[2][0]) {
      OnlyRecommendedProductsFromData.push(element);
    }
  }
  return OnlyRecommendedProductsFromData;
};

export const getBottomUp = (data) => {
  let listOfItems = [];
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    listOfItems[data.length - 1 - i] = element;
  }
  return listOfItems;
};

export const getItem = (nameItem, data) => {
  let newItem = {};
  if (nameItem === "Veuillez faire un choix") {
    return newItem;
  } else {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if (element.item.labels === nameItem) {
        newItem = element;
      }
    }
    return newItem;
  }
};

export const getItemMarketNotInAnShelve = (AllShelves, AllItemMarket) => {
  let listOfItemMarketInAnyShelve = [];
  for (let i = 0; i < AllItemMarket.length; i++) {
    let absentInAllShelves = true;
    const oneItemMarket = AllItemMarket[i];
    for (let j = 0; j < AllShelves.length; j++) {
      const oneShelve = AllShelves[j];
      for (let k = 0; k < oneShelve.items.length; k++) {
        const oneItemOfOneShelve = oneShelve.items[k];
        if (oneItemMarket.item._id.toString() === oneItemOfOneShelve.item._id.toString()) {
          absentInAllShelves = false;
          k = oneShelve.items.length;
          j = AllShelves.length;
        }
      }
    }
    if (absentInAllShelves) {
      listOfItemMarketInAnyShelve.push(oneItemMarket);
    }
  }
  return listOfItemMarketInAnyShelve;
};

export const getShelveByName = (AllShelves, Name) => {
  let oneShelve = {};
  for (let i = 0; i < AllShelves.length; i++) {
    const shelve = AllShelves[i];
    if (shelve.name === Name) {
      oneShelve = shelve;
    }
  }
  return oneShelve;
};
