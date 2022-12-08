import React, { FC } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { difficultyLevel } from "../helperFunctions";
interface menuModalProps {
  itemsRef: any;
  setDifficulty: (e: any) => void;
  fileChangedHandler: (e: any) => void;
  restart: () => void;
}

const MenuModal: FC<menuModalProps> = ({
  itemsRef,
  setDifficulty,
  fileChangedHandler,
  restart,
}) => {
  return (
    <div id="menuItems" ref={itemsRef}>
      <div id="menu">
        <div id="controls">
          Difficulty
          <br />
          <select id="difficulty" onChange={(e) => setDifficulty(e)}>
            {difficultyLevel.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
          <br />
          <br />
          <button onClick={restart}>Start</button>
        </div>
      </div>
      <input
        className="chooseFile"
        type="file"
        id="file"
        accept="image/*"
        onChange={(e) => fileChangedHandler(e)}
      />
      <label htmlFor="file">
        <RiImageAddFill width={"20px"} height={"20px"} /> Choose a Photo
      </label>
    </div>
  );
};

export default MenuModal;
