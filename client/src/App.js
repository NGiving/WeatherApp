// https://www.youtube.com/watch?v=bMknfKXIFA8&t=4465s
import Fortnight from "./component/Fortnight";
import Weekly from "./component/Weekly";
import Hourly from "./component/Hourly";
import Root from "./component/Root";
import { 
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./component/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />
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