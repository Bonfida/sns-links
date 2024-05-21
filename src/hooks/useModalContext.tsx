import { ModalContext } from "../context/modalContext";
import { useContext } from "react";

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal context missing");
  }
  return context;
};
