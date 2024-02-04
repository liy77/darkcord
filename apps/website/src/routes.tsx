import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./pages/_layout/app";
import GlobalError from "./pages/_global-error";
import NotFound from "./pages/not-found";
import HomePage from "./pages/app/page";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		errorElement: <GlobalError />,
		children: [
			{
				path: "/",
				element: <HomePage />,
			},
		],
	},
	{
		path: "*",
		element: <NotFound />,
	},
]);
