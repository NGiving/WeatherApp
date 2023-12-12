// https://www.youtube.com/watch?v=bMknfKXIFA8&t=4465s
import Fortnight from "./component/Fortnight";
import Weekly from "./component/Weekly";
import Hourly from "./component/Hourly";
import Home from "./component/Home";
import { 
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/hourly/:country/:region/:city",
    element: <Hourly />,
  },
  {
    path: "/weekly/:country/:region/:city",
    element: <Weekly />,
  },
  {
    path: "/fortnight/:country/:region/:city",
    element: <Fortnight />,
  }
]);

export default function App() {
  return ( 
    <RouterProvider router={router} />
  );
}