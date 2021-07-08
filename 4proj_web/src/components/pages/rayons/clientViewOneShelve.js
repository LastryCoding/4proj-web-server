import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { read } from "./../../../common/requests/requests";
import BrowseProduits from "../produits/browse";

export default function ClientViewOneShelve({ urlApi, user, inventory, confirmation, getOnlyCategories, uniqueCategories, submitFct }) {
  const [OneShelve, setOneShelve] = useState({});

  const { id } = useParams();
  const getOneShelve = async (id) => {
    const shelveResult = await read(`${urlApi.shelves}/${id}`);
    if (shelveResult.status === 200) {
      setOneShelve(shelveResult.message);
    } else {
      setOneShelve({});
    }
  };
  useEffect(() => {
    getOneShelve(id);
  }, []);

  return (
    <BrowseProduits
      urlApi={urlApi}
      user={user}
      inventory={inventory}
      confirmation={confirmation}
      getOnlyCategories={getOnlyCategories}
      uniqueCategories={uniqueCategories}
      submitFct={submitFct}
      data={OneShelve.items}
      form={{ title: OneShelve.name }}
    />
  );
}
