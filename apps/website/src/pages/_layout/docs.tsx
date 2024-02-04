import { Outlet } from "react-router-dom";

export default function DocsLayout() {
	return (
		<div className="min-h-screen bg-background font-sans antialiased">
			<Outlet />
		</div>
	);
}
