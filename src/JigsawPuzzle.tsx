import React, { useState } from "react";
import { Puzzle, PuzzleGame } from "react-puzzle-game";
import Resizer from "react-image-file-resizer";
import Popup from "reactjs-popup";
import { RiImageAddFill } from "react-icons/ri";
import "reactjs-popup/dist/index.css";

const JigsawPuzzle = () => {
  const [imgUrl, setImgUrl] = useState<any>();
  const [success, setSuccess] = useState<boolean>(false);

  const fileChangedHandler = (event: any) => {
    if (event.target.files[0]) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          350,
          320,
          "JPEG",
          100,
          0,
          (uri) => {
            setImgUrl(uri);
          },
          "base64"
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="puzzleContainer">
      <h1 className="heading">The Puzzle</h1>
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
      {imgUrl && (
        <div className="mainPuzzleContainer">
          <div className="puzzleBox">
            <h2>Puzzle</h2>
            <PuzzleGame
              src={imgUrl}
              columnsCount={3}
              rowsCount={3}
              height={300}
              width={350}
              onFinish={() => setSuccess(true)}
            >
              <Puzzle />
            </PuzzleGame>
          </div>
          <div className="realImage">
            <h2>Actual Image</h2>
            <img src={imgUrl} alt="" />
          </div>
        </div>
      )}
      <Popup
        modal
        open={success}
        onClose={() => setSuccess(false)}
        position="right center"
      >
        <div className="modal">
          Congrats! <br />
          <span>On the Successfull completion of the puzzle</span>
        </div>
      </Popup>
    </div>
  );
};

export default JigsawPuzzle;
