import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { URL } from "../commons/Constants";
import {
  getAuthorization,
  parseLocalJwt,
  textToLowerCaseNoSpaces,
} from "../commons/Utils";
import PathLink from "../PathLink/PathLink";
import Popup from "../Popup/Popup";

function ManageCategories() {
  const [categories, setCategories] = useState([]);

  const location = useLocation();
  const modalAdd = useRef();
  const inputCategoryName = useRef();

  //prevent windows.reload
  const [newCategory, setNewCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [newCategory]);

  function fetchCategories() {
    fetch(URL + "/api/database/PractiseCategory/view", {
      headers: { ...getAuthorization() },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
    setNewCategory(false);
  }

  function deleteCategory(pc) {
    fetch(URL + "/api/database/PractiseCategory/delete/" + pc.id, {
      method: "POST",
      headers: { ...getAuthorization() },
    }).then(() => {
      fetchCategories();
    });
  }

  function onAddCategory() {
    const data = { name: inputCategoryName.current.value };
    fetch(URL + "/api/database/PractiseCategory/add", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
        ...getAuthorization(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        let newCategories = categories;
        newCategories.push(data);
        setCategories(newCategories);

        modalAdd.current.closeModal();
        setNewCategory(true);
      });
  }

  function PopupAddCategory() {
    return (
      <div className="">
        <h2 style={{ color: "black", marginTop: "-5px", marginBottom: "5px" }}>
          Add category
        </h2>
        <div className="row">
          <input
            autofocus
            style={{ margin: "15px" }}
            name="categoryName"
            className="textbox"
            id="input-add-category"
            ref={inputCategoryName}
            type="text"
            placeholder="Category name"
          />
          <input
            type="button"
            className="btn btn-codeflex"
            id="input-save-category"
            onClick={onAddCategory}
            value="Save"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PathLink
        path={location.pathname}
        title="Manage Categories"
        user={parseLocalJwt().username}
      />
      <h3 className="px-8 pb-8">
        Categories with at least one problem will be shown on 'Practise'
        section.
      </h3>
      <div class="w-full h-full flex justify-center items-center">
        <div
          id="main"
          class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 justify-evenly px-8 gap-4 "
        >
          <div className="w-full h-full rounded-lg bg-white border">
            <div class=" h-5/6 flex justify-center items-center">
              <div
                className="h-10 w-10 bg-blue-500 rounded rounded-full flex justify-center items-center"
                onClick={() => modalAdd.current.openModal()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 fill-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {categories.map((c, i) => (
            <div className="w-full h-full rounded-lg bg-white border">
              <div className="p-8 text-center">
                <div className=" flex text-center justify-center items-center">
                  <h3 className="font-semibold text-2xl  ">{c.name}</h3>
                  <div className="flex ml-auto justify-center items-cente">
                    <div
                      className="h-10 w-10 bg-blue-500 rounded rounded-full flex justify-center items-center"
                      onClick={() => deleteCategory(c)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 fill-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className="border"></div>
                <br></br>
                {c.problem.map((p, i) => (
                  <div>
                    <Link
                      to={
                        "/manage/problems/" +
                        textToLowerCaseNoSpaces(p.name) +
                        "/edit"
                      }
                    >
                      <p
                        style={{
                          fontFamily: "Roboto Condensed",
                          fontSize: "10pt",
                        }}
                      >
                        {p.name}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Popup ref={modalAdd}>
            <PopupAddCategory />
          </Popup>
        </div>
      </div>
    </div>
  );
}

export default ManageCategories;
