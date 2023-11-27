import React from "react";

export default function WalletsModal() {
  return (
    <>
      <button
        className="btn"
        onClick={() => {
          const modal = document.getElementById("my_modal_2");
          if (modal instanceof HTMLDialogElement) {
            modal.showModal();
          }
        }}
      >
        open modal
      </button>
    </>
  );
}
