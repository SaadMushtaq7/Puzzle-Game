import React, { FC } from "react";
import { restart, initializePieces } from "../helpers/canvasManipulation";

interface controlButtonProps {
  topButtonsRef: any;
  itemsRef: any;
  sizeRef: any;
  PIECES: any;
  canvasRef: any;
  mainContainerRef: any;
}

const ControlButtons: FC<controlButtonProps> = ({
  topButtonsRef,
  itemsRef,
  sizeRef,
  PIECES,
  canvasRef,
  mainContainerRef,
}) => {
  return (
    <div>
      <button
        onClick={() =>
          restart(PIECES, canvasRef, mainContainerRef, topButtonsRef, itemsRef)
        }
        className="startAgainBtn"
      >
        Play Again
      </button>

      <button
        onClick={() => {
          itemsRef.current.style.display = "block";
          initializePieces(
            sizeRef.current.rows,
            sizeRef.current.columns,
            topButtonsRef,
            sizeRef,
            PIECES
          );
        }}
        className="newGameBtn"
      >
        New Game
      </button>
    </div>
  );
};

export default ControlButtons;
