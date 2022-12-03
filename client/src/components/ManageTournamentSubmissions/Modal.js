import "./modal.css";

import React from "react";

function Modal({ handleClose, show, children, data }) {
  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }
  const arr1 = getUniqueListBy(data, "problem");

  console.log(arr1);

  const showHideClassName = show ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {arr1.map((user) => {
          return (
            <div className="m-5">
              <p>Problem : {user.problem}</p>
              {/*<p>{user.stdout.replace(/(?:\r\n|\r|\n)/g, "<br>")}</p>*/}
              <pre className="py-4">
                {user.stdout.replace(/(?:\r\n|\r|\n)/g, `\n`)}
              </pre>
            </div>
          );
        })}

        <button type="button" onClick={handleClose}>
          Close
        </button>
      </section>
    </div>
  );
}

export default Modal;
