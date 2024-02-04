import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./pages/_layout/app";
import GlobalError from "./pages/_global-error";
import NotFound from "./pages/not-found";
import HomePage from "./pages/app/page";
import DocsLayout from "./pages/_layout/docs";
import DocsPage from "./pages/app/docs/page";
import DocsClassPage from "./pages/app/docs/[source]/[tag]/class/[item]";
import DocsSourcePage from "./pages/app/docs/[source]/page";
import DocsTagPage from "./pages/app/docs/[source]/[tag]/page";
import DocsItemLayout from "./pages/_layout/docs-item";
import DocsFunctionPage from "./pages/app/docs/[source]/[tag]/function/[item]";
import DocsTypedefPage from "./pages/app/docs/[source]/[tag]/typedef/[item]";

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
		path: "/",
		element: <DocsLayout />,
		children: [
			{
				path: "/docs",
				element: <DocsPage />,
			},
			{
				path: "/docs/:source",
				element: <DocsSourcePage />,
			},
		],
	},
	{
		path: "/",
		element: <DocsItemLayout />,
		children: [
			{
				path: "/docs/:source/:tag",
				element: <DocsTagPage />,
			},
			{
				path: "/docs/:source/:tag/class/:item",
				element: <DocsClassPage />,
			},
			{
				path: "/docs/:source/:tag/function/:item",
				element: <DocsFunctionPage />,
			},
			{
				path: "/docs/:source/:tag/typedef/:item",
				element: <DocsTypedefPage />,
			},
		],
	},
	{
		path: "*",
		element: <NotFound />,
	},
]);
