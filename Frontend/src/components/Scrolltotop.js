import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Scrolltotop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({top:0, behavior:"auto"});
  }, [pathname]);
};

export default Scrolltotop;
