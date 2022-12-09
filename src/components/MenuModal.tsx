import React, { FC } from "react";
import { RiImageAddFill } from "react-icons/ri";
import {
  difficultyLevel,
  restart,
  getDifficulty,
  initializePieces,
  fileChangedHandler,
} from "../helperFunctions";
interface menuModalProps {
  itemsRef: any;
  sizeRef: any;
  topButtonsRef: any;
  PIECES: any;
  canvasRef: any;
  helperCanvasRef: any;
  scaler: number;
  imgRef: any;
  contextRef: any;
  helperContextRef: any;
  mainContainerRef: any;
  imgUrl: any;
}

const MenuModal: FC<menuModalProps> = ({
  itemsRef,
  sizeRef,
  topButtonsRef,
  PIECES,
  canvasRef,
  helperCanvasRef,
  scaler,
  imgRef,
  contextRef,
  helperContextRef,
  mainContainerRef,
  imgUrl,
}) => {
  const difficultyHandler = (e: any) => {
    const temp = getDifficulty(e.target.value);
    initializePieces(temp.row, temp.column, topButtonsRef, sizeRef, PIECES);
  };

  return (
    <div id="menuItems" ref={itemsRef}>
      <div id="menu">
        <div id="controls">
          Difficulty
          <br />
          <select id="difficulty" onChange={(e) => difficultyHandler(e)}>
            {difficultyLevel.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
          <br />
          <br />
          <button
            onClick={() =>
              restart(
                PIECES,
                canvasRef,
                mainContainerRef,
                topButtonsRef,
                itemsRef
              )
            }
          >
            Start
          </button>
        </div>
      </div>
      <input
        className="chooseFile"
        type="file"
        id="file"
        accept="image/*"
        onChange={(e) =>
          fileChangedHandler(
            e,
            canvasRef,
            helperCanvasRef,
            scaler,
            sizeRef,
            imgRef,
            topButtonsRef,
            PIECES,
            contextRef,
            helperContextRef,
            imgUrl
          )
        }
      />
      <label htmlFor="file">
        <RiImageAddFill width={"20px"} height={"20px"} /> Choose a Photo
      </label>
    </div>
  );
};

export default MenuModal;
