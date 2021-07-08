import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Layout from "./../../components/layout/layout";

import ViewAllItems from "./../../components/pages/produits/viewAllItems";
import IndexLandingPage from "./../../components/pages/index/index";
import BrowseProduits from "./../../components/pages/produits/browse";
import Cart from "./../../components/pages/produits/cart";
import Recommendation from "../../components/pages/produits/recommendation";
import RecommendationWithBuy from "../../components/pages/produits/recommendationWithBuy";

import ViewOneShelve from "./../../components/pages/rayons/viewOne";
import ClientViewOneShelve from "./../../components/pages/rayons/clientViewOneShelve";
import ViewAllShelves from "../../components/pages/rayons/viewAllShelves";
import ClientViewAllShelves from "../../components/pages/rayons/clientViewAllShelves";
import Assignment from "../../components/pages/rayons/assignment";

import ViewOne from "./../../components/pages/autres/viewOne";
import ViewTransactions from "./../../components/pages/autres/viewAllTransactions";
import ViewNotifications from "../../components/pages/autres/viewNotifications";
import ViewProfile from "../../components/pages/autres/viewProfile";

import { produitsViewAll, cartForm } from "./../../common/forms/produits";
import {
  createOne,
  read,
  updateOne,
  deleteOne,
  getUser,
  getUrlAPI,
  categoriesProduct,
  getOnlyCategories,
  reMoveItemFromCart,
} from "./../../common/requests/requests";

async function getData() {
  const user = await getUser();
  let urlAPI,
    myItems,
    myItemsBuy,
    myTransactions,
    uniqueCategoriesMyItems,
    uniqueCategoriesMyItemsBuy,
    myCart,
    shelves,
    myNotifications = {};

  urlAPI = await getUrlAPI(user);
  const readMyItemsResult = await read(urlAPI.myItemsAPI);
  if (readMyItemsResult.status === 200) {
    myItems = [];
    for (let i = 0; i < readMyItemsResult.message.length; i++) {
      const item = readMyItemsResult.message[i];
      if (item.userId === user._id) {
        myItems.push(item);
      }
    }
  }
  uniqueCategoriesMyItems = await categoriesProduct(myItems);
  if (user.role !== "FOURNISSEUR") {
    const readMyItemsBuyResult = await read(urlAPI.myItemsBuyAPI);
    if (readMyItemsBuyResult.status === 200) {
      myItemsBuy = readMyItemsBuyResult.message;
      uniqueCategoriesMyItemsBuy = await categoriesProduct(readMyItemsBuyResult.message);
    }
    const readMyCartResult = await read(urlAPI.cart);
    if (readMyCartResult.status === 200) {
      myCart = readMyCartResult.message;
    } else {
      myCart = [];
    }
  }
  const readMyTransactionsResult = await read(urlAPI.myTransactionsAPI);
  if (readMyTransactionsResult.status === 200) {
    myTransactions = readMyTransactionsResult.message;
  }
  const readMyNotifications = await read(urlAPI.notif);
  if (readMyNotifications.status === 200) {
    myNotifications = readMyNotifications.message;
  }
  if (user.role === "MARKET" || user.role === "CLIENT") {
    const readShelves = await read(urlAPI.shelves);
    if (readShelves.status === 200) {
      shelves = readShelves.message;
    }
  }
  return {
    user,
    urlAPI,
    myItems,
    myItemsBuy,
    myTransactions,
    uniqueCategoriesMyItems,
    uniqueCategoriesMyItemsBuy,
    myCart,
    shelves,
    myNotifications,
  };
}

