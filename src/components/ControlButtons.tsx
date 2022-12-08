import React, { FC } from "react";

interface controlButtonProps {
  topButtonsRef: any;
  itemsRef: any;
  sizeRef: any;
  restart: any;
  initializePieces: any;
}

const ControlButtons: FC<controlButtonProps> = ({
  topButtonsRef,
  itemsRef,
  sizeRef,
  restart,
  initializePieces,
}) => {
  return (
    <div className="topButtons" ref={topButtonsRef}>
      <button onClick={restart} className="startAgainBtn">
        Play Again
      </button>

      <button
        onClick={() => {
          itemsRef.style.display = "block";
          initializePieces(sizeRef.rows, sizeRef.columns);
        }}
        className="newGameBtn"
      >
        New Game
      </button>
    </div>
  );
};

export default ControlButtons;
