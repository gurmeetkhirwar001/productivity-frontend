import React from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";

export default function CommonModal(props) {
  return (
    <Modal open={props.open} onClose={props.onClose} center={true}>
      {props.children}
    </Modal>
  );
}
