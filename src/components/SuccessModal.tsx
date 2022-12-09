import React, { FC } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

interface successModalProps {
  success: any;
  itemsRef: any;
  topButtonsRef: any;
}

const SuccessModal: FC<successModalProps> = ({
  success,
  itemsRef,
  topButtonsRef,
}) => {
  return (
    <Popup
      modal
      open={success.current}
      onClose={() => {
        itemsRef.current.style.display = "block";
        topButtonsRef.curent.style.display = "none";
        success.current = false;
      }}
      position="right center"
    >
      <div className="modal">
        <>
          Congrats! <br />
          <span>On the Successfull completion of the puzzle!</span>
        </>
      </div>
    </Popup>
  );
};

export default SuccessModal;
