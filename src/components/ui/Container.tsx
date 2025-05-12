import React from "react";
import styles from "./Container.module.scss";

const Container: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = (props) => {
  const classNames =
    [styles.container] + (props.className ? ` ${props.className}` : "");

  return (
    <div {...props} className={classNames}>
      {props.children}
    </div>
  );
};

export default Container;
