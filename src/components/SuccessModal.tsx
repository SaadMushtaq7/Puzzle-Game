import React, { FC } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

interface successModalProps {
  success: boolean;
  itemsRef: any;
  topButtonsRef: any;
  setSuccess: (value: React.SetStateAction<boolean>) => void;
}

const SuccessModal: FC<successModalProps> = ({
  success,
  itemsRef,
  topButtonsRef,
  setSuccess,
}) => {
  return (
    <Popup
      modal
      open={success}
      onClose={() => {
        itemsRef.style.display = "block";
        topButtonsRef.style.display = "none";
        setSuccess(false);
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
