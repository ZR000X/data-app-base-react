import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";

export const useMonacoTheme = () => {
  const theme = useTheme();
  const [monacoTheme, setMonacoTheme] = useState("light");

  useEffect(() => {
    setMonacoTheme(theme.palette.mode === "dark" ? "vs-dark" : "light");
  }, [theme.palette.mode]);

  return monacoTheme;
};