export default function IndexHome(props) {
  const [User, setUser] = useState({});
  const [UrlAPI, setUrlAPI] = useState({});

  const [Loading, setLoading] = useState(true);

  const [UniqueCategoriesMyItems, setUniqueCategoriesMyItems] = useState([]);
  const [UniqueCategoriesMyItemsBuy, setUniqueCategoriesMyItemsBuy] = useState([]);

  const [MyCart, setMyCart] = useState();

  const [Shelves, setShelves] = useState([]);
  const [ShelvesCreateConfirmation, setShelvesCreateConfirmation] = useState([]);
  const [ShelvesUpdateConfirmation, setShelvesUpdateConfirmation] = useState([]);

  const [MyItems, setMyItems] = useState();
  const [MyItemsBuy, setMyItemsBuy] = useState([]);
  const [MyTransactions, setMyTransactions] = useState([]);
  const [MyNotifications, setMyNotifications] = useState([]);

  const [InitConfirmation, setInitConfirmation] = useState();

  const [CreateConfirmation, setCreateConfirmation] = useState({});
  const [CreateErrors, setCreateErrors] = useState({});

  const [DeleteConfirmation, setDeleteConfirmation] = useState({});
  const [ConsomeConfirmation, setConsomeConfirmation] = useState({});

  async function fetchData() {
    setLoading(true);
    let { user, urlAPI, myItems, myItemsBuy, myTransactions, uniqueCategoriesMyItems, uniqueCategoriesMyItemsBuy, myCart, shelves, myNotifications } =
      await getData();
    setUser(user);
    setUrlAPI(urlAPI);
    setMyItems(myItems);
    setMyItemsBuy(myItemsBuy);
    setMyTransactions(myTransactions);
    setUniqueCategoriesMyItems(uniqueCategoriesMyItems);
    setUniqueCategoriesMyItemsBuy(uniqueCategoriesMyItemsBuy);
    setMyCart(myCart);
    setShelves(shelves);
    setMyNotifications(myNotifications);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const submitNewCart = async (data) => {
    setLoading(true);
    const createResult = await createOne(UrlAPI.cart, data);
    if (createResult.status === 201) {
      setCreateConfirmation({ message: createResult.message });
      setCreateErrors({});
      fetchData();
    } else {
      setCreateErrors(createResult.message);
    }
    setLoading(false);
  };

  const submitNewShelve = async (data) => {
    setLoading(true);
    const createResult = await createOne(UrlAPI.shelves, data);
    if (createResult.status === 201) {
      setShelvesCreateConfirmation({ message: createResult.message });
      fetchData();
    }
    setLoading(false);
  };
  const submitUpdateShelve = async (data, id) => {
    setLoading(true);
    const updateResult = await updateOne(`${UrlAPI.shelves}/${id}`, data);
    setShelvesUpdateConfirmation({ message: updateResult.message });
    fetchData();
    setLoading(false);
  };

  const buyItems = async (cart) => {
    setLoading(true);
    const createResult = await createOne(UrlAPI.myItemsAPI, cart);
    if (createResult.status === 200) {
      fetchData();
    }
    setLoading(false);
  };

  const deleteFromCart = async (data, id) => {
    setLoading(true);
    const newData = await reMoveItemFromCart(data, id);
    await submitUpdateCart(newData, newData._id);
    setLoading(false);
  };

  const submitUpdateCart = async (data, id) => {
    setLoading(true);
    await updateOne(`${UrlAPI.cartUpdate}${id}`, data);
    fetchData();
    setLoading(false);
  };

  const submitUpdateUser = async (data, id) => {
    setLoading(true);
    await updateOne(`/auth/${id}`, data);
    fetchData();
    setLoading(false);
  };

  const submitNotifUpdate = async (data, id) => {
    setLoading(true);
    await updateOne(`${UrlAPI.notifUpdate}/${id}`, data);
    fetchData();
    setLoading(false);
  };

  const submitNotifDelete = async (id) => {
    setLoading(true);
    await deleteOne(`${UrlAPI.notifUpdate}/${id}`);
    fetchData();
    setLoading(false);
  };

  const submitConsome = async (data, id) => {
    setLoading(true);
    await updateOne(`${UrlAPI.myItemsAPI}/${id}`, data);
    setConsomeConfirmation({ message: "Produit consommé avec succès" });
    fetchData();
    setLoading(false);
  };

  const submitDeleteMyItems = async (id) => {
    setLoading(true);
    const deleteResult = await deleteOne(`${UrlAPI.myItemsAPI}/${id}`);
    if (deleteResult.status === 200) {
      setDeleteConfirmation({ message: deleteResult.message });
      fetchData();
    } else {
      console.error(deleteResult.message);
    }
    setLoading(false);
  };

  const submitDeleteShelve = async (id) => {
    setLoading(true);
    const deleteResult = await deleteOne(`${UrlAPI.shelves}/${id}`);
    if (deleteResult.status === 200) {
      setDeleteConfirmation({ message: deleteResult.message });
      fetchData();
    } else {
      console.error(deleteResult.message);
    }
    setLoading(false);
  };

  const initDb = async () => {
    setLoading(true);
    if (User.role !== "CLIENT") {
      const initResult = await createOne(`${UrlAPI.init}`, User);
      if (initResult.status === 200) {
        setInitConfirmation({ message: initResult.message });
        fetchData();
      } else {
        console.error(initResult.message);
      }
    }
    setLoading(false);
  };

  const initShelves = async () => {
    setLoading(true);
    if (User.role === "MARKET") {
      const initShelvesResult = await createOne(`${UrlAPI.shelves}/init`, User);
      if (initShelvesResult.status === 200) {
        fetchData();
      } else {
        console.error(initShelvesResult.message);
      }
    }
    setLoading(false);
  };

  if (!Loading) {
    return (
      <Layout user={User} myCart={MyCart} myNotif={MyNotifications}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/home/">
              <IndexLandingPage
                user={User}
                myItems={MyItems}
                myItemsBuy={MyItemsBuy}
                myTransactions={MyTransactions}
                init={initDb}
                confirmation={InitConfirmation}
              />
            </Route>
            <Route exact path="/home/profil">
              <ViewProfile user={User} submitUpdateUser={submitUpdateUser} />
            </Route>
            <Route exact path="/home/inventaire/">
              <ViewAllItems
                form={produitsViewAll}
                uniqueCategories={UniqueCategoriesMyItems}
                user={User}
                data={MyItems}
                deleteFct={submitDeleteMyItems}
                getOnlyCategories={getOnlyCategories}
                submitConsome={submitConsome}
                confirmation={ConsomeConfirmation}
              />
            </Route>
            {User.role ? (
              User.role === "FOURNISSEUR" ? null : User.role === "MARKET" ? (
                <Route exact path="/home/browse/">
                  <BrowseProduits
                    form={produitsViewAll}
                    uniqueCategories={UniqueCategoriesMyItemsBuy}
                    user={User}
                    data={MyItemsBuy}
                    submitFct={submitNewCart}
                    confirmation={CreateConfirmation}
                    getOnlyCategories={getOnlyCategories}
                  />
                </Route>
              ) : (
                <Route exact path="/home/browse/">
                  <ClientViewAllShelves user={User} data={Shelves} />
                  <Recommendation urlApi={UrlAPI} user={User} data={MyItemsBuy} />
                </Route>
              )
            ) : null}
            <Route exact path="/home/browse/:id">
              <ClientViewOneShelve
                urlApi={UrlAPI}
                user={User}
                inventory={MyItems}
                getOnlyCategories={getOnlyCategories}
                uniqueCategories={UniqueCategoriesMyItemsBuy}
                submitFct={submitNewCart}
                confirmation={CreateConfirmation}
              />
            </Route>
            <Route exact path="/home/transactions/">
              <ViewTransactions data={MyTransactions} />
            </Route>
            <Route exact path="/home/transactions/:id">
              <ViewOne urlApi={UrlAPI} />
            </Route>
            <Route exact path="/home/notifications/">
              <ViewNotifications data={MyNotifications} submitNotifUpdate={submitNotifUpdate} submitNotifDelete={submitNotifDelete} />
            </Route>
            {User.role ? (
              User.role === "FOURNISSEUR" ? null : (
                <Route exact path="/home/cart/">
                  <Cart
                    form={cartForm}
                    uniqueCategories={UniqueCategoriesMyItemsBuy}
                    user={User}
                    data={MyCart}
                    deleteFct={deleteFromCart}
                    buyItems={buyItems}
                    confirmation={CreateConfirmation}
                    confirmationErrors={CreateErrors}
                    getOnlyCategories={getOnlyCategories}
                  />
                  {User.role === "CLIENT" ? (
                    <Recommendation urlApi={UrlAPI} user={User} data={MyItemsBuy} />
                  ) : (
                    <RecommendationWithBuy
                      urlApi={UrlAPI}
                      user={User}
                      data={MyItemsBuy}
                      submitFct={submitNewCart}
                      confirmation={CreateConfirmation}
                    />
                  )}
                </Route>
              )
            ) : null}
            <Route exact path="/home/shelves">
              <ViewAllShelves
                user={User}
                data={Shelves}
                submit={submitNewShelve}
                confirmation={ShelvesCreateConfirmation}
                initShelves={initShelves}
              />
            </Route>
            <Route exact path="/home/shelves/:id">
              <ViewOneShelve
                urlApi={UrlAPI}
                user={User}
                inventory={MyItems}
                getOnlyCategories={getOnlyCategories}
                uniqueCategories={UniqueCategoriesMyItems}
                submitUpdate={submitUpdateShelve}
                confirmation={ShelvesUpdateConfirmation}
                submitDelete={submitDeleteShelve}
              />
            </Route>
            <Route exact path="/home/assignment">
              <Assignment
                user={User}
                inventory={MyItems}
                shelves={Shelves}
                getOnlyCategories={getOnlyCategories}
                uniqueCategories={UniqueCategoriesMyItems}
                submitUpdate={submitUpdateShelve}
                // confirmation={ShelvesUpdateConfirmation}
                // submitDelete={submitDeleteShelve}
              />
            </Route>
          </Switch>
        </BrowserRouter>
      </Layout>
    );
  } else {
    return <div className="loader"></div>;
  }
}
