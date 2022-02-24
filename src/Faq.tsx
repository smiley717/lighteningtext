import { css } from "@emotion/react";
import React, { ReactNode, useState } from "react";

const Faq = () => {
  const [isShowing, setShowing] = useState(false);

  const handleClose = () => {
    setShowing(false);
  };

  const handleOpen = () => {
    setShowing(true);
  };

  return (
    <>
      <FaqButton onClick={handleOpen} />
      <FaqPanel isShowing={isShowing} onClose={handleClose} />
    </>
  );
};

const FaqButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    css={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      textAlign: "center",
    }}
  >
    <button onClick={onClick} css={faqButtonStyles}>
      What's this?
    </button>
  </div>
);

const FaqPanel: React.FC<{ isShowing: boolean; onClose: () => void }> = ({
  isShowing,
  onClose,
}) => {
  const handleStopPropagation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      onClick={onClose}
      css={[{ display: isShowing ? "flex" : "none" }, panelContainer]}
    >
      <div onClick={handleStopPropagation} css={panelStyles}>
        <h1 css={headingStyles}>
          FAQ
          <div css={closeButtonContainerStyles}>
            <button onClick={onClose} css={closeButtonStyles}>
              X
            </button>
          </div>
        </h1>
        <FaqItem
          q="What is this?"
          a="I created this 3D scene to practice with Three.js"
        />
        <FaqItem q="Where are the facts?" a="I don't have any facts, sorry." />
        <FaqItem
          q="Can I see the code?"
          a={
            <>
              Sure!{" "}
              <a href="https://github.com/sidneynemzer/enlighteningfacts.com">
                Here's the code on GitHub
              </a>
            </>
          }
        />
      </div>
    </div>
  );
};

const FaqItem: React.FC<{ q: ReactNode; a: ReactNode }> = ({ q, a }) => (
  <>
    <h2>{q}</h2>
    <div>{a}</div>
  </>
);

const faqButtonStyles = css`
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
`;

const panelContainer = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  min-width: 350px;
`;

const panelStyles = css`
  background: white;
  padding: 20px;
  border-radius: 4px;
`;

const headingStyles = css`
  text-align: center;
  margin: 0;
  position: relative;
  padding: 0 40px;
`;

const closeButtonContainerStyles = css`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
`;

const closeButtonStyles = css`
  background: none;
  border: none;
  font-size: 14px;
  padding: 5px;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;

export default Faq;
